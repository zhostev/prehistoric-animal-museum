"""Blender normalization stage of the animal-onboarding toolchain.

Usage:
  blender --background --factory-startup \
    --python tools/animal-onboarding/blender/normalize_animal.py -- \
    --profile assets/candidates/<run>/<animal>/profile.json

One animal per run. Reads the profile, verifies the archived source sha256,
normalizes scale/orientation/grounding to the production convention
(head toward Blender +Y == glTF -Z, feet at y=0, 24 fps), keeps or synthesizes
exactly one 8-second looping LINEAR-keyed `Idle` action, measures landmarks
back into the profile, renders neutral + motion evidence (hard-fails under 1%
pixel change between t=0s and t=4s), exports output/model/model.glb, saves
blender/workspace.blend and writes blender/normalization.log.
"""

import json
import math
import os
import sys

import bmesh
import bpy
import numpy as np
from mathutils import Quaternion, Vector

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from normalize_lib import (  # noqa: E402
    FPS,
    IDLE_END_FRAME,
    HardFail,
    Log,
    all_world_vertices,
    assign_action,
    blender_to_gltf,
    delete_other_actions,
    export_glb,
    inspect_mouth,
    measure_landmarks,
    render_motion_frames,
    render_views,
    retime_action_linear,
    scene_meshes,
    setup_scene_defaults,
    sha256_file,
    triangle_count,
    verify_motion_pixels,
    verify_source,
)
from refine_materials import (  # noqa: E402
    author_ammonite_materials,
    author_sculpt_palette_materials,
    author_aquatic_scan_materials,
    author_sculpt_materials,
    author_smilodon_materials,
    refine_quaternius_materials,
)
from texture_materials import (  # noqa: E402
    bake_normal_from_highpoly,
    bake_procedural_textures,
    texture_bake_config,
)

# Real-world body lengths (meters) from published sizes; the profile schema
# has no size field, so the per-run values are pinned here and logged.
BODY_LENGTHS_M = {
    "velociraptor": 2.0,   # Velociraptor mongoliensis ~2 m
    "parasaurolophus": 9.0,  # Parasaurolophus walkeri ~9 m
    "dunkleosteus": 6.0,   # Dunkleosteus terrelli ~6 m
    "jaekelopterus": 2.5,  # upper-end Jaekelopterus estimate; identity remains human-reviewable
    "smilodon": 2.1,       # compact adult body length including the short tail
    "spinosaurus": 13.0,   # Spinosaurus aegyptiacus ~13 m (matches the published content copy)
}

EXPANSION_CATALOG = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "expansion-100.json"))


def body_length_m(animal_id):
    """Declared body length in metres. Hand-maintained entries win; the
    expansion catalogue supplies the rest so a new animal does not need a code
    edit just to record how long it is."""
    if animal_id in BODY_LENGTHS_M:
        return BODY_LENGTHS_M[animal_id]
    entry = expansion_entry(animal_id)
    if entry is None:
        raise HardFail(f"no declared body length for {animal_id}")
    length = entry.get("wingspan") or entry.get("length")
    if not length:
        raise HardFail(f"expansion entry for {animal_id} declares no length")
    return float(length)


def expansion_entry(animal_id):
    if not os.path.exists(EXPANSION_CATALOG):
        return None
    with open(EXPANSION_CATALOG, encoding="utf-8") as handle:
        catalog = json.load(handle)
    return next((item for item in catalog.get("animals", [])
                 if item.get("id") == animal_id), None)

CONVENTION_NOTE = (
    "production orientation convention (measured 2026-08-10 from "
    "src/content/animals/maiasaura + mosasaurus model.glb): maiasaura and the "
    "plesiosaurus/megalodon golden samples carry the body along glTF Z with the "
    "head toward glTF -Z (Blender +Y), feet at glTF y=0, 24 fps, Idle frames "
    "0..192 (8.0 s), LINEAR keys, initialYawDegrees -90. mosasaurus is a legacy "
    "exception (body along glTF X, yaw 0, morph-target Idle) and was NOT used "
    "as the template. This stage normalizes to: head -> Blender +Y (glTF -Z), "
    "+Z up, land feet at z=0, water animals centred vertically."
)


def parse_args():
    argv = sys.argv[sys.argv.index("--") + 1:]
    if argv[:1] != ["--profile"] or len(argv) != 2:
        raise HardFail("usage: normalize_animal.py -- --profile <profile.json>")
    return os.path.abspath(argv[1])


def select_only(objects):
    if bpy.context.object is not None and bpy.context.object.mode != "OBJECT":
        bpy.ops.object.mode_set(mode="OBJECT")
    for ob in bpy.context.scene.objects:
        ob.select_set(False)
    for ob in objects:
        ob.select_set(True)
    bpy.context.view_layer.objects.active = objects[0]


def apply_transform(objects, **kwargs):
    select_only(objects)
    bpy.ops.object.transform_apply(**kwargs)


def _transform_roots(objects):
    """Only objects whose parent is not itself transformed; children (e.g. the
    mesh is parented to the armature in Quaternius sources) inherit the
    transform and must not get it a second time."""
    chosen = [ob for ob in objects if not (ob.parent is not None and ob.parent in objects)]
    return chosen


def rotate_to_production_forward(objects, log, animal_id, apply=False):
    """Sources face Blender -Y; production forward is +Y. Rotate 180 about Z.

    Rigged sources keep the rotation on the OBJECTS (applying it to armature
    data would re-aim the bone-local pose fcurve values and break the clip;
    production models like maiasaura likewise carry node-level rotations).
    Unrigged meshes apply it into the data before any armature exists."""
    targets = _transform_roots(objects)
    for ob in targets:
        ob.rotation_euler.z = math.pi
    if apply:
        apply_transform(targets, location=False, rotation=True, scale=False)
        log.add(f"{animal_id}: source faces Blender -Y; rotated 180 deg about Z, "
                f"applied to mesh data -> head now toward +Y (glTF -Z)")
    else:
        log.add(f"{animal_id}: source faces Blender -Y; 180 deg Z rotation kept on "
                f"object node(s) {[ob.name for ob in targets]} (rigged source: applying "
                f"to armature data would break bone-local pose fcurves; child meshes "
                f"inherit the node transform; matches the production maiasaura "
                f"package) -> head now toward +Y (glTF -Z)")


def scale_to_body_length(objects, body_length_m, log, apply=False):
    armatures = [ob for ob in objects if ob.type == "ARMATURE"]
    for arm in armatures:
        arm.data.pose_position = "REST"  # straight-pose body length
    verts = all_world_vertices()
    for arm in armatures:
        arm.data.pose_position = "POSE"
    span = float(verts[:, 1].max() - verts[:, 1].min())
    factor = body_length_m / span
    targets = _transform_roots(objects)
    for ob in targets:
        ob.scale = (factor, factor, factor)
    if apply:
        apply_transform(targets, location=False, rotation=False, scale=True)
        where = "applied to mesh data"
    else:
        where = (f"kept on object node(s) {[ob.name for ob in targets]} "
                 f"(armature-space pose fcurves stay in source units)")
    log.add(f"scale: source body length {span:.4f} Blender units -> "
            f"{body_length_m} m; uniform factor {factor:.6f} {where}")
    return factor


def ground_or_centre(objects, habitat, log, apply=False):
    bpy.context.scene.frame_set(0)  # deterministic reference pose
    verts = all_world_vertices()
    if habitat == "land":
        offset = -float(verts[:, 2].min())
        what = f"grounding (land): shifted z by {offset:+.5f} m so the lowest vertex rests at z=0"
    else:
        offset = -float((verts[:, 2].min() + verts[:, 2].max()) / 2.0)
        what = (f"grounding (water): shifted z by {offset:+.5f} m so the body is "
                f"centred vertically in the water column (z-centre = 0)")
    targets = _transform_roots(objects)
    for ob in targets:
        ob.location.z += offset
    if apply:
        apply_transform(targets, location=True, rotation=False, scale=False)
    log.add(what + ("" if apply else " (object node translation)"))


def prune_objects(expected_mesh_count, log):
    armature = None
    meshes = []
    for ob in list(bpy.context.scene.objects):
        if ob.type == "ARMATURE":
            armature = ob
        elif ob.type == "MESH" and (len(ob.vertex_groups) or len(ob.modifiers)):
            meshes.append(ob)
        else:
            log.add(f"removed stray non-animal object '{ob.name}' ({ob.type})")
            bpy.data.objects.remove(ob, do_unlink=True)
    if len(meshes) != expected_mesh_count:
        raise HardFail(f"expected {expected_mesh_count} skinned mesh(es), found {len(meshes)}")
    return armature, meshes


def update_profile_landmarks(profile_path, profile, landmarks, log):
    profile["landmarks"] = landmarks
    with open(profile_path, "w", encoding="utf-8") as handle:
        json.dump(profile, handle, indent=2, ensure_ascii=False)
        handle.write("\n")
    log.add(f"profile landmarks written to {os.path.basename(profile_path)}: "
            f"head={landmarks['head']} tailTip={landmarks['tailTip']} "
            f"contacts={landmarks['contacts']} (glTF meters, +Y up)")


def finish(profile_path, profile, profile_dir, armature, habitat, log, landmarks=None):
    animal_dir = profile_dir
    blender_dir = os.path.join(animal_dir, "blender")
    inspect_mouth(armature, log)
    bpy.context.scene.frame_set(0)
    landmarks = landmarks or measure_landmarks(habitat, log)
    update_profile_landmarks(profile_path, profile, landmarks, log)
    texture_config = texture_bake_config(profile)
    if texture_config is not None:
        log.add("texture bake: model.textureBake present in the profile; running "
                "the deterministic procedural texture stage before evidence renders")
        bake_procedural_textures(scene_meshes(), texture_config, log)
    verts = all_world_vertices()
    render_views(blender_dir, verts, log)
    paths = render_motion_frames(blender_dir, log)
    verify_motion_pixels(paths, log)
    out_glb = os.path.join(animal_dir, "output", "model", "model.glb")
    stats = export_glb(out_glb, log)
    workspace = os.path.join(blender_dir, "workspace.blend")
    bpy.ops.wm.save_mainfile(filepath=workspace)
    log.add(f"workspace saved: {workspace}")
    log.add("RESULT: automated pass (Blender stage)")
    return stats


def run_quaternius(profile_path, profile, profile_dir, source_path, log):
    animal_id = profile["id"]
    source_clip = profile["model"]["sourceClip"]
    habitat = profile["presentation"]["habitat"]
    body_length = body_length_m(animal_id)
    log.add(f"pipeline: rigged .blend source, keeping only '{source_clip}' retimed to 8 s")

    bpy.ops.wm.open_mainfile(filepath=source_path)
    setup_scene_defaults()
    armature, meshes = prune_objects(expected_mesh_count=1, log=log)
    log.add(f"source objects kept: armature '{armature.name}' "
            f"({len(armature.data.bones)} bones), mesh(es) "
            f"{[(m.name, len(m.data.vertices)) for m in meshes]}")
    log.add(f"source actions: {[a.name for a in bpy.data.actions]}")

    action = bpy.data.actions.get(source_clip)
    if action is None:
        raise HardFail(f"declared sourceClip '{source_clip}' not found in source")
    # The Quaternius Idle is authored as a short source loop (60 frames for
    # Parasaurolophus). Repeating that loop preserves its intended cadence;
    # stretching one copy across eight seconds reads as slow motion.
    source_cycles = 3 if animal_id == "parasaurolophus" else 1
    idle = retime_action_linear(action, "Idle", 1.0, log, cycles=source_cycles)
    assign_action(armature, idle)
    delete_other_actions("Idle", log)
    for ob in meshes:
        if ob.animation_data:
            ob.animation_data_clear()

    objects = [armature] + meshes
    refine_quaternius_materials(meshes[0], animal_id, log)
    rotate_to_production_forward(objects, log, animal_id)
    scale_to_body_length(objects, body_length, log)
    ground_or_centre(objects, habitat, log)
    return armature, habitat


def connected_component_sizes(mesh):
    """Exact connected-component vertex counts for static-source inspection."""
    bm = bmesh.new()
    bm.from_mesh(mesh.data)
    bm.verts.ensure_lookup_table()
    remaining = {vertex.index for vertex in bm.verts}
    sizes = []
    while remaining:
        seed = remaining.pop()
        stack = [bm.verts[seed]]
        size = 0
        while stack:
            vertex = stack.pop()
            size += 1
            for edge in vertex.link_edges:
                other = edge.other_vert(vertex).index
                if other in remaining:
                    remaining.remove(other)
                    stack.append(bm.verts[other])
        sizes.append(size)
    bm.free()
    return sorted(sizes, reverse=True)


def decimate_if_needed(mesh, target_tris, log):
    before = triangle_count()
    if before <= target_tris:
        log.add(f"decimation check: {before} triangles <= {target_tris} target; "
                "source topology retained without a destructive modifier")
        return before
    ratio = target_tris / before
    modifier = mesh.modifiers.new("Decimate", "DECIMATE")
    modifier.ratio = ratio
    select_only([mesh])
    bpy.ops.object.modifier_apply(modifier=modifier.name)
    after = triangle_count()
    log.add(f"decimate: ratio {ratio:.6f} ({before} -> {after} tris, "
            f"{len(mesh.data.vertices)} verts); <= {target_tris} target")
    if after > target_tris:
        raise HardFail(f"decimation target missed: {after} > {target_tris}")
    return after


def author_single_material(mesh, name, color, roughness, log):
    material = bpy.data.materials.new(name)
    material.diffuse_color = (*color, 1.0)
    material.use_nodes = True
    bsdf = material.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (*color, 1.0)
    bsdf.inputs["Roughness"].default_value = roughness
    mesh.data.materials.clear()
    mesh.data.materials.append(material)
    select_only([mesh])
    bpy.ops.object.shade_smooth()
    log.add(f"material authored because the scan/STL carries none: '{name}' "
            f"RGB={color}, roughness={roughness}; smooth shading; material and "
            "surface quality remain human-reviewable")


def create_armature_bones(specs, log):
    """specs: (name, head, tail, parent_name, connected)."""
    data = bpy.data.armatures.new("Armature")
    armature = bpy.data.objects.new("Armature", data)
    bpy.context.scene.collection.objects.link(armature)
    select_only([armature])
    bpy.ops.object.mode_set(mode="EDIT")
    made = {}
    for name, head, tail, parent_name, connected in specs:
        bone = data.edit_bones.new(name)
        bone.head = head
        bone.tail = tail
        if parent_name is not None:
            bone.parent = made[parent_name]
            bone.use_connect = connected
        made[name] = bone
    bpy.ops.object.mode_set(mode="OBJECT")
    log.add(f"armature synthesized: {len(specs)} bones {[item[0] for item in specs]}")
    return armature


def loop_phase(frame, cycles=1, phase=0.0):
    """Seam-safe periodic phase for an eight-second Idle."""
    base = 0.0 if frame == IDLE_END_FRAME else 2.0 * math.pi * frame / IDLE_END_FRAME
    return cycles * base + phase


def sampled_composite_quaternion_fcurve(action, data_path, components):
    """Key a quaternion composed from periodic axis/angle components.

    Each component is ``(axis, amplitude_degrees, cycles, phase)``. Combining
    a slow look with a quicker nod produces an organic Idle without moving the
    grounded body or guessing at mouth anatomy.
    """
    frames = IDLE_END_FRAME + 1
    samples = []
    for frame in range(frames):
        sample = Quaternion()
        for axis, amplitude_deg, cycles, phase in components:
            angle = math.radians(amplitude_deg) * math.sin(
                loop_phase(frame, cycles, phase))
            sample = sample @ Quaternion(axis, angle)
        samples.append(sample)
    for channel in range(4):
        curve = action.fcurves.new(data_path, index=channel)
        curve.keyframe_points.add(frames)
        co = np.empty(frames * 2)
        co[0::2] = np.arange(frames)
        co[1::2] = [sample[channel] for sample in samples]
        curve.keyframe_points.foreach_set("co", co)
        for point in curve.keyframe_points:
            point.interpolation = "LINEAR"
        curve.update()


def sampled_quaternion_fcurve(
        action, data_path, axis, amplitude_deg, phase=0.0, cycles=1):
    sampled_composite_quaternion_fcurve(
        action, data_path, [(axis, amplitude_deg, cycles, phase)])


def run_dunkleosteus(profile_path, profile, profile_dir, source_path, log):
    animal_id = profile["id"]
    habitat = profile["presentation"]["habitat"]
    body_length = body_length_m(animal_id)
    log.add(f"pipeline: unrigged static STL ({animal_id}) -> topology-budget "
            "check/decimate, author materials, synthesize 5-bone articulated "
            "spine chain + 8 s swim Idle")

    bpy.ops.wm.stl_import(filepath=source_path)
    setup_scene_defaults()
    meshes = scene_meshes()
    if len(meshes) != 1:
        raise HardFail(f"expected 1 STL mesh, found {len(meshes)}")
    mesh = meshes[0]
    before_tris = triangle_count()
    log.add(f"imported STL '{mesh.name}': {len(mesh.data.vertices)} verts, "
            f"{before_tris} tris, no materials, no rig")

    # head/tail: cross-section slabs show the broad pectoral-fin/head region at
    # low Y and the thin vertical caudal fin at high Y -> head toward -Y
    rotate_to_production_forward([mesh], log, animal_id, apply=True)

    target_tris = 90_000
    after_tris = decimate_if_needed(mesh, target_tris, log)
    select_only([mesh])
    bpy.ops.object.shade_smooth()
    log.add("shading: smooth (source STL was flat-shaded)")

    # Source STL files carry no colour.  The deterministic refinement helper
    # authors bounded PBR regions without inventing UV maps or external images.
    author_aquatic_scan_materials(mesh, animal_id, log)

    scale_to_body_length([mesh], body_length, log, apply=True)
    # centre horizontally and vertically (water animal, no ground plane)
    verts = all_world_vertices()
    centre = (verts.min(axis=0) + verts.max(axis=0)) / 2.0
    mesh.location = Vector((-centre[0], -centre[1], -centre[2]))
    apply_transform([mesh], location=True, rotation=False, scale=False)
    log.add(f"centring (water): shifted by {[round(-c, 5) for c in centre]} m so "
            f"the bounding-box centre sits at the origin (x/y centred, centred "
            f"vertically in the water column)")

    # 5-bone spine chain, head end -> tail tip, at the origin (world axes)
    span = body_length
    ys = [0.15 * span, -0.05 * span, -0.25 * span, -0.42 * span, -0.475 * span, -0.5 * span]
    arm_data = bpy.data.armatures.new("Armature")
    armature = bpy.data.objects.new("Armature", arm_data)
    bpy.context.scene.collection.objects.link(armature)
    select_only([armature])
    bpy.ops.object.mode_set(mode="EDIT")
    parent = None
    for i in range(5):
        bone = arm_data.edit_bones.new(f"Spine{i + 1}")
        bone.head = (0.0, ys[i], 0.0)
        bone.tail = (0.0, ys[i + 1], 0.0)
        if parent is not None:
            bone.parent = parent
            bone.use_connect = True
        parent = bone
    bpy.ops.object.mode_set(mode="OBJECT")
    log.add(f"armature synthesized: 5-bone spine chain Spine1..Spine5 along -Y "
            f"(head end y={ys[0]:.2f} m to tail tip y={ys[-1]:.2f} m), roll 0")

    select_only([mesh, armature])
    bpy.context.view_layer.objects.active = armature
    bpy.ops.object.parent_set(type="ARMATURE_AUTO")
    weighted = sum(1 for v in mesh.data.vertices if len(v.groups) > 0)
    log.add(f"skinning: automatic weights from armature; {weighted}/"
            f"{len(mesh.data.vertices)} vertices weighted, groups "
            f"{[g.name for g in mesh.vertex_groups]}")
    if weighted < len(mesh.data.vertices) * 0.99:
        raise HardFail("automatic weights left >1% of vertices unweighted")

    # world Z in bone-local space (bones point -Y, roll 0): lateral swim wave =
    # rotation about world Z, expressed per-bone as a local quaternion
    rest_rot = arm_data.bones["Spine1"].matrix_local.to_3x3()
    local_z = rest_rot.inverted() @ Vector((0.0, 0.0, 1.0))
    log.add(f"swim wave axis: world Z expressed in Spine1 local space = "
            f"{[round(v, 4) for v in local_z]} (lateral side-to-side bend)")

    idle = bpy.data.actions.new("Idle")
    amplitudes_deg = ([2.0, 4.5, 8.0, 12.0, 16.0]
                      if animal_id == "jaekelopterus"
                      else [1.5, 3.5, 6.0, 9.0, 12.0])
    phases = [-0.68 * i for i in range(5)]  # travelling wave toward the tail
    frames = IDLE_END_FRAME + 1
    bob_amplitude = 0.035 if animal_id == "jaekelopterus" else 0.05
    swim_cycles = 3

    def loop_value(f, phase, cycles=1):
        return math.sin(loop_phase(f, cycles, phase))

    for bone_i in range(5):
        amp = math.radians(amplitudes_deg[bone_i])
        for axis in range(4):
            fc = idle.fcurves.new(
                f'pose.bones["Spine{bone_i + 1}"].rotation_quaternion', index=axis)
            fc.keyframe_points.add(frames)
            co = np.empty(frames * 2)
            for f in range(frames):
                q = Quaternion(
                    local_z, amp * loop_value(f, phases[bone_i], swim_cycles))
                co[2 * f] = f
                co[2 * f + 1] = q[axis]
            fc.keyframe_points.foreach_set("co", co)
            for kp in fc.keyframe_points:
                kp.interpolation = "LINEAR"
            fc.update()
    fc = idle.fcurves.new("location", index=2)  # armature object vertical bob
    fc.keyframe_points.add(frames)
    co = np.empty(frames * 2)
    for f in range(frames):
        co[2 * f] = f
        co[2 * f + 1] = bob_amplitude * loop_value(f, 0.25, 2)
    fc.keyframe_points.foreach_set("co", co)
    for kp in fc.keyframe_points:
        kp.interpolation = "LINEAR"
    fc.update()
    armature.rotation_mode = "QUATERNION"
    sampled_composite_quaternion_fcurve(
        idle,
        "rotation_quaternion",
        [
            ((1.0, 0.0, 0.0), 1.8, 1, 0.45),
            ((0.0, 1.0, 0.0), 1.0, 2, 1.10),
        ],
    )
    assign_action(armature, idle)
    log.add(f"Idle synthesized: frames 0..{IDLE_END_FRAME} at {FPS} fps = 8.0 s, "
            f"one LINEAR key per frame; {swim_cycles} travelling-wave cycles with "
            f"lateral amplitudes {amplitudes_deg} deg (Spine1->Spine5, phase "
            f"-0.68 rad/bone), two-cycle vertical bob +/-{bob_amplitude} m plus "
            "gentle whole-body pitch/roll, no forward root travel; "
            f"frame {IDLE_END_FRAME} repeats frame 0 exactly (seamless loop)")
    return armature, habitat


def run_smilodon(profile_path, profile, profile_dir, source_path, log):
    animal_id = profile["id"]
    habitat = profile["presentation"]["habitat"]
    log.add("pipeline: unrigged Smilodon STL -> exact pedestal/component check, "
            "decimate to the web target, grounded two-bone deformation rig, "
            "8 s breathing + head-sway Idle")
    bpy.ops.wm.stl_import(filepath=source_path)
    setup_scene_defaults()
    meshes = scene_meshes()
    if len(meshes) != 1:
        raise HardFail(f"expected 1 STL mesh, found {len(meshes)}")
    mesh = meshes[0]
    components = connected_component_sizes(mesh)
    log.add(f"source inspection: {len(mesh.data.vertices)} vertices, "
            f"{triangle_count()} triangles, {len(components)} connected component(s), "
            f"component vertex counts {components[:20]}")
    if len(components) != 1:
        raise HardFail("Smilodon pedestal check is ambiguous: expected one connected body")
    log.add("pedestal check: PASS — exactly one connected sculpt component; no "
            "separate plinth/base component exists to remove")

    rotate_to_production_forward([mesh], log, animal_id, apply=True)
    decimate_if_needed(mesh, 90_000, log)
    author_smilodon_materials(mesh, log)
    scale_to_body_length([mesh], body_length_m(animal_id), log, apply=True)
    coords = all_world_vertices()
    centre = (coords.min(axis=0) + coords.max(axis=0)) / 2.0
    mesh.location.x -= float(centre[0])
    mesh.location.y -= float(centre[1])
    apply_transform([mesh], location=True, rotation=False, scale=False)
    ground_or_centre([mesh], habitat, log, apply=True)

    coords = all_world_vertices()
    lo, hi = coords.min(axis=0), coords.max(axis=0)
    span_y = float(hi[1] - lo[1])
    head_blend_start = float(hi[1] - 0.31 * span_y)
    head_full_start = float(hi[1] - 0.20 * span_y)
    body_height = float(hi[2] - lo[2])
    specs = [
        ("Body", (0.0, 0.0, 0.0), (0.0, 0.0, max(0.2, body_height * 0.72)), None, False),
        ("Head", (0.0, head_blend_start, body_height * 0.58),
         (0.0, float(hi[1]), body_height * 0.64), "Body", False),
    ]
    armature = create_armature_bones(specs, log)
    modifier = mesh.modifiers.new("Armature", "ARMATURE")
    modifier.object = armature
    mesh.parent = armature
    body_group = mesh.vertex_groups.new(name="Body")
    head_group = mesh.vertex_groups.new(name="Head")
    buckets = {index: [] for index in range(21)}
    for vertex in mesh.data.vertices:
        blend = ((vertex.co.y - head_blend_start) /
                 max(head_full_start - head_blend_start, 1e-6))
        bucket = int(round(max(0.0, min(1.0, blend)) * 20.0))
        buckets[bucket].append(vertex.index)
    head_vertices = 0
    for bucket, indices in buckets.items():
        if not indices:
            continue
        head_weight = bucket / 20.0
        if head_weight < 1.0:
            body_group.add(indices, 1.0 - head_weight, "REPLACE")
        if head_weight > 0.0:
            head_group.add(indices, head_weight, "REPLACE")
            head_vertices += len(indices)
    log.add(f"skinning: deterministic 20-step blend by local +Y; head blend "
            f"{head_blend_start:.4f}..{head_full_start:.4f} m, "
            f"{head_vertices}/{len(mesh.data.vertices)} vertices receive Head weight; "
            "remaining vertices stay on grounded Body bone")

    action = bpy.data.actions.new("Idle")
    frames = IDLE_END_FRAME + 1
    for channel, amplitude in ((0, 0.018), (1, 0.004), (2, 0.012)):
        curve = action.fcurves.new('pose.bones["Body"].scale', index=channel)
        curve.keyframe_points.add(frames)
        co = np.empty(frames * 2)
        co[0::2] = np.arange(frames)
        for frame in range(frames):
            co[2 * frame + 1] = 1.0 + amplitude * math.sin(
                loop_phase(frame, 2, 0.42))
        curve.keyframe_points.foreach_set("co", co)
        for point in curve.keyframe_points:
            point.interpolation = "LINEAR"
        curve.update()
    rest = armature.data.bones["Head"].matrix_local.to_3x3()
    local_z = rest.inverted() @ Vector((0.0, 0.0, 1.0))
    rest_x = armature.data.bones["Head"].matrix_local.to_3x3()
    local_x = rest_x.inverted() @ Vector((1.0, 0.0, 0.0))
    sampled_composite_quaternion_fcurve(
        action,
        'pose.bones["Head"].rotation_quaternion',
        [
            (local_z, 5.5, 1, 0.85),
            (local_x, 2.0, 2, 1.35),
        ],
    )
    assign_action(armature, action)
    log.add(f"Idle synthesized: frames 0..{IDLE_END_FRAME} at {FPS} fps = 8.0 s, "
            "LINEAR per-frame keys; grounded Body breathes for two cycles at "
            "+/-1.8% width, "
            "+/-1.2% height and +/-0.4% length about a z=0 bone origin while "
            "Head combines a slow +/-5.5 deg look with a two-cycle +/-2.0 deg "
            "nod; frame 192 repeats frame 0 exactly")
    return armature, habitat


def run_ammonite(profile_path, profile, profile_dir, source_path, log):
    habitat = profile["presentation"]["habitat"]
    log.add("pipeline: one-piece fossil-shell PLY scan (not a living-animal "
            "reconstruction) -> topology check, stone material, single-bone "
            "floating display Idle")
    bpy.ops.wm.ply_import(filepath=source_path)
    setup_scene_defaults()
    meshes = scene_meshes()
    if len(meshes) != 1:
        raise HardFail(f"expected 1 PLY mesh, found {len(meshes)}")
    mesh = meshes[0]
    components = connected_component_sizes(mesh)
    log.add(f"source inspection: {len(mesh.data.vertices)} vertices, "
            f"{triangle_count()} triangles, {len(components)} connected component(s), "
            f"component vertex counts {components[:20]}")
    decimate_if_needed(mesh, 90_000, log)
    author_ammonite_materials(mesh, log)
    coords = all_world_vertices()
    span = float((coords.max(axis=0) - coords.min(axis=0)).max())
    factor = 0.40 / span
    mesh.scale = (factor, factor, factor)
    apply_transform([mesh], location=False, rotation=False, scale=True)
    coords = all_world_vertices()
    centre = (coords.min(axis=0) + coords.max(axis=0)) / 2.0
    mesh.location = Vector((-float(centre[0]), -float(centre[1]), -float(centre[2])))
    apply_transform([mesh], location=True, rotation=False, scale=False)
    log.add(f"scale/display normalization: largest scan span {span:.6f} source "
            f"units -> 0.40 m; uniform factor {factor:.6f}; bounding box centred "
            "in the water/display column")

    armature = create_armature_bones(
        [("Shell", (0.0, -0.10, 0.0), (0.0, 0.10, 0.0), None, False)], log)
    modifier = mesh.modifiers.new("Armature", "ARMATURE")
    modifier.object = armature
    mesh.parent = armature
    group = mesh.vertex_groups.new(name="Shell")
    group.add(list(range(len(mesh.data.vertices))), 1.0, "REPLACE")
    action = bpy.data.actions.new("Idle")
    frames = IDLE_END_FRAME + 1
    samples = []
    for frame in range(frames):
        qz = Quaternion(
            (0.0, 0.0, 1.0),
            math.radians(7.0) * math.sin(loop_phase(frame, 1, 0.55)),
        )
        qx = Quaternion(
            (1.0, 0.0, 0.0),
            math.radians(3.0) * math.sin(loop_phase(frame, 2, 1.10)),
        )
        samples.append(qz @ qx)
    for channel in range(4):
        curve = action.fcurves.new("rotation_quaternion", index=channel)
        curve.keyframe_points.add(frames)
        co = np.empty(frames * 2)
        co[0::2] = np.arange(frames)
        co[1::2] = [sample[channel] for sample in samples]
        curve.keyframe_points.foreach_set("co", co)
        for point in curve.keyframe_points:
            point.interpolation = "LINEAR"
        curve.update()
    for channel, amplitude, cycles, phase in (
            (0, 0.012, 1, 1.15),
            (1, 0.006, 2, 2.20),
            (2, 0.022, 2, 0.30)):
        curve = action.fcurves.new("location", index=channel)
        curve.keyframe_points.add(frames)
        co = np.empty(frames * 2)
        co[0::2] = np.arange(frames)
        for frame in range(frames):
            co[2 * frame + 1] = amplitude * math.sin(
                loop_phase(frame, cycles, phase))
        curve.keyframe_points.foreach_set("co", co)
        for point in curve.keyframe_points:
            point.interpolation = "LINEAR"
        curve.update()
    armature.rotation_mode = "QUATERNION"
    assign_action(armature, action)
    log.add(f"Idle synthesized: frames 0..{IDLE_END_FRAME} at {FPS} fps = 8.0 s, "
            "LINEAR per-frame keys; fossil-shell exhibit follows a bounded "
            "three-axis drift (+/-0.012/+/-0.006/+/-0.022 m) and layered "
            "one-/two-cycle rocking (+/-7.0/+/-3.0 deg); this is display motion, "
            "not invented living anatomy; frame 192 repeats frame 0 exactly")

    bpy.context.scene.frame_set(0)
    posed = all_world_vertices()
    left = posed[int(np.argmin(posed[:, 0]))]
    right = posed[int(np.argmax(posed[:, 0]))]
    landmarks = {
        "head": blender_to_gltf(left),
        "tailTip": blender_to_gltf(right),
        "contacts": [],
    }
    log.add("presentation landmark exception (fossil shell): this scan has no "
            "preserved soft-body head or tail. The required measured pair uses "
            "the shell's left/right display extents for initial-view projection; "
            "it must not be interpreted as anatomical head/tail evidence")
    log.add(f"measured shell display extents (glTF): left={landmarks['head']} "
            f"right={landmarks['tailTip']}")
    return armature, habitat, landmarks


# Static-sculpt track (run_static_sculpt): detailed unrigged sculpts that ship
# both display meshes and (optionally) a high-poly source for normal baking.
# headSign is measured from the source (teeth/skull end), not guessed.
SCULPT_CONFIGS = {
    "spinosaurus": {
        # Julian Johnson-Mortimer CC-BY-4.0 FBX: game-res 'low' + sculpt 'high'
        # + separate teeth/claws; teeth centroid measured at world -Y (after
        # the FBX import rotation), so the source is rotated 180 deg about Z.
        "keep": {
            "low": ("Body", (0.36, 0.49, 0.42), 0.82),
            "teethtop1": ("Teeth", (0.82, 0.78, 0.66), 0.55),
            "teethbot1": ("Teeth", (0.82, 0.78, 0.66), 0.55),
            "claws": ("Claws", (0.42, 0.38, 0.33), 0.60),
        },
        "normalFrom": "high",
        "normalResolution": 2048,
        "headSign": -1,
        "headBones": ("teethtop1", "teethbot1"),
        "decimateTris": None,  # 20k-vert low mesh is already within budget
    },
    "corythosaurus": {
        # Hunyuan3D-2.1 shape inference (fixed seed) from the CC-BY-4.0
        # TotalDino life restoration. The cleanup pass already merges doubles,
        # drops floater islands and rotates the body onto Blender +Y with the
        # crested skull at +Y, so no further orientation change is needed.
        "keep": None,
        "headSign": 1,
        "headBones": (),
        "decimateTris": 90_000,
        # Linear-space medians sampled from the CC-BY-4.0 reference artwork at
        # the matching anatomical regions, so the exhibit colour is traceable
        # to the same source as the geometry.
        "palette": {
            "flank": ((0.426, 0.263, 0.037), 0.86),
            "belly": ((0.494, 0.369, 0.164), 0.88),
            "dorsal": ((0.173, 0.048, 0.019), 0.84),
            "crest": ((0.399, 0.334, 0.128), 0.72),
            "snout": ((0.223, 0.096, 0.010), 0.80),
            "limb": ((0.666, 0.548, 0.374), 0.90),
            "stripes": True,
        },
    },
    "velociraptor": {
        # Noximous CC-BY-4.0 STL (Raptor_Standing pose); broad skull end
        # measured at -Y, so the source is rotated 180 deg about Z.
        "keep": None,
        "headSign": -1,
        "headBones": (),
        "decimateTris": 90_000,
    },
}


def run_static_sculpt(profile_path, profile, profile_dir, source_path, log):
    """Detailed unrigged sculpt (STL/FBX) -> optional high-to-low normal bake,
    authored materials, grounded three-bone (Body/Head/Tail) deformation rig,
    8 s breathing + sway Idle. Used for the realistic model-upgrade track."""
    animal_id = profile["id"]
    cfg = SCULPT_CONFIGS[animal_id]
    habitat = profile["presentation"]["habitat"]
    body_length = body_length_m(animal_id)
    log.add(f"pipeline: static sculpt ({animal_id}) -> keep configured meshes, "
            "author materials, optional normal bake, synthesize Body/Head/Tail "
            "rig + 8 s Idle")

    lower = source_path.lower()
    if lower.endswith(".fbx"):
        bpy.ops.import_scene.fbx(filepath=source_path)
    elif lower.endswith(".stl"):
        bpy.ops.wm.stl_import(filepath=source_path)
    elif lower.endswith(".ply"):
        bpy.ops.wm.ply_import(filepath=source_path)
    else:
        raise HardFail(f"unsupported sculpt source type: {source_path}")
    setup_scene_defaults()

    keep = cfg["keep"]
    normal_from = cfg.get("normalFrom")
    for ob in list(bpy.context.scene.objects):
        if ob.type == "MESH" and (keep is None or ob.name in keep):
            continue
        if ob.type == "MESH" and normal_from is not None and ob.name == normal_from:
            continue  # deleted after the normal bake
        log.add(f"removed non-animal source object '{ob.name}' ({ob.type})")
        bpy.data.objects.remove(ob, do_unlink=True)
    meshes = scene_meshes()
    if keep is None and len(meshes) != 1:
        raise HardFail(f"expected 1 sculpt mesh, found {len(meshes)}")
    missing = [name for name in (keep or {}) if bpy.data.objects.get(name) is None]
    if missing:
        raise HardFail(f"configured meshes missing from source: {missing}")
    log.add(f"source objects kept: {[(m.name, len(m.data.vertices)) for m in meshes]}")

    if cfg["headSign"] < 0:
        rotate_to_production_forward(meshes, log, animal_id, apply=True)
    else:
        log.add(f"{animal_id}: measured head end (teeth/skull) already toward "
                "Blender +Y (glTF -Z); no orientation change")

    # FBX imports carry object-level scale/rotation (typically 0.01 / -90 deg
    # X); scale_to_body_length SETS the object scale, so bake the import
    # transform into the mesh data first or the body-length factor multiplies
    # the stale local units.
    apply_transform(list(scene_meshes()), location=True, rotation=True, scale=True)
    log.add("source object transforms applied into mesh data (import "
            "scale/rotation normalized; data now matches world space)")

    if keep is not None:
        author_sculpt_materials(keep, log)
    else:
        author_sculpt_materials(
            {meshes[0].name: ("Body", (0.38, 0.30, 0.22), 0.85)}, log)

    if normal_from is not None:
        high = bpy.data.objects.get(normal_from)
        if high is None:
            raise HardFail(f"normal-bake source mesh '{normal_from}' not found")
        low_name = next(name for name, spec in (keep or {}).items()
                        if spec[0] == "Body")
        low = bpy.data.objects[low_name]
        bake_normal_from_highpoly(low, high, cfg["normalResolution"], log)
        bpy.data.objects.remove(high, do_unlink=True)
        meshes = scene_meshes()
        log.add(f"normal-bake source '{normal_from}' removed after baking")

    if cfg["decimateTris"] is not None:
        decimate_if_needed(meshes[0], cfg["decimateTris"], log)

    # A generated sculpt has no material regions. Apply the palette after
    # decimation so the per-polygon region assignment matches the exported
    # topology instead of being blurred by the collapse.
    palette = cfg.get("palette")
    if palette is not None:
        author_sculpt_palette_materials(meshes[0], palette, log)

    scale_to_body_length(meshes, body_length, log, apply=True)
    coords = all_world_vertices()
    centre = (coords.min(axis=0) + coords.max(axis=0)) / 2.0
    for mesh in meshes:
        mesh.location.x -= float(centre[0])
        mesh.location.y -= float(centre[1])
    apply_transform(meshes, location=True, rotation=False, scale=False)
    ground_or_centre(meshes, habitat, log, apply=True)

    coords = all_world_vertices()
    lo, hi = coords.min(axis=0), coords.max(axis=0)
    span_y = float(hi[1] - lo[1])
    head_blend_start = float(hi[1] - 0.31 * span_y)
    head_full_start = float(hi[1] - 0.20 * span_y)
    tail_blend_start = float(lo[1] + 0.30 * span_y)
    tail_full_start = float(lo[1] + 0.18 * span_y)
    body_height = float(hi[2] - lo[2])
    specs = [
        ("Body", (0.0, 0.0, 0.0), (0.0, 0.0, max(0.2, body_height * 0.72)), None, False),
        ("Head", (0.0, head_blend_start, body_height * 0.55),
         (0.0, float(hi[1]), body_height * 0.60), "Body", False),
        ("Tail", (0.0, tail_blend_start, body_height * 0.45),
         (0.0, float(lo[1]), body_height * 0.40), "Body", False),
    ]
    armature = create_armature_bones(specs, log)

    head_mesh_names = set(cfg["headBones"])
    for mesh in meshes:
        modifier = mesh.modifiers.new("Armature", "ARMATURE")
        modifier.object = armature
        mesh.parent = armature
        body_group = mesh.vertex_groups.new(name="Body")
        head_group = mesh.vertex_groups.new(name="Head")
        tail_group = mesh.vertex_groups.new(name="Tail")
        if mesh.name in head_mesh_names:
            head_group.add(list(range(len(mesh.data.vertices))), 1.0, "REPLACE")
            log.add(f"skinning: '{mesh.name}' fully weighted to Head "
                    f"({len(mesh.data.vertices)} verts; teeth follow the head sway)")
            continue
        buckets = {}
        for vertex in mesh.data.vertices:
            y = vertex.co.y
            if y >= head_blend_start:
                blend = (y - head_blend_start) / max(head_full_start - head_blend_start, 1e-6)
                bone = 1  # Head
            elif y <= tail_blend_start:
                blend = (tail_blend_start - y) / max(tail_blend_start - tail_full_start, 1e-6)
                bone = 2  # Tail
            else:
                blend, bone = 0.0, 0
            bucket = (bone, int(round(max(0.0, min(1.0, blend)) * 20.0)))
            buckets.setdefault(bucket, []).append(vertex.index)
        for (bone, bucket), indices in buckets.items():
            weight = bucket / 20.0
            if bone == 1:
                head_group.add(indices, weight, "REPLACE")
                if weight < 1.0:
                    body_group.add(indices, 1.0 - weight, "REPLACE")
            elif bone == 2:
                tail_group.add(indices, weight, "REPLACE")
                if weight < 1.0:
                    body_group.add(indices, 1.0 - weight, "REPLACE")
            else:
                body_group.add(indices, 1.0, "REPLACE")
        log.add(f"skinning: '{mesh.name}' deterministic 20-step blends by local +Y; "
                f"head zone y>={head_blend_start:.4f} m, tail zone "
                f"y<={tail_blend_start:.4f} m, torso stays on grounded Body bone")

    action = bpy.data.actions.new("Idle")
    frames = IDLE_END_FRAME + 1
    for channel, amplitude in ((0, 0.018), (1, 0.004), (2, 0.012)):
        curve = action.fcurves.new('pose.bones["Body"].scale', index=channel)
        curve.keyframe_points.add(frames)
        co = np.empty(frames * 2)
        co[0::2] = np.arange(frames)
        for frame in range(frames):
            co[2 * frame + 1] = 1.0 + amplitude * math.sin(
                loop_phase(frame, 2, 0.42))
        curve.keyframe_points.foreach_set("co", co)
        for point in curve.keyframe_points:
            point.interpolation = "LINEAR"
        curve.update()
    for bone_name, components in (
            ("Head", (("z", 5.5, 1, 0.85), ("x", 2.0, 2, 1.35))),
            ("Tail", (("z", 7.0, 3, 2.20), ("x", 1.5, 1, 0.35)))):
        rest = armature.data.bones[bone_name].matrix_local.to_3x3()
        local_z = rest.inverted() @ Vector((0.0, 0.0, 1.0))
        local_x = rest.inverted() @ Vector((1.0, 0.0, 0.0))
        axes = {"z": local_z, "x": local_x}
        sampled_composite_quaternion_fcurve(
            action,
            f'pose.bones["{bone_name}"].rotation_quaternion',
            [(axes[axis], amplitude, cycles, phase)
             for axis, amplitude, cycles, phase in components],
        )
    assign_action(armature, action)
    log.add(f"Idle synthesized: frames 0..{IDLE_END_FRAME} at {FPS} fps = 8.0 s, "
            "LINEAR per-frame keys; Body breathes for two cycles at +/-1.8% width, "
            "+/-1.2% height, +/-0.4% length about a z=0 bone origin; Head combines "
            "a slow +/-5.5 deg look and two-cycle +/-2.0 deg nod; Tail combines a "
            "three-cycle +/-7.0 deg sway with a slow +/-1.5 deg lift; frame 192 "
            "repeats frame 0 "
            "exactly (seamless loop)")
    return armature, habitat


def join_source_meshes(log):
    meshes = scene_meshes()
    if not meshes:
        raise HardFail("project-authored source has no mesh objects")
    select_only(meshes)
    bpy.context.view_layer.objects.active = meshes[0]
    bpy.ops.object.convert(target="MESH")
    bpy.ops.object.join()
    mesh = bpy.context.object
    mesh.name = "Animal"
    log.add(f"project-authored source joined: {len(meshes)} semantic primitive(s) -> "
            f"one mesh with {len(mesh.data.vertices)} vertices and {triangle_count()} triangles")
    return mesh


def run_expansion_source(profile_path, profile, profile_dir, source_path, log, entry):
    """Normalize the deterministic project-authored expansion GLB.

    Sources are assembled from semantic primitives by the retained Blender
    generator.  The normalization stage joins those pieces, creates a bounded
    Body/Head/Tail rig and authors an archetype-specific visible Idle.
    """
    animal_id = profile["id"]
    habitat = profile["presentation"]["habitat"]
    log.add(f"pipeline: project-authored expansion GLB ({entry['archetype']}, "
            f"feature={entry['feature']}) -> joined web mesh, Body/Head/Tail "
            "deformation rig, archetype-specific 8 s Idle")
    bpy.ops.import_scene.gltf(filepath=source_path)
    setup_scene_defaults()
    mesh = join_source_meshes(log)
    decimate_if_needed(mesh, 90_000, log)

    # Generator authors forward along Blender +Y/glTF -Z already.
    scale_to_body_length([mesh], float(entry.get("length", 1.0)), log, apply=True)
    coords = all_world_vertices()
    centre = (coords.min(axis=0) + coords.max(axis=0)) / 2.0
    mesh.location.x -= float(centre[0])
    mesh.location.y -= float(centre[1])
    apply_transform([mesh], location=True, rotation=False, scale=False)
    ground_or_centre([mesh], habitat, log, apply=True)

    coords = all_world_vertices()
    lo, hi = coords.min(axis=0), coords.max(axis=0)
    span_y = float(hi[1] - lo[1])
    body_height = float(hi[2] - lo[2])
    head_blend_start = float(hi[1] - 0.30 * span_y)
    head_full_start = float(hi[1] - 0.16 * span_y)
    tail_blend_start = float(lo[1] + 0.28 * span_y)
    tail_full_start = float(lo[1] + 0.12 * span_y)
    specs = [
        ("Body", (0.0, 0.0, float(lo[2])),
         (0.0, 0.0, float(lo[2] + max(0.15, body_height * 0.68))), None, False),
        ("Head", (0.0, head_blend_start, float(lo[2] + body_height * 0.52)),
         (0.0, float(hi[1]), float(lo[2] + body_height * 0.58)), "Body", False),
        ("Tail", (0.0, tail_blend_start, float(lo[2] + body_height * 0.42)),
         (0.0, float(lo[1]), float(lo[2] + body_height * 0.38)), "Body", False),
    ]
    armature = create_armature_bones(specs, log)
    modifier = mesh.modifiers.new("Armature", "ARMATURE")
    modifier.object = armature
    mesh.parent = armature
    groups = {name: mesh.vertex_groups.new(name=name) for name in ("Body", "Head", "Tail")}
    buckets = {}
    for vertex in mesh.data.vertices:
        y = vertex.co.y
        if y >= head_blend_start:
            blend = (y - head_blend_start) / max(head_full_start - head_blend_start, 1e-6)
            region = "Head"
        elif y <= tail_blend_start:
            blend = (tail_blend_start - y) / max(tail_blend_start - tail_full_start, 1e-6)
            region = "Tail"
        else:
            blend, region = 0.0, "Body"
        bucket = (region, int(round(max(0.0, min(1.0, blend)) * 20.0)))
        buckets.setdefault(bucket, []).append(vertex.index)
    for (region, bucket), indices in buckets.items():
        weight = bucket / 20.0
        if region == "Body":
            groups["Body"].add(indices, 1.0, "REPLACE")
        else:
            groups[region].add(indices, weight, "REPLACE")
            if weight < 1.0:
                groups["Body"].add(indices, 1.0 - weight, "REPLACE")
    log.add(f"skinning: deterministic 20-step head/tail blends; head zone "
            f"y>={head_blend_start:.4f}, tail zone y<={tail_blend_start:.4f}; "
            "central grounded/swimming body stays on Body")

    action = bpy.data.actions.new("Idle")
    frames = IDLE_END_FRAME + 1
    if habitat == "water":
        body_scale = ((0, 0.010), (1, 0.004), (2, 0.008))
        head_amp, head_cycles, tail_amp, tail_cycles = 5.5, 1, 11.0, 3
        bob = min(0.08, max(0.012, float(entry.get("length", 1.0)) * 0.006))
    elif habitat == "air":
        body_scale = ((0, 0.014), (1, 0.005), (2, 0.010))
        head_amp, head_cycles, tail_amp, tail_cycles = 5.0, 1, 7.5, 2
        bob = min(0.09, max(0.015, float(entry.get("length", 1.0)) * 0.008))
    else:
        body_scale = ((0, 0.018), (1, 0.004), (2, 0.012))
        head_amp, head_cycles, tail_amp, tail_cycles = 5.5, 1, 8.0, 3
        bob = 0.0
    for channel, amplitude in body_scale:
        curve = action.fcurves.new('pose.bones["Body"].scale', index=channel)
        curve.keyframe_points.add(frames)
        co = np.empty(frames * 2)
        co[0::2] = np.arange(frames)
        for frame in range(frames):
            co[2 * frame + 1] = 1.0 + amplitude * math.sin(loop_phase(frame, 2, 0.42))
        curve.keyframe_points.foreach_set("co", co)
        for point in curve.keyframe_points:
            point.interpolation = "LINEAR"
        curve.update()
    for bone_name, amplitude, cycles, phase in (
            ("Head", head_amp, head_cycles, 0.75),
            ("Tail", tail_amp, tail_cycles, 2.05)):
        rest = armature.data.bones[bone_name].matrix_local.to_3x3()
        local_z = rest.inverted() @ Vector((0.0, 0.0, 1.0))
        local_x = rest.inverted() @ Vector((1.0, 0.0, 0.0))
        sampled_composite_quaternion_fcurve(
            action,
            f'pose.bones["{bone_name}"].rotation_quaternion',
            [(local_z, amplitude, cycles, phase),
             (local_x, amplitude * 0.28, 1, phase + 0.55)],
        )
    if bob:
        curve = action.fcurves.new("location", index=2)
        curve.keyframe_points.add(frames)
        co = np.empty(frames * 2)
        co[0::2] = np.arange(frames)
        for frame in range(frames):
            co[2 * frame + 1] = bob * math.sin(loop_phase(frame, 2, 0.22))
        curve.keyframe_points.foreach_set("co", co)
        for point in curve.keyframe_points:
            point.interpolation = "LINEAR"
        curve.update()
        # A secondary lateral drift makes swimming/flying motion visible from
        # the fixed Blender evidence camera even for a very long, thin animal
        # whose vertical silhouette can otherwise hide a centred bob.
        curve = action.fcurves.new("location", index=0)
        curve.keyframe_points.add(frames)
        co = np.empty(frames * 2)
        co[0::2] = np.arange(frames)
        for frame in range(frames):
            co[2 * frame + 1] = bob * 0.9 * math.sin(loop_phase(frame, 1, 0.45))
        curve.keyframe_points.foreach_set("co", co)
        for point in curve.keyframe_points:
            point.interpolation = "LINEAR"
        curve.update()
    if entry.get("archetype") == "snake":
        armature.rotation_mode = "QUATERNION"
        sampled_composite_quaternion_fcurve(
            action,
            "rotation_quaternion",
            [((0.0, 0.0, 1.0), 4.5, 1, 0.30),
             ((1.0, 0.0, 0.0), 5.0, 1, 0.20)],
        )
        log.add("snake-specific whole-body swim: one-cycle +/-4.5 deg yaw and "
                "one-cycle +/-5.0 deg roll, in addition to head/tail motion")
    assign_action(armature, action)
    log.add(f"Idle synthesized: frames 0..{IDLE_END_FRAME} at {FPS} fps = 8.0 s, "
            f"two-cycle body breathing, Head +/-{head_amp} deg, Tail +/-{tail_amp} "
            f"deg; habitat={habitat}, vertical drift +/-{bob:.4f} m; frame 192 "
            "repeats frame 0 exactly (seamless loop)")
    return armature, habitat


def main():
    profile_path = parse_args()
    profile_dir = os.path.dirname(profile_path)
    with open(profile_path, encoding="utf-8") as handle:
        profile = json.load(handle)
    animal_id = profile["id"]
    log = Log(os.path.join(profile_dir, "blender", "normalization.log"))
    try:
        log.add(f"normalization run: {animal_id} (run {profile['run']})")
        log.add(CONVENTION_NOTE)
        log.add(f"blender {bpy.app.version_string}, headless --factory-startup")
        source_path = verify_source(profile_dir, profile, log)
        # start from an empty scene (--factory-startup leaves a default
        # Cube/Camera/Light that must not leak into renders or the export)
        bpy.ops.wm.read_homefile(use_empty=True)
        landmarks = None
        entry = expansion_entry(animal_id)
        if entry is not None and source_path.lower().endswith(".glb"):
            armature, habitat = run_expansion_source(
                profile_path, profile, profile_dir, source_path, log, entry)
        elif source_path.lower().endswith(".blend"):
            armature, habitat = run_quaternius(profile_path, profile, profile_dir, source_path, log)
        elif animal_id in SCULPT_CONFIGS and source_path.lower().endswith((".stl", ".fbx", ".ply")):
            armature, habitat = run_static_sculpt(profile_path, profile, profile_dir, source_path, log)
        elif animal_id == "smilodon" and source_path.lower().endswith(".stl"):
            armature, habitat = run_smilodon(profile_path, profile, profile_dir, source_path, log)
        elif animal_id == "ammonite" and source_path.lower().endswith(".ply"):
            armature, habitat, landmarks = run_ammonite(
                profile_path, profile, profile_dir, source_path, log)
        elif source_path.lower().endswith(".stl"):
            armature, habitat = run_dunkleosteus(profile_path, profile, profile_dir, source_path, log)
        else:
            raise HardFail(f"unsupported source type: {source_path}")
        finish(profile_path, profile, profile_dir, armature, habitat, log, landmarks)
    except Exception as exc:  # hard fail: log and exit non-zero
        log.add(f"HARD FAIL: {type(exc).__name__}: {exc}")
        log.flush()
        sys.exit(1)
    log.flush()


main()
