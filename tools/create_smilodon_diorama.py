"""Script to generate an integrated paleoenvironment diorama plinth for Smilodon
and assemble a production-grade GLB model for Prehistoric Animal Museum.
Runs headless in Blender 4.5+.
"""

import argparse
import math
import os
import sys
import bpy
import bmesh
import numpy as np
from mathutils import Matrix, Vector, noise


def parse_args():
    argv = sys.argv
    if "--" in argv:
        argv = argv[argv.index("--") + 1 :]
    else:
        argv = []
    parser = argparse.ArgumentParser(description="Build Smilodon diorama plinth")
    parser.add_argument("--input", required=True, help="Input uncompressed GLB path")
    parser.add_argument("--output", required=True, help="Output GLB path")
    return parser.parse_args(argv)


def create_diorama_material():
    mat = bpy.data.materials.new(name="Material_Diorama")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()

    # Principled BSDF
    bsdf = nodes.new(type="ShaderNodeBsdfPrincipled")
    bsdf.location = (200, 0)
    bsdf.inputs["Roughness"].default_value = 0.88
    bsdf.inputs["Metallic"].default_value = 0.0

    # Color Attribute (for Vertex AO & shading)
    color_attr = nodes.new(type="ShaderNodeVertexColor")
    color_attr.location = (-400, 100)
    color_attr.layer_name = "Color"

    # Base Tundra Rock Color Mix
    rock_color = nodes.new(type="ShaderNodeRGB")
    rock_color.location = (-400, -100)
    # Natural late-Pleistocene cold tundra rock/soil palette: cold earthy brown-grey
    rock_color.outputs["Color"].default_value = (0.28, 0.26, 0.23, 1.0)

    # Mix Color with Vertex AO
    mix_node = nodes.new(type="ShaderNodeMix")
    mix_node.data_type = "RGBA"
    mix_node.blend_type = "MULTIPLY"
    mix_node.location = (-100, 0)
    mix_node.inputs["Factor"].default_value = 1.0
    links.new(rock_color.outputs["Color"], mix_node.inputs[6])
    links.new(color_attr.outputs["Color"], mix_node.inputs[7])

    links.new(mix_node.outputs[2], bsdf.inputs["Base Color"])

    # Material Output
    out_node = nodes.new(type="ShaderNodeOutputMaterial")
    out_node.location = (450, 0)
    links.new(bsdf.outputs["BSDF"], out_node.inputs["Surface"])

    return mat


def build_plinth_mesh(paw_clusters, base_z=-0.62):
    """Generates an organic natural geological slice plinth tailored to paw positions."""
    mesh = bpy.data.meshes.new("Smilodon_Plinth")
    bm = bmesh.new()

    rings = 14
    segments = 44
    radius_x = 0.78  # Width ~1.56m
    radius_y = 1.18  # Length ~2.36m

    # Compute paw weights for elevation shaping
    def get_surface_z(x, y, base_elevation):
        p_xy = Vector((x, y))
        # Find influence from nearest paw
        min_dist = 999.0
        target_paw_z = -0.435
        for paw_center, min_z in paw_clusters:
            d = (p_xy - paw_center).length
            if d < min_dist:
                min_dist = d
                target_paw_z = min_z

        # Local organic micro-undulation
        macro_noise = 0.015 * noise.noise(Vector((x * 2.2, y * 2.2, 0.7)))
        micro_noise = 0.006 * noise.noise(Vector((x * 5.5, y * 5.5, 1.3)))

        # Natural slope: ground is slightly higher at front where front paws rest
        natural_slope = -0.448 + 0.022 * (y / radius_y) + macro_noise + micro_noise

        # Blend toward paw level near paws (within 0.18m)
        if min_dist < 0.22:
            blend = math.cos(min_dist / 0.22 * (math.pi / 2.0))
            # Sink paw area just 2mm below min_z for firm grounding without clipping
            contact_z = target_paw_z - 0.002
            return natural_slope * (1.0 - blend) + contact_z * blend
        return natural_slope

    # Top surface grid vertices
    grid = []
    for r in range(rings + 1):
        ring_r = r / rings
        row = []
        for s in range(segments):
            theta = 2.0 * math.pi * s / segments
            # Organic outline noise
            n_angle = noise.noise(Vector((math.cos(theta) * 2.1, math.sin(theta) * 2.1, 0.4)))
            r_effective = ring_r * (1.0 + 0.12 * n_angle)

            px = math.cos(theta) * radius_x * r_effective
            py = math.sin(theta) * radius_y * r_effective
            pz = get_surface_z(px, py, -0.445)
            v = bm.verts.new((px, py, pz))
            row.append(v)
        grid.append(row)

    # Create top surface faces
    for r in range(rings):
        for s in range(segments):
            s_next = (s + 1) % segments
            v0 = grid[r][s]
            v1 = grid[r][s_next]
            v2 = grid[r + 1][s_next]
            v3 = grid[r + 1][s]
            bm.faces.new((v0, v1, v2, v3))

    # Outer ring vertices for sides & bottom
    outer_top_row = grid[-1]
    outer_bottom_row = []
    outer_bottom_beveled = []

    # Geological strata bevel side
    side_bevel_z = base_z + 0.04
    for s in range(segments):
        top_v = outer_top_row[s]
        # Slight outward flare at bottom
        bx = top_v.co.x * 1.04
        by = top_v.co.y * 1.04
        bv = bm.verts.new((bx, by, side_bevel_z))
        outer_bottom_beveled.append(bv)

        bot_v = bm.verts.new((bx * 0.98, by * 0.98, base_z))
        outer_bottom_row.append(bot_v)

    # Side faces
    for s in range(segments):
        s_next = (s + 1) % segments
        # Upper side face
        bm.faces.new((
            outer_top_row[s],
            outer_top_row[s_next],
            outer_bottom_beveled[s_next],
            outer_bottom_beveled[s],
        ))
        # Lower side face
        bm.faces.new((
            outer_bottom_beveled[s],
            outer_bottom_beveled[s_next],
            outer_bottom_row[s_next],
            outer_bottom_row[s],
        ))

    # Bottom cap center vertex and fan
    bot_center = bm.verts.new((0.0, 0.0, base_z))
    for s in range(segments):
        s_next = (s + 1) % segments
        bm.faces.new((bot_center, outer_bottom_row[s_next], outer_bottom_row[s]))

    # Calculate Contact AO & Vertex Colors
    bm.verts.ensure_lookup_table()
    bm.faces.ensure_lookup_table()

    # Add decorative rock outcrops
    rock_centers = [
        (0.55, -0.65, -0.450, 0.07),
        (-0.50, 0.70, -0.425, 0.065),
        (-0.58, -0.45, -0.455, 0.06),
        (0.48, 0.60, -0.422, 0.065),
    ]
    for rx, ry, rz, rad in rock_centers:
        trans_mat = Matrix.Translation(Vector((rx, ry, rz)))
        bmesh.ops.create_icosphere(bm, subdivisions=1, radius=rad, matrix=trans_mat)

    bm.to_mesh(mesh)
    bm.free()

    # Create Vertex Color attribute "Color"
    color_layer = mesh.color_attributes.new(name="Color", type="FLOAT_COLOR", domain="CORNER")
    
    # Calculate Ambient Occlusion based on paw and body proximity
    belly_center = Vector((0.08, -0.05, -0.44))
    for poly in mesh.polygons:
        for loop_idx in poly.loop_indices:
            vert_idx = mesh.loops[loop_idx].vertex_index
            v_co = mesh.vertices[vert_idx].co

            if v_co.z > base_z + 0.02:
                # Top / side vertex
                # Paw AO
                min_paw_dist = min((Vector((v_co.x, v_co.y)) - pc).length for pc, _ in paw_clusters)
                paw_ao = min(1.0, max(0.28, min_paw_dist / 0.15))

                # Belly shadow
                belly_dist = (Vector((v_co.x, v_co.y)) - Vector((belly_center.x, belly_center.y))).length
                belly_ao = min(1.0, max(0.55, belly_dist / 0.45))

                # Side edge shading
                side_factor = 1.0 if v_co.z > -0.47 else 0.75

                shade = paw_ao * belly_ao * side_factor
                color_layer.data[loop_idx].color = (shade, shade * 0.98, shade * 0.94, 1.0)
            else:
                # Bottom
                color_layer.data[loop_idx].color = (0.2, 0.2, 0.2, 1.0)

    obj = bpy.data.objects.new("Smilodon_Plinth", mesh)
    bpy.context.scene.collection.objects.link(obj)

    # Assign material
    mat = create_diorama_material()
    mesh.materials.append(mat)

    return obj


def main():
    args = parse_args()
    print(f"[*] Loading input model: {args.input}")
    print(f"[*] Target output model: {args.output}")

    # 1. Reset Blender scene
    bpy.ops.wm.read_factory_settings(use_empty=True)

    # 2. Import uncompressed GLB
    bpy.ops.import_scene.gltf(filepath=args.input)

    # Remove any extraneous helper meshes like Icosphere
    for ob in list(bpy.context.scene.objects):
        if ob.name == "Icosphere" or (ob.type == "MESH" and len(ob.data.polygons) < 100 and ob.parent is None):
            print(f"[-] Removing extraneous helper mesh: {ob.name}")
            bpy.data.objects.remove(ob, do_unlink=True)

    # Locate Smilodon Mesh & Armature
    smilodon_mesh = None
    armature = None
    for ob in bpy.context.scene.objects:
        if ob.type == "MESH" and ob.name != "Smilodon_Plinth":
            smilodon_mesh = ob
        elif ob.type == "ARMATURE":
            armature = ob

    if not smilodon_mesh:
        raise RuntimeError("Could not find Smilodon mesh in scene!")

    print(f"[+] Found Smilodon mesh: {smilodon_mesh.name} ({len(smilodon_mesh.data.polygons)} polys)")
    if armature:
        print(f"[+] Found Armature: {armature.name}")

    # Inspect paw clusters
    lowest_verts = [v.co for v in smilodon_mesh.data.vertices if v.co.z < -0.40]
    fl = [v for v in lowest_verts if v.x < 0 and v.y > 0]
    fr = [v for v in lowest_verts if v.x > 0 and v.y > 0]
    bl = [v for v in lowest_verts if v.x < 0 and v.y < 0]
    br = [v for v in lowest_verts if v.x > 0 and v.y < 0]

    paw_clusters = []
    for group in [fl, fr, bl, br]:
        if group:
            avg_x = sum(v.x for v in group) / len(group)
            avg_y = sum(v.y for v in group) / len(group)
            min_z = min(v.z for v in group)
            paw_clusters.append((Vector((avg_x, avg_y)), min_z))

    print(f"[+] Computed {len(paw_clusters)} paw contact points:")
    for i, (center, min_z) in enumerate(paw_clusters):
        print(f"    Paw {i+1}: Center=({center.x:.3f}, {center.y:.3f}), Min Z={min_z:.4f}")

    # Build diorama plinth
    plinth = build_plinth_mesh(paw_clusters, base_z=-0.62)
    print(f"[+] Created Diorama Plinth: {plinth.name} ({len(plinth.data.polygons)} polys, {len(plinth.data.vertices)} verts)")

    # Ensure plinth is NOT bound to armature
    plinth.parent = None
    for mod in list(plinth.modifiers):
        plinth.modifiers.remove(mod)

    # Check total poly count
    total_polys = sum(len(ob.data.polygons) for ob in bpy.context.scene.objects if ob.type == "MESH")
    print(f"[+] Total Scene Polygons: {total_polys}")

    # Export to GLB
    print(f"[*] Exporting integrated GLB to {args.output}...")
    bpy.ops.export_scene.gltf(
        filepath=args.output,
        export_format="GLB",
        export_animations=True,
        export_apply=False,
        export_yup=True,
    )
    print("[*] Export complete.")


if __name__ == "__main__":
    main()
