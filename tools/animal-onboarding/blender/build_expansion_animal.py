"""Build one project-authored stylised prehistoric animal source GLB.

The catalogue in ``tools/animal-onboarding/expansion-100.json`` supplies the
identity, scale, habitat, body archetype and visible feature. Geometry is made
only from Blender primitives and deterministic curves, so the retained Python
file plus catalogue are the complete reproducible source.
"""

import argparse
import hashlib
import json
import math
import os
import sys

import bpy
from mathutils import Vector


PALETTES = [
    ((0.19, 0.36, 0.22), (0.55, 0.37, 0.16), (0.80, 0.67, 0.34)),
    ((0.21, 0.30, 0.39), (0.52, 0.23, 0.12), (0.74, 0.57, 0.28)),
    ((0.37, 0.25, 0.14), (0.16, 0.34, 0.32), (0.73, 0.58, 0.36)),
    ((0.24, 0.36, 0.17), (0.49, 0.20, 0.14), (0.86, 0.72, 0.41)),
    ((0.18, 0.30, 0.36), (0.40, 0.16, 0.30), (0.70, 0.55, 0.27)),
    ((0.42, 0.25, 0.11), (0.16, 0.28, 0.17), (0.77, 0.63, 0.36)),
]


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--catalog", required=True)
    parser.add_argument("--id", required=True)
    parser.add_argument("--out", required=True)
    return parser.parse_args(sys.argv[sys.argv.index("--") + 1 :])


def material(name, color, roughness=0.8, metallic=0.0):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = (*color, 1.0)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1.0)
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic
    return mat


def smooth(obj):
    if obj.type == "MESH":
        for polygon in obj.data.polygons:
            polygon.use_smooth = True
    return obj


def ellipsoid(name, loc, scale, mat, segments=16, rings=10):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segments, ring_count=rings, location=loc)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    obj.data.materials.append(mat)
    return smooth(obj)


def cone_between(name, start, end, r1, r2, mat, vertices=12):
    start, end = Vector(start), Vector(end)
    direction = end - start
    bpy.ops.mesh.primitive_cone_add(
        vertices=vertices,
        radius1=r1,
        radius2=r2,
        depth=direction.length,
        location=(start + end) * 0.5,
    )
    obj = bpy.context.object
    obj.name = name
    obj.rotation_mode = "QUATERNION"
    obj.rotation_quaternion = Vector((0, 0, 1)).rotation_difference(direction.normalized())
    obj.data.materials.append(mat)
    return smooth(obj)


def box(name, loc, scale, mat, rotation=(0, 0, 0)):
    bpy.ops.mesh.primitive_cube_add(location=loc, rotation=rotation)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    obj.data.materials.append(mat)
    return obj


def add_eye(loc, eye, pupil):
    ellipsoid("Eye", loc, (0.065, 0.04, 0.065), eye, 12, 8)
    side = -1 if loc[0] < 0 else 1
    ellipsoid("Pupil", (loc[0] + side * 0.052, loc[1], loc[2]),
              (0.018, 0.028, 0.035), pupil, 10, 6)


def wing_membrane(name, side, span, mat):
    """A tapered, lightly cambered triangular-prism wing, not a flat box."""
    shoulder = (side * 0.28, 0.32, 1.78)
    # A visible gliding dihedral keeps the wing readable in the required
    # lateral initial presentation instead of collapsing to a thin edge.
    wrist = (side * span, -0.45, 2.42)
    rear = (side * 0.48, -1.18, 1.16)
    thickness = 0.035
    verts = [
        shoulder, wrist, rear,
        (shoulder[0], shoulder[1], shoulder[2] - thickness),
        (wrist[0], wrist[1], wrist[2] - thickness),
        (rear[0], rear[1], rear[2] - thickness),
    ]
    faces = [(0, 1, 2), (5, 4, 3), (0, 3, 4, 1), (1, 4, 5, 2), (2, 5, 3, 0)]
    mesh = bpy.data.meshes.new(name + "Mesh")
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.scene.collection.objects.link(obj)
    obj.data.materials.append(mat)
    return obj


def bilateral_limb(prefix, x, y, z, upper, lower, radius, mat, swept=0.0):
    for side in (-1, 1):
        stride = (0.20 if side > 0 else -0.20) * upper
        hip = (side * x, y, z)
        knee = (side * (x + upper * 0.22), y + swept + stride, z - upper * 0.58)
        foot = (side * (x + upper * 0.06), y + swept + stride + lower * 0.24, 0.05)
        cone_between(f"{prefix}Upper", hip, knee, radius, radius * 0.72, mat)
        cone_between(f"{prefix}Lower", knee, foot, radius * 0.72, radius * 0.43, mat)
        cone_between(f"{prefix}Foot", foot, (foot[0], foot[1] + lower * 0.45, 0.045), radius * 0.42, radius * 0.16, mat)


def horns(feature, head_y, head_z, scale, accent, ivory):
    if feature in {"bull-horns", "brow-horns", "small-brow-crests"}:
        width = 0.42 * scale
        for side in (-1, 1):
            cone_between("BrowHorn", (side * width, head_y, head_z + 0.12 * scale),
                         (side * width * 1.20, head_y + 0.24 * scale, head_z + 0.55 * scale),
                         0.12 * scale, 0.01, ivory)
    if feature == "nose-horn":
        cone_between("NoseHorn", (0, head_y + 0.50 * scale, head_z + 0.15 * scale),
                     (0, head_y + 0.68 * scale, head_z + 0.60 * scale), 0.13 * scale, 0.01, ivory)
    if feature in {"single-crest", "back-ridge", "back-sail"}:
        count = 1 if feature == "single-crest" else 10
        for i in range(count):
            y = head_y - i * 0.35 * scale
            height = (0.55 if feature == "single-crest" else (0.45 + 0.45 * math.sin((i + 1) / 11 * math.pi))) * scale
            cone_between("DorsalCrest", (0, y, head_z + 0.30 * scale),
                         (0, y, head_z + height), 0.15 * scale, 0.02, accent, 10)


def build_theropod(a, mats):
    body, accent, belly, ivory, eye, pupil = mats
    s = 1.0
    ellipsoid("Body", (0, -0.10, 1.45), (0.66, 1.62, 0.68), body)
    ellipsoid("Chest", (0, 1.00, 1.58), (0.58, 0.76, 0.65), body)
    cone_between("Neck", (0, 1.00, 1.65), (0, 1.78, 2.02), 0.38, 0.27, body)
    head_scale = 0.75 if a["feature"] in {"deep-skull", "powerful-jaws"} else 0.58
    ellipsoid("Head", (0, 2.18, 2.08), (0.44, head_scale, 0.40), body)
    ellipsoid("Muzzle", (0, 2.66, 1.98), (0.34, 0.48 if "snout" in a["feature"] else 0.30, 0.23), body)
    add_eye((-0.34, 2.35, 2.24), eye, pupil)
    add_eye((0.34, 2.35, 2.24), eye, pupil)
    cone_between("TailA", (0, -1.25, 1.45), (0, -3.05, 1.18), 0.56, 0.27, body)
    cone_between("TailB", (0, -3.05, 1.18), (0, -5.0, 0.92), 0.28, 0.035, accent)
    bilateral_limb("Leg", 0.43, 0.12, 1.18, 1.18, 0.92, 0.19, body, -0.12)
    for side in (-1, 1):
        cone_between("Arm", (side * 0.52, 1.30, 1.77), (side * 0.62, 1.88, 1.30), 0.12, 0.055, body)
        if a["feature"] in {"giant-claws", "long-snout-claw"}:
            for j in range(3):
                cone_between("HandClaw", (side * (0.58 + j * 0.035), 1.88, 1.30),
                             (side * (0.61 + j * 0.04), 2.35, 1.18 - j * 0.03), 0.035, 0.004, ivory, 8)
    if a["feature"] == "sickle-claw":
        for side in (-1, 1):
            cone_between("SickleClaw", (side * 0.53, 0.52, 0.08), (side * 0.56, 0.83, 0.36), 0.075, 0.006, ivory, 10)
    horns(a["feature"], 2.25, 2.22, s, accent, ivory)


def build_sauropod(a, mats):
    body, accent, belly, ivory, eye, pupil = mats
    ellipsoid("Body", (0, 0, 1.55), (1.05, 2.2, 1.05), body)
    neck_height = 4.8 if a["feature"] == "high-shoulders" else 3.5
    cone_between("NeckA", (0, 1.45, 1.80), (0, 2.55, 2.65), 0.62, 0.43, body)
    cone_between("NeckB", (0, 2.55, 2.65), (0, 3.30, neck_height), 0.43, 0.25, accent)
    ellipsoid("Head", (0, 3.45, neck_height + 0.05), (0.34, 0.48, 0.30), body)
    add_eye((-0.22, 3.62, neck_height + 0.15), eye, pupil)
    add_eye((0.22, 3.62, neck_height + 0.15), eye, pupil)
    cone_between("TailA", (0, -1.65, 1.55), (0, -4.0, 1.15), 0.68, 0.28, body)
    cone_between("TailB", (0, -4.0, 1.15), (0, -7.2 if a["feature"] == "whip-tail" else -6.0, 0.82), 0.29, 0.025, accent)
    for y in (-1.05, 1.05):
        bilateral_limb("Leg", 0.70, y, 1.20, 1.25, 0.85, 0.28, body)


def build_quadruped(a, mats):
    body, accent, belly, ivory, eye, pupil = mats
    ellipsoid("Body", (0, 0, 1.1), (0.82, 1.65, 0.72), body)
    ellipsoid("Shoulders", (0, 1.05, 1.18), (0.83, 0.75, 0.82), accent)
    cone_between("Neck", (0, 1.05, 1.32), (0, 1.78, 1.55), 0.44, 0.34, body)
    ellipsoid("Head", (0, 2.08, 1.55), (0.52, 0.67, 0.48), body)
    ellipsoid("Muzzle", (0, 2.58, 1.43), (0.42, 0.42, 0.28), belly)
    add_eye((-0.34, 2.25, 1.70), eye, pupil)
    add_eye((0.34, 2.25, 1.70), eye, pupil)
    for y in (-1.02, 1.02):
        bilateral_limb("Leg", 0.55, y, 0.88, 0.82, 0.58, 0.20, body)
    cone_between("Tail", (0, -1.40, 1.10), (0, -3.0, 0.88), 0.35, 0.045, accent)
    feature = a["feature"]
    if feature in {"tail-club", "spiked-tail-club"}:
        ellipsoid("TailClub", (0, -3.10, 0.88), (0.48, 0.68, 0.35), accent)
    if a["archetype"] in {"armored", "armored-mammal"}:
        for row in range(4):
            for side in (-1, 1):
                for i in range(4):
                    ellipsoid("Osteoderm", (side * (0.35 + row * 0.12), -0.9 + i * 0.6, 1.72 - row * 0.12),
                              (0.14, 0.20, 0.09), accent, 10, 6)
    if feature in {"frill-spikes", "long-frill-horns", "small-frill", "nasal-boss"}:
        ellipsoid("Frill", (0, 1.72, 1.72), (0.78, 0.20, 0.85), accent)
        if feature != "nasal-boss":
            for side in (-1, 1):
                cone_between("FaceHorn", (side * 0.28, 2.28, 1.75), (side * 0.32, 3.15, 2.05), 0.11, 0.008, ivory)
        if feature in {"frill-spikes", "long-frill-horns"}:
            for angle in (-1.1, -0.55, 0, 0.55, 1.1):
                cone_between("FrillSpike", (0.65 * math.sin(angle), 1.70, 2.15 + 0.42 * math.cos(angle)),
                             (1.05 * math.sin(angle), 1.48, 2.55 + 0.65 * math.cos(angle)), 0.09, 0.006, ivory)
    if feature in {"rhino-horns", "nasal-boss"}:
        cone_between("NoseHorn", (0, 2.46, 1.68), (0, 3.0, 2.28), 0.19, 0.01, ivory)
    if feature in {"giant-antlers"}:
        for side in (-1, 1):
            cone_between("Antler", (side * 0.28, 2.0, 1.92), (side * 1.15, 2.15, 3.0), 0.11, 0.035, ivory)
            for i in range(3):
                cone_between("AntlerTine", (side * (0.65 + i * 0.16), 2.1, 2.42 + i * 0.15),
                             (side * (1.15 + i * 0.28), 2.12, 2.75 + i * 0.28), 0.07, 0.008, ivory)
    if feature in {"saber-canines", "powerful-jaws"}:
        for side in (-1, 1):
            cone_between("Canine", (side * 0.22, 2.70, 1.46), (side * 0.22, 2.78, 0.98), 0.07, 0.008, ivory)
    if feature in {"giant-claws"}:
        for side in (-1, 1):
            for i in range(3):
                cone_between("Claw", (side * (0.50 + i * 0.06), 1.85, 0.08),
                             (side * (0.50 + i * 0.08), 2.30, 0.06), 0.045, 0.004, ivory)


def build_pterosaur(a, mats):
    body, accent, belly, ivory, eye, pupil = mats
    ellipsoid("Body", (0, 0, 1.7), (0.40, 0.88, 0.42), body)
    cone_between("Neck", (0, 0.55, 1.75), (0, 1.35, 2.05), 0.27, 0.18, body)
    ellipsoid("Head", (0, 1.68, 2.05), (0.32, 0.58, 0.32), body)
    cone_between("Beak", (0, 1.95, 2.0), (0, 3.0, 1.92), 0.25, 0.025, belly)
    add_eye((-0.20, 1.72, 2.15), eye, pupil)
    add_eye((0.20, 1.72, 2.15), eye, pupil)
    span = 4.2 if a.get("wingspan", 3) > 5 else 2.8
    for side in (-1, 1):
        wing_membrane("WingMembrane", side, span, accent)
        cone_between("WingFinger", (side * 0.30, 0.05, 1.78), (side * span, -0.55, 1.70), 0.08, 0.025, body)
    cone_between("Tail", (0, -0.60, 1.70), (0, -2.0, 1.55), 0.18, 0.025, body)
    if a["feature"] in {"tall-crest", "antler-crest", "jaw-crests"}:
        cone_between("HeadCrest", (0, 1.45, 2.18), (0, 0.95, 3.12), 0.22, 0.02, accent)


def build_marine(a, mats):
    body, accent, belly, ivory, eye, pupil = mats
    ellipsoid("Body", (0, 0, 0), (0.80, 2.15, 0.70), body)
    longneck = a["archetype"] == "marine-longneck"
    head_y = 4.2 if longneck else 2.6
    if longneck:
        cone_between("Neck", (0, 1.35, 0.12), (0, 3.85, 0.20), 0.38, 0.18, body)
    ellipsoid("Head", (0, head_y, 0.18), (0.42 if longneck else 0.62, 0.58 if longneck else 0.85, 0.38 if longneck else 0.55), accent)
    add_eye((-0.28 if not longneck else -0.20, head_y + 0.2, 0.35), eye, pupil)
    add_eye((0.28 if not longneck else 0.20, head_y + 0.2, 0.35), eye, pupil)
    cone_between("Tail", (0, -1.45, 0), (0, -4.3, -0.1), 0.50, 0.035, body)
    for side in (-1, 1):
        for y in (-0.85, 0.85):
            cone_between("Flipper", (side * 0.58, y, -0.05), (side * 1.75, y - 0.25, -0.35), 0.28, 0.035, accent)
    if a["feature"] == "giant-eyes":
        add_eye((-0.38, head_y + 0.32, 0.38), eye, pupil)
        add_eye((0.38, head_y + 0.32, 0.38), eye, pupil)


def build_arthropod(a, mats):
    body, accent, belly, ivory, eye, pupil = mats
    if a["archetype"] == "snake":
        points = [(0, -3.5 + i * 0.55, 0.45 + 0.22 * math.sin(i * 0.72)) for i in range(14)]
        for i in range(len(points) - 1):
            cone_between("BodySegment", points[i], points[i + 1], 0.38, 0.36, body)
        ellipsoid("Head", (0, 4.0, 0.55), (0.52, 0.78, 0.42), accent)
        add_eye((-0.32, 4.38, 0.70), eye, pupil)
        add_eye((0.32, 4.38, 0.70), eye, pupil)
        return
    segments = 9 if a["id"] != "hallucigenia" else 12
    for i in range(segments):
        y = -1.6 + i * 0.38
        ellipsoid("Segment", (0, y, 0.55), (0.55 - i * 0.018, 0.29, 0.32), body, 12, 8)
        for side in (-1, 1):
            if a["id"] == "hallucigenia":
                cone_between("Spine", (side * 0.26, y, 0.72), (side * 0.58, y, 1.35), 0.055, 0.004, ivory, 8)
            else:
                cone_between("Flap", (side * 0.38, y, 0.56), (side * 0.95, y - 0.08, 0.30), 0.12, 0.015, accent, 8)
    ellipsoid("Head", (0, 1.95, 0.58), (0.62, 0.45, 0.38), accent)
    eye_count = 5 if a["id"] == "opabinia" else 2
    for i in range(eye_count):
        x = (i - (eye_count - 1) / 2) * 0.18
        add_eye((x, 2.20, 0.82 + 0.06 * (i % 2)), eye, pupil)
    if a["id"] == "opabinia":
        cone_between("Proboscis", (0, 2.15, 0.55), (0, 3.35, 0.32), 0.10, 0.045, accent, 10)
    else:
        for side in (-1, 1):
            cone_between("Grasper", (side * 0.30, 2.05, 0.55), (side * 0.45, 3.0, 0.40), 0.13, 0.025, accent, 10)


def fuse_organic_body(mats):
    """Fuse overlapping construction primitives into one smooth skin.

    Eyes, pupils, ivory display structures and wing membranes remain crisp
    separate objects. Everything else becomes a voxel-remeshed surface with
    deterministic belly and dorsal accent regions, removing toy-like seams.
    """
    keep_tokens = (
        "Eye", "Pupil", "Horn", "Claw", "Canine", "Antler", "Spine",
        "WingMembrane", "FrillSpike", "SickleClaw",
    )
    parts = [obj for obj in bpy.context.scene.objects
             if obj.type == "MESH" and not any(token in obj.name for token in keep_tokens)]
    if not parts:
        return
    for obj in bpy.context.scene.objects:
        obj.select_set(False)
    for obj in parts:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = parts[0]
    bpy.ops.object.convert(target="MESH")
    bpy.ops.object.join()
    skin = bpy.context.object
    skin.name = "OrganicBody"
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
    skin.data.remesh_voxel_size = 0.105
    skin.data.remesh_voxel_adaptivity = 0.15
    bpy.ops.object.voxel_remesh()
    skin.data.materials.clear()
    for mat in mats[:3]:
        skin.data.materials.append(mat)
    coords = [vertex.co for vertex in skin.data.vertices]
    lo_z = min(vertex.z for vertex in coords)
    hi_z = max(vertex.z for vertex in coords)
    lo_y = min(vertex.y for vertex in coords)
    hi_y = max(vertex.y for vertex in coords)
    dz = max(hi_z - lo_z, 1e-6)
    dy = max(hi_y - lo_y, 1e-6)
    for polygon in skin.data.polygons:
        z = (polygon.center.z - lo_z) / dz
        y = (polygon.center.y - lo_y) / dy
        if z < 0.30:
            polygon.material_index = 2
        elif z > 0.62 and int(y * 13.0) % 5 == 1:
            polygon.material_index = 1
        else:
            polygon.material_index = 0
        polygon.use_smooth = True


def build(a):
    digest = hashlib.sha256(a["id"].encode()).digest()
    palette = PALETTES[digest[0] % len(PALETTES)]
    mats = (
        material("Body", palette[0]),
        material("Accent", palette[1]),
        material("Belly", palette[2], 0.88),
        material("Ivory", (0.78, 0.72, 0.55), 0.62),
        material("Eye", (0.92, 0.65, 0.14), 0.38),
        material("Pupil", (0.015, 0.012, 0.008), 0.28),
    )
    archetype = a["archetype"]
    if archetype in {"theropod", "prosauropod", "feathered"}:
        build_theropod(a, mats)
    elif archetype == "sauropod":
        build_sauropod(a, mats)
    elif archetype == "pterosaur":
        build_pterosaur(a, mats)
    elif archetype.startswith("marine-"):
        build_marine(a, mats)
    elif archetype in {"arthropod", "snake"}:
        build_arthropod(a, mats)
    else:
        build_quadruped(a, mats)
    fuse_organic_body(mats)


def main():
    args = parse_args()
    with open(args.catalog, encoding="utf-8") as handle:
        catalog = json.load(handle)
    animal = next((item for item in catalog["animals"] if item["id"] == args.id), None)
    if animal is None:
        raise SystemExit(f"unknown expansion animal: {args.id}")
    bpy.ops.wm.read_factory_settings(use_empty=True)
    build(animal)
    os.makedirs(os.path.dirname(os.path.abspath(args.out)), exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=os.path.abspath(args.out),
        export_format="GLB",
        export_apply=True,
        export_animations=False,
        export_yup=True,
    )
    print(f"BUILT {animal['id']} -> {args.out}")


main()
