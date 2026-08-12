"""Shared helpers for the animal-onboarding Blender normalization stage.

Used by normalize_animal.py. Everything here runs inside Blender 4.5
(--background --factory-startup). All coordinates are Blender world space
(+Z up) unless a name says gltf_; the glTF export maps Blender (x, y, z) to
glTF (x, z, -y), so Blender +Y forward becomes glTF -Z forward, matching the
measured production convention (maiasaura / plesiosaurus / megalodon golden
samples: head toward glTF -Z, feet at y=0, 24 fps, 8 s Idle = frames 0-192).
"""

import bpy
import hashlib
import math
import os

import numpy as np
from mathutils import Quaternion, Vector

FPS = 24
IDLE_SECONDS = 8.0
IDLE_END_FRAME = int(FPS * IDLE_SECONDS)  # 192; clip spans frames 0..192
MOTION_RENDER_FRAMES = (0, IDLE_END_FRAME // 2, IDLE_END_FRAME)  # t = 0s, 4s, 8s

TRIANGLE_TARGET = 100_000
GLB_BYTES_TARGET = 12 * 1024 * 1024
GLB_BYTES_CEILING = 20 * 1024 * 1024


class Log:
    """Collects normalization.log lines; always flushed, even on hard fail."""

    def __init__(self, path):
        self.path = path
        self.lines = []

    def add(self, message=""):
        line = str(message)
        self.lines.append(line)
        print("NORMALIZE_LOG: " + line, flush=True)

    def flush(self):
        os.makedirs(os.path.dirname(self.path), exist_ok=True)
        with open(self.path, "w", encoding="utf-8") as handle:
            handle.write("\n".join(self.lines) + "\n")


class HardFail(Exception):
    pass


def sha256_file(path):
    digest = hashlib.sha256()
    with open(path, "rb") as handle:
        for chunk in iter(lambda: handle.read(1 << 20), b""):
            digest.update(chunk)
    return digest.hexdigest()


def verify_source(profile_dir, profile, log):
    rel = profile["archive"]["sourceDownload"]["path"]
    expected = profile["archive"]["sourceDownload"]["sha256"]
    path = os.path.join(profile_dir, rel)
    actual = sha256_file(path)
    log.add(f"source sha256: expected {expected}")
    log.add(f"source sha256: actual   {actual} ({path})")
    if actual != expected:
        raise HardFail("source download sha256 mismatch; refusing to normalize")
    log.add("source sha256: MATCH")
    return path


def scene_meshes():
    return [ob for ob in bpy.context.scene.objects if ob.type == "MESH"]


def evaluated_world_vertices(obj):
    """World-space vertex positions of a mesh, pose evaluated at current frame."""
    dg = bpy.context.evaluated_depsgraph_get()
    ev = obj.evaluated_get(dg)
    mesh = ev.to_mesh()
    count = len(mesh.vertices)
    coords = np.empty(count * 3, dtype=np.float64)
    mesh.vertices.foreach_get("co", coords)
    ev.to_mesh_clear()
    coords = coords.reshape(count, 3)
    matrix = np.array(obj.matrix_world, dtype=np.float64)
    return coords @ matrix[:3, :3].T + matrix[:3, 3]


def all_world_vertices():
    return np.concatenate([evaluated_world_vertices(ob) for ob in scene_meshes()])


def triangle_count():
    total = 0
    for ob in scene_meshes():
        total += sum(len(p.vertices) - 2 for p in ob.data.polygons)
    return total


def blender_to_gltf(point):
    x, y, z = point
    return [round(float(x), 5), round(float(z), 5), round(float(-y), 5)]


def measure_landmarks(habitat, log):
    """head = extreme vertex toward Blender +Y (glTF -Z, production forward),
    tailTip = extreme toward -Y. Land contacts: lowest vertex band clustered
    into feet (left/right by x sign, split by y when a cluster spans a large
    fraction of the body). Water: contacts stay empty (centred in the column).
    Returns landmarks in glTF coordinates (meters, +Y up)."""
    verts = all_world_vertices()
    y = verts[:, 1]
    head = verts[int(np.argmax(y))]
    tail = verts[int(np.argmin(y))]
    log.add(f"landmark method: world vertices of the frame-0 evaluated (posed) "
            f"meshes; head = max +Y vertex, tailTip = max -Y vertex "
            f"(Blender +Y forward == glTF -Z, the production convention)")
    log.add(f"landmark head (blender world): {[round(v, 5) for v in head]}")
    log.add(f"landmark tailTip (blender world): {[round(v, 5) for v in tail]}")

    contacts = []
    if habitat == "land":
        z = verts[:, 2]
        span_z = float(z.max() - z.min())
        band_top = float(z.min()) + max(0.015 * span_z, 0.004)
        low = verts[z <= band_top]
        log.add(f"contacts method: vertices with z <= min_z + 1.5% of height "
                f"({band_top:.5f} m), {len(low)} candidates, clustered by x sign; "
                f"clusters spanning > 25% of body length are split at their y median; "
                f"contact = (cluster centroid x/y, cluster min z)")
        clusters = []
        for sign in (1.0, -1.0):
            side = low[low[:, 0] * sign >= 0.0]
            if len(side) == 0:
                continue
            y_span = float(side[:, 1].max() - side[:, 1].min())
            body_len = float(y.max() - y.min())
            if y_span > 0.25 * body_len:
                median = float(np.median(side[:, 1]))
                clusters.append(side[side[:, 1] >= median])
                clusters.append(side[side[:, 1] < median])
            else:
                clusters.append(side)
        for cluster in clusters:
            if len(cluster) == 0:
                continue
            zmin = cluster[:, 2].min()
            foot = cluster[cluster[:, 2] <= zmin + 1e-4]
            contacts.append([float(foot[:, 0].mean()), float(foot[:, 1].mean()), float(zmin)])
        for c in contacts:
            log.add(f"contact (blender world): {[round(v, 5) for v in c]} over {len(low)} low verts")
        if len(contacts) < 2:
            raise HardFail(f"expected at least 2 ground contacts, measured {len(contacts)}")
    else:
        log.add(f"contacts: habitat '{habitat}' is not land -> empty contact list "
                f"(animal centred in the water column instead)")

    return {
        "head": blender_to_gltf(head),
        "tailTip": blender_to_gltf(tail),
        "contacts": [blender_to_gltf(c) for c in contacts],
    }


def retime_action_linear(src_action, new_name, location_scale, log):
    """Resample src_action (frames 0..src_end, BEZIER source) into a new action
    spanning frames 0..192 with one LINEAR key per frame. Frame 192 samples
    source frame 0 exactly so the loop closes seamlessly. Pose-bone location
    channels are multiplied by location_scale (the armature data is scaled by
    the same factor afterwards, keeping root motion in meters)."""
    src_start, src_end = src_action.frame_range
    groups = {}
    for fc in src_action.fcurves:
        groups.setdefault(fc.data_path, {})[fc.array_index] = fc

    new_action = bpy.data.actions.new(new_name)
    frames = IDLE_END_FRAME + 1
    for data_path, channels in sorted(groups.items()):
        indices = sorted(channels)
        samples = {i: [] for i in indices}
        for f in range(frames):
            t = float(src_start) if f == IDLE_END_FRAME else f * (src_end - src_start) / IDLE_END_FRAME + src_start
            for i in indices:
                samples[i].append(channels[i].evaluate(t))
        if data_path.endswith("rotation_quaternion") and len(indices) == 4:
            # keep every sample in the same hemisphere so LINEAR interpolation
            # never takes the long way around
            for f in range(1, frames):
                dot = sum(samples[i][f] * samples[i][f - 1] for i in indices)
                if dot < 0.0:
                    for i in indices:
                        samples[i][f] = -samples[i][f]
        is_location = data_path.endswith(".location")
        for i in indices:
            fc = new_action.fcurves.new(data_path, index=i)
            fc.keyframe_points.add(frames)
            co = np.empty(frames * 2, dtype=np.float64)
            co[0::2] = np.arange(frames, dtype=np.float64)
            factor = location_scale if is_location else 1.0
            co[1::2] = np.asarray(samples[i], dtype=np.float64) * factor
            fc.keyframe_points.foreach_set("co", co)
            for kp in fc.keyframe_points:
                kp.interpolation = "LINEAR"
            fc.update()
    log.add(f"action '{src_action.name}' ({src_start:.0f}..{src_end:.0f} f, BEZIER) "
            f"resampled to '{new_name}': frames 0..{IDLE_END_FRAME} at {FPS} fps = "
            f"{IDLE_SECONDS:.1f} s, one LINEAR key per frame, {len(new_action.fcurves)} fcurves; "
            f"frame {IDLE_END_FRAME} resamples frame {src_start:.0f} exactly (seamless loop); "
            f"pose location channels scaled by {location_scale:.6f} (1.0 = armature-space "
            f"units kept, metres come from the object node scale)")
    return new_action


def assign_action(obj, action):
    if obj.animation_data is None:
        obj.animation_data_create()
    obj.animation_data.action = action
    # Blender 4.4+ slotted actions: bind the (single) slot explicitly
    try:
        if len(action.slots) and obj.animation_data.action_slot is None:
            obj.animation_data.action_slot = action.slots[0]
    except AttributeError:
        pass


def delete_other_actions(keep_name, log):
    for action in list(bpy.data.actions):
        if action.name != keep_name:
            log.add(f"removed source clip '{action.name}' "
                    f"(frames {action.frame_range[0]:.0f}..{action.frame_range[1]:.0f})")
            bpy.data.actions.remove(action)


def inspect_mouth(armature, log):
    findings = []
    needles = ("jaw", "tongue", "mouth", "teeth", "tooth")
    if armature is not None:
        bones = [b.name for b in armature.data.bones]
        hits = [b for b in bones if any(n in b.lower() for n in needles)]
        findings.append(f"armature bones: {len(bones)}; jaw/tongue/teeth name matches: {hits or 'NONE'}")
    else:
        findings.append("no source armature (unrigged source)")
    for ob in scene_meshes():
        groups = [g.name for g in ob.vertex_groups]
        hits = [g for g in groups if any(n in g.lower() for n in needles)]
        findings.append(f"mesh '{ob.name}': {len(groups)} vertex groups; "
                        f"jaw/tongue/teeth matches: {hits or 'NONE'}; "
                        f"{len(ob.data.materials)} material slot(s)")
    findings.append("mouth interior/teeth geometry: not modelled as separate weighted "
                    "components in this source (single closed low-poly surface)")
    for line in findings:
        log.add("mouth inspection: " + line)
    log.add("mouth motion stays DISABLED (profile declares mode=disabled); "
            "inspection recorded as evidence only")


def setup_scene_defaults():
    scene = bpy.context.scene
    scene.render.fps = FPS
    scene.frame_start = 0
    scene.frame_end = IDLE_END_FRAME
    scene.render.engine = "BLENDER_WORKBENCH"
    scene.render.resolution_x = 512
    scene.render.resolution_y = 512
    scene.render.film_transparent = False
    scene.display.shading.light = "STUDIO"
    scene.display.shading.color_type = "TEXTURE"
    world = bpy.data.worlds.get("World") or bpy.data.worlds.new("World")
    scene.world = world
    world.color = (0.7, 0.7, 0.7)


def _point_camera(cam, target):
    cam.rotation_euler = (target - cam.location).to_track_quat("-Z", "Y").to_euler()


def render_views(blender_dir, verts, log):
    """Neutral front/side/top renders plus a fixed side camera returned for the
    motion renders. Cameras are orthographic and frame the measured bounds."""
    os.makedirs(blender_dir, exist_ok=True)
    lo = verts.min(axis=0)
    hi = verts.max(axis=0)
    center = Vector(((lo + hi) / 2.0).tolist())
    dims = hi - lo
    distance = float(max(dims)) * 3.0 + 1.0

    cam_data = bpy.data.cameras.new("NormalizeCamera")
    cam_data.type = "ORTHO"
    cam = bpy.data.objects.new("NormalizeCamera", cam_data)
    bpy.context.scene.collection.objects.link(cam)
    bpy.context.scene.camera = cam

    views = {
        "front": (Vector((center.x, center.y + distance, center.z)), max(dims[0], dims[2])),
        "side": (Vector((center.x + distance, center.y, center.z)), max(dims[1], dims[2])),
        "top": (Vector((center.x, center.y, center.z + distance)), max(dims[0], dims[1])),
    }
    motion_cam_state = None
    for name, (position, extent) in views.items():
        cam.location = position
        _point_camera(cam, center)
        cam_data.ortho_scale = float(extent) * 1.12
        path = os.path.join(blender_dir, f"render-neutral-{name}.png")
        bpy.context.scene.render.filepath = path
        bpy.ops.render.render(write_still=True)
        log.add(f"render neutral {name}: {path} (ortho scale {cam_data.ortho_scale:.3f})")
        if name == "side":
            motion_cam_state = (position.copy(), float(extent) * 1.12)

    # restore the fixed side camera for the motion renders
    cam.location, cam_data.ortho_scale = motion_cam_state
    _point_camera(cam, center)
    return cam, cam_data


def render_motion_frames(blender_dir, log):
    paths = {}
    for frame in MOTION_RENDER_FRAMES:
        bpy.context.scene.frame_set(frame)
        seconds = frame // FPS
        path = os.path.join(blender_dir, f"render-motion-{seconds}s.png")
        bpy.context.scene.render.filepath = path
        bpy.ops.render.render(write_still=True)
        paths[seconds] = path
        log.add(f"render motion t={seconds}s (frame {frame}): {path}")
    return paths


def pixel_diff_ratio(path_a, path_b):
    """Fraction of pixels whose RGB differs by more than 8/255. Loads through
    bpy (Pillow is not bundled with this Blender build; numpy is)."""
    img_a = bpy.data.images.load(path_a)
    img_b = bpy.data.images.load(path_b)
    try:
        a = np.asarray(img_a.pixels[:], dtype=np.float64).reshape(-1, 4)[:, :3]
        b = np.asarray(img_b.pixels[:], dtype=np.float64).reshape(-1, 4)[:, :3]
    finally:
        bpy.data.images.remove(img_a)
        bpy.data.images.remove(img_b)
    changed = (np.abs(a - b).max(axis=1) * 255.0) > 8.0
    return float(changed.mean())


def verify_motion_pixels(paths, log):
    ratio_0_4 = pixel_diff_ratio(paths[0], paths[4])
    ratio_4_8 = pixel_diff_ratio(paths[4], paths[8])
    ratio_0_8 = pixel_diff_ratio(paths[0], paths[8])
    log.add(f"motion render pixel diff (changed-pixel ratio, threshold 8/255): "
            f"0s vs 4s = {ratio_0_4:.4%}, 4s vs 8s = {ratio_4_8:.4%}, 0s vs 8s = {ratio_0_8:.4%}")
    if ratio_0_4 < 0.01:
        raise HardFail(f"Idle is not visibly animated: 0s vs 4s changed-pixel ratio "
                       f"{ratio_0_4:.4%} < 1% hard gate")
    log.add("motion render pixel gate (>=1% at Blender level): PASS")
    return ratio_0_4, ratio_4_8, ratio_0_8


def export_glb(out_path, log):
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=out_path,
        export_format="GLB",
        export_yup=True,
        export_animations=True,
        export_animation_mode="ACTIONS",
        export_force_sampling=True,
        export_apply=False,
    )
    size = os.path.getsize(out_path)
    digest = sha256_file(out_path)
    tris = triangle_count()
    bones = sum(len(ob.data.bones) for ob in bpy.context.scene.objects if ob.type == "ARMATURE")
    log.add(f"export: {out_path}")
    log.add(f"export stats: {size} bytes, sha256 {digest}, {tris} triangles, {bones} bones")
    if size > GLB_BYTES_CEILING:
        raise HardFail(f"GLB {size} bytes exceeds {GLB_BYTES_CEILING} ceiling")
    if tris > 250_000:
        raise HardFail(f"GLB {tris} triangles exceeds 250k ceiling")
    if size > GLB_BYTES_TARGET:
        log.add(f"WARNING: GLB exceeds {GLB_BYTES_TARGET} byte target (within ceiling)")
    if tris > TRIANGLE_TARGET:
        log.add(f"WARNING: triangle count exceeds {TRIANGLE_TARGET} target (within ceiling)")
    return {"bytes": size, "sha256": digest, "triangles": tris, "bones": bones}
