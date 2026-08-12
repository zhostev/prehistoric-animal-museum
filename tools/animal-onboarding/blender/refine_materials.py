"""Deterministic material refinement for the museum's onboarding models.

The source scans and low-poly packs used by the later collection entries carry
either no material at all or only broad flat colours.  These helpers author
small, bounded PBR palettes and assign them from stable mesh-space regions.
They deliberately avoid random noise, guessed mouth regions, external texture
files and geometry-dependent UV unwraps so a rerun produces the same GLB.

Material quality and the biological plausibility of every palette remain
human-review-only even when the deterministic pipeline passes.
"""

import math

import bpy
import numpy as np


def _pbr_material(name, color, roughness, metallic=0.0):
    material = bpy.data.materials.new(name)
    _configure_material(material, color, roughness, metallic)
    return material


def _configure_material(material, color, roughness, metallic=0.0):
    rgba = (*color, 1.0)
    material.diffuse_color = rgba
    material.use_nodes = True
    nodes = material.node_tree.nodes
    nodes.clear()
    output = nodes.new("ShaderNodeOutputMaterial")
    shader = nodes.new("ShaderNodeBsdfPrincipled")
    shader.inputs["Base Color"].default_value = rgba
    shader.inputs["Roughness"].default_value = roughness
    shader.inputs["Metallic"].default_value = metallic
    material.node_tree.links.new(shader.outputs["BSDF"], output.inputs["Surface"])


def _local_geometry(mesh):
    vertices = np.empty(len(mesh.data.vertices) * 3, dtype=np.float64)
    mesh.data.vertices.foreach_get("co", vertices)
    vertices = vertices.reshape(-1, 3)
    centers = np.empty(len(mesh.data.polygons) * 3, dtype=np.float64)
    mesh.data.polygons.foreach_get("center", centers)
    centers = centers.reshape(-1, 3)
    lo = vertices.min(axis=0)
    hi = vertices.max(axis=0)
    span = np.maximum(hi - lo, 1e-9)
    normalized = (centers - lo) / span
    return centers, normalized, lo, hi


def _clear_palette(mesh, specs):
    mesh.data.materials.clear()
    for name, color, roughness, metallic in specs:
        mesh.data.materials.append(
            _pbr_material(name, color, roughness, metallic),
        )


def refine_quaternius_materials(mesh, animal_id, log):
    """Retain semantic source slots (eyes/claws/belly/crest), enrich the PBR
    response, then add bounded flank markings only to the main body slot."""

    by_name = {
        material.name: (index, material)
        for index, material in enumerate(mesh.data.materials)
        if material is not None
    }
    centers, normalized, _lo, _hi = _local_geometry(mesh)

    if animal_id == "velociraptor":
        palette = {
            "Brown": ((0.29, 0.12, 0.045), 0.84, 0.0),
            "Black": ((0.018, 0.014, 0.012), 0.55, 0.0),
            "LightBrown": ((0.58, 0.34, 0.16), 0.90, 0.0),
        }
        base_name = "Brown"
        additions = [
            ("FlankFeatherBar", (0.16, 0.050, 0.018), 0.90, 0.0),
            ("DorsalPlumage", (0.46, 0.17, 0.038), 0.86, 0.0),
        ]
    else:
        palette = {
            "Green": ((0.13, 0.28, 0.17), 0.88, 0.0),
            "LightGreen": ((0.40, 0.53, 0.27), 0.91, 0.0),
            "LightYellow": ((0.66, 0.57, 0.27), 0.93, 0.0),
            "Red": ((0.56, 0.105, 0.032), 0.84, 0.0),
        }
        base_name = "Green"
        additions = [
            ("FlankStripe", (0.052, 0.15, 0.12), 0.90, 0.0),
            ("DorsalBand", (0.29, 0.41, 0.20), 0.89, 0.0),
        ]

    missing = sorted(set(palette) - set(by_name))
    if missing:
        raise RuntimeError(
            f"{animal_id}: expected semantic source materials missing: {missing}",
        )
    for name, (color, roughness, metallic) in palette.items():
        _configure_material(by_name[name][1], color, roughness, metallic)
    added_indices = []
    for spec in additions:
        mesh.data.materials.append(_pbr_material(*spec))
        added_indices.append(len(mesh.data.materials) - 1)

    base_index = by_name[base_name][0]
    marked = [0, 0]
    for poly, center, norm in zip(mesh.data.polygons, centers, normalized):
        if poly.material_index != base_index:
            continue
        x, y, z = norm
        side = abs(x - 0.5) * 2.0
        if animal_id == "velociraptor":
            stripe = (
                0.10 < y < 0.86
                and 0.38 < z < 0.72
                and side > 0.30
                and int(y * 13.0 + z * 2.0) % 5 == 1
            )
            highlight = (
                0.12 < y < 0.88
                and z > 0.70
                and side > 0.08
                and int(y * 9.0) % 3 != 0
            )
        else:
            stripe = (
                0.14 < y < 0.86
                and 0.35 < z < 0.76
                and side > 0.20
                and int(y * 11.0 + z * 2.0) % 5 == 1
            )
            highlight = (
                0.10 < y < 0.84
                and z > 0.70
                and side > 0.08
                and int(y * 8.0) % 4 != 0
            )
        if highlight:
            poly.material_index = added_indices[1]
            marked[1] += 1
        elif stripe:
            poly.material_index = added_indices[0]
            marked[0] += 1

    for poly in mesh.data.polygons:
        poly.use_smooth = True
    log.add(
        f"material refinement ({animal_id}): converted semantic source slots "
        f"to Principled PBR, added '{additions[0][0]}' to {marked[0]} faces "
        f"and '{additions[1][0]}' to {marked[1]} faces from deterministic "
        "local-coordinate masks; no UV guess or random texture; human material "
        "review required",
    )


def author_aquatic_scan_materials(mesh, animal_id, log):
    centers, normalized, _lo, _hi = _local_geometry(mesh)
    if animal_id == "jaekelopterus":
        specs = [
            ("Carapace", (0.13, 0.27, 0.21), 0.76, 0.03),
            ("SegmentRidge", (0.32, 0.45, 0.27), 0.80, 0.02),
            ("Underside", (0.48, 0.40, 0.23), 0.90, 0.0),
            ("Pincer", (0.29, 0.11, 0.052), 0.73, 0.03),
            ("JointAccent", (0.070, 0.13, 0.11), 0.70, 0.02),
        ]
    else:
        specs = [
            ("BodySkin", (0.12, 0.31, 0.35), 0.74, 0.02),
            ("HeadArmour", (0.38, 0.30, 0.18), 0.81, 0.02),
            ("Belly", (0.51, 0.43, 0.27), 0.92, 0.0),
            ("Dorsal", (0.052, 0.17, 0.20), 0.71, 0.03),
            ("PlateAccent", (0.48, 0.17, 0.065), 0.77, 0.02),
        ]
    _clear_palette(mesh, specs)
    counts = [0] * len(specs)
    for poly, center, norm in zip(mesh.data.polygons, centers, normalized):
        x, y, z = norm
        side = abs(x - 0.5) * 2.0
        if animal_id == "jaekelopterus":
            if y > 0.65 and side > 0.32:
                index = 3  # broad grasping appendages
            elif z < 0.070:
                index = 2
            elif (
                side > 0.52
                and 0.12 < y < 0.88
                and int(y * 16.0 + z * 4.0) % 5 == 0
            ):
                index = 4
            elif int((y * 13.0) + (z * 3.0)) % 6 == 0:
                index = 1
            else:
                index = 0
        else:
            head = y > 0.69
            if head and int(y * 31.0 + side * 5.0 + z * 3.0) % 7 == 0:
                index = 4
            elif head:
                index = 1
            elif z < 0.20:
                index = 2
            elif z > 0.76:
                index = 3
            else:
                index = 0
        poly.material_index = index
        poly.use_smooth = True
        counts[index] += 1
    log.add(
        f"material refinement ({animal_id}): authored {len(specs)} PBR regions "
        f"{[(specs[i][0], counts[i]) for i in range(len(specs))]} from bounded "
        "face-centre masks; scan geometry unchanged; human material/anatomy "
        "review required",
    )


def author_smilodon_materials(mesh, log):
    centers, normalized, _lo, _hi = _local_geometry(mesh)
    specs = [
        ("TawnyFur", (0.46, 0.22, 0.060), 0.95, 0.0),
        ("CreamFur", (0.65, 0.48, 0.25), 0.98, 0.0),
        ("DarkMane", (0.20, 0.070, 0.022), 0.93, 0.0),
        ("FlankMarking", (0.13, 0.035, 0.012), 0.93, 0.0),
        ("PawShade", (0.30, 0.12, 0.032), 0.96, 0.0),
        ("IvoryMuzzle", (0.74, 0.60, 0.37), 0.84, 0.0),
    ]
    _clear_palette(mesh, specs)
    counts = [0] * len(specs)
    for poly, center, norm in zip(mesh.data.polygons, centers, normalized):
        x, y, z = norm
        side = abs(x - 0.5) * 2.0
        head = y > 0.73
        if z < 0.105:
            index = 4
        elif head and z < 0.56:
            index = 5
        elif head:
            index = 2
        elif z < 0.34 and 0.12 < y < 0.76:
            index = 1
        elif (
            0.14 < y < 0.72
            and 0.36 < z < 0.80
            and side > 0.34
            and math.sin(y * 11.0 * math.pi + math.sin(z * 4.0 * math.pi)) > 0.72
        ):
            index = 3
        else:
            index = 0
        poly.material_index = index
        poly.use_smooth = True
        counts[index] += 1
    log.add(
        "material refinement (smilodon): authored tawny/cream/mane/flank/paw/"
        f"muzzle fur regions {[(specs[i][0], counts[i]) for i in range(len(specs))]}; "
        "no broad guessed jaw motion and no geometry edit; human material review "
        "required",
    )


def author_ammonite_materials(mesh, log):
    centers, normalized, lo, hi = _local_geometry(mesh)
    specs = [
        ("FossilStone", (0.39, 0.27, 0.14), 0.96, 0.0),
        ("RaisedRidge", (0.55, 0.40, 0.21), 0.93, 0.0),
        ("DeepGroove", (0.22, 0.13, 0.060), 0.98, 0.0),
        ("IronMineral", (0.38, 0.12, 0.035), 0.90, 0.02),
    ]
    _clear_palette(mesh, specs)
    center_x = (lo[0] + hi[0]) * 0.5
    center_z = (lo[2] + hi[2]) * 0.5
    radius_max = max(hi[0] - lo[0], hi[2] - lo[2]) * 0.5
    counts = [0] * len(specs)
    for poly, center, norm in zip(mesh.data.polygons, centers, normalized):
        dx = (center[0] - center_x) / max(radius_max, 1e-9)
        dz = (center[2] - center_z) / max(radius_max, 1e-9)
        radius = math.sqrt(dx * dx + dz * dz)
        angle = (math.atan2(dz, dx) + math.pi) / (2.0 * math.pi)
        # A handful of broad spiral bands support the real sculpted ridges.
        # Dense face-by-face bands turn into moire at the portrait camera.
        spiral_phase = (radius * 5.5 - angle * 1.2) % 1.0
        mineral = (
            int(angle * 29.0 + radius * 11.0) % 23 == 0
            and 0.18 < spiral_phase < 0.68
        )
        if mineral and radius > 0.28:
            index = 3
        elif spiral_phase < 0.10:
            index = 2
        elif spiral_phase > 0.82 and norm[1] > 0.38:
            index = 1
        else:
            index = 0
        poly.material_index = index
        poly.use_smooth = True
        counts[index] += 1
    log.add(
        "material refinement (ammonite fossil scan): authored deterministic "
        f"stone/ridge/groove/mineral regions {[(specs[i][0], counts[i]) for i in range(len(specs))]}; "
        "this remains a coloured fossil shell, not an invented living soft-body "
        "reconstruction; human material review required",
    )
