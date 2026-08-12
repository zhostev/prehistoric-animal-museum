"""Habitat background renderer of the animal-onboarding toolchain.

Usage:
  blender --background --factory-startup \
    --python tools/animal-onboarding/blender/render_habitat.py -- \
    --spec <scene-spec.json>

The scene spec is the complete, deterministic "prompt equivalent": it is
authored by tools/animal-onboarding/src/lib/derivatives.ts (seeded per animal
id) and lists every world gradient stop, light, ground plane, hill, tree,
rock, god-ray plane and water mote, plus both camera compositions
(landscape and portrait are separate cameras, never crops). This script only
interprets the spec: it builds the scene, renders both PNGs with Eevee and
writes a report JSON (spec echo + render settings + output sha256/bytes) that
the derivatives stage folds into qa/derivatives-log.json.

No animals, text, logos or watermarks are ever added to the scene.
"""

import hashlib
import json
import os
import sys

import bpy
from mathutils import Vector


class HardFail(Exception):
    pass


def parse_args():
    argv = sys.argv[sys.argv.index("--") + 1:]
    if argv[:1] != ["--spec"] or len(argv) != 2:
        raise HardFail("usage: render_habitat.py -- --spec <scene-spec.json>")
    return os.path.abspath(argv[1])


def sha256_file(path):
    digest = hashlib.sha256()
    with open(path, "rb") as handle:
        for chunk in iter(lambda: handle.read(1 << 20), b""):
            digest.update(chunk)
    return digest.hexdigest()


def rgb(value):
    return (value[0], value[1], value[2], 1.0)


def make_diffuse_material(name, color, roughness=0.95, emission_strength=0.0):
    material = bpy.data.materials.new(name)
    material.use_nodes = True
    bsdf = material.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = rgb(color)
    bsdf.inputs["Roughness"].default_value = roughness
    if emission_strength > 0.0:
        bsdf.inputs["Emission Color"].default_value = rgb(color)
        bsdf.inputs["Emission Strength"].default_value = emission_strength
    return material


def make_ray_material(name, color, opacity, emission_strength=0.35):
    """Translucent emissive plane for an underwater god-ray suggestion."""
    material = bpy.data.materials.new(name)
    material.use_nodes = True
    bsdf = material.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = rgb(color)
    bsdf.inputs["Roughness"].default_value = 1.0
    bsdf.inputs["Emission Color"].default_value = rgb(color)
    bsdf.inputs["Emission Strength"].default_value = emission_strength
    bsdf.inputs["Alpha"].default_value = opacity
    try:
        material.surface_render_method = "DITHERED"
    except AttributeError:
        material.blend_method = "BLEND"
    return material


def build_world(spec):
    world = bpy.data.worlds.get("World") or bpy.data.worlds.new("World")
    bpy.context.scene.world = world
    world.use_nodes = True
    nodes = world.node_tree.nodes
    links = world.node_tree.links
    nodes.clear()

    output = nodes.new("ShaderNodeOutputWorld")
    background = nodes.new("ShaderNodeBackground")
    background.inputs["Strength"].default_value = spec["world"]["strength"]
    texcoord = nodes.new("ShaderNodeTexCoord")
    separate = nodes.new("ShaderNodeSeparateXYZ")
    # The world Texture Coordinate Normal points inward (opposite the view
    # ray), so higher-on-screen rays have LOWER Normal.z: map inverted to
    # keep spec stop 0 at the bottom of the frame and 1 at the top.
    map_range = nodes.new("ShaderNodeMapRange")
    map_range.inputs["From Min"].default_value = -1.0
    map_range.inputs["From Max"].default_value = 1.0
    map_range.inputs["To Min"].default_value = 1.0
    map_range.inputs["To Max"].default_value = 0.0
    map_range.clamp = True
    ramp = nodes.new("ShaderNodeValToRGB")
    stops = spec["world"]["stops"]
    if len(stops) < 2:
        raise HardFail("world.stops needs at least two gradient stops")
    ramp.color_ramp.interpolation = "EASE"
    ramp.color_ramp.elements[0].position = stops[0][0]
    ramp.color_ramp.elements[0].color = rgb(stops[0][1])
    ramp.color_ramp.elements[1].position = stops[-1][0]
    ramp.color_ramp.elements[1].color = rgb(stops[-1][1])
    for position, color in stops[1:-1]:
        element = ramp.color_ramp.elements.new(position)
        element.color = rgb(color)

    links.new(texcoord.outputs["Normal"], separate.inputs["Vector"])
    links.new(separate.outputs["Z"], map_range.inputs["Value"])
    links.new(map_range.outputs["Result"], ramp.inputs["Fac"])
    links.new(ramp.outputs["Color"], background.inputs["Color"])
    links.new(background.outputs["Background"], output.inputs["Surface"])


def add_plane(name, location, size, material, rotation=(0.0, 0.0, 0.0)):
    bpy.ops.mesh.primitive_plane_add(size=size, location=location, rotation=rotation)
    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(material)
    return obj


def add_ico(name, location, scale, material, subdivisions=1):
    bpy.ops.mesh.primitive_ico_sphere_add(
        subdivisions=subdivisions, radius=1.0, location=location,
    )
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    bpy.ops.object.transform_apply(scale=True)
    obj.data.materials.append(material)
    return obj


def add_tree(index, tree, materials):
    trunk = None
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=8,
        radius=tree["trunkRadius"],
        depth=tree["trunkHeight"],
        location=(
            tree["location"][0],
            tree["location"][1],
            tree["location"][2] + tree["trunkHeight"] / 2.0,
        ),
    )
    trunk = bpy.context.object
    trunk.name = f"tree-{index:02d}-trunk"
    trunk.data.materials.append(materials[tree["trunkMaterial"]])
    bpy.ops.mesh.primitive_cone_add(
        vertices=8,
        radius1=tree["canopyRadius"],
        radius2=tree["canopyRadius"] * 0.22,
        depth=tree["canopyHeight"],
        location=(
            tree["location"][0],
            tree["location"][1],
            tree["location"][2] + tree["trunkHeight"] + tree["canopyHeight"] / 2.0,
        ),
    )
    canopy = bpy.context.object
    canopy.name = f"tree-{index:02d}-canopy"
    canopy.data.materials.append(materials[tree["canopyMaterial"]])


def add_patch(index, patch, materials):
    """Very flat, low-contrast ground-tone disc: breaks up the plain ground
    without breaking the composition ground-continuity gate."""
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=16,
        radius=patch["radius"],
        depth=patch["height"],
        location=patch["location"],
    )
    obj = bpy.context.object
    obj.name = f"patch-{index:02d}"
    obj.data.materials.append(materials[patch["material"]])


def point_camera(camera, target):
    camera.rotation_euler = (
        Vector(target) - camera.location
    ).to_track_quat("-Z", "Y").to_euler()


def build_scene(spec):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene

    build_world(spec)

    materials = {}
    for name, entry in spec["materials"].items():
        if entry.get("kind") == "ray":
            materials[name] = make_ray_material(
                name,
                entry["color"],
                entry["opacity"],
                emission_strength=entry.get("emissionStrength", 0.35),
            )
        else:
            materials[name] = make_diffuse_material(
                name,
                entry["color"],
                roughness=entry.get("roughness", 0.95),
                emission_strength=entry.get("emissionStrength", 0.0),
            )

    ground = spec["ground"]
    add_plane(
        "ground",
        (0.0, 0.0, ground["z"]),
        ground["size"],
        materials[ground["material"]],
    )

    for index, hill in enumerate(spec.get("hills", [])):
        add_ico(
            f"hill-{index:02d}",
            hill["location"],
            hill["scale"],
            materials[hill["material"]],
        )
    for index, tree in enumerate(spec.get("trees", [])):
        add_tree(index, tree, materials)
    for index, rock in enumerate(spec.get("rocks", [])):
        add_ico(
            f"rock-{index:02d}",
            rock["location"],
            rock["scale"],
            materials[rock["material"]],
        )
    for index, patch in enumerate(spec.get("patches", [])):
        add_patch(index, patch, materials)
    for index, ray in enumerate(spec.get("rays", [])):
        obj = add_plane(
            f"ray-{index:02d}",
            ray["location"],
            1.0,
            materials[ray["material"]],
            rotation=ray["rotationEuler"],
        )
        obj.scale = (ray["width"], ray["height"], 1.0)
        bpy.ops.object.transform_apply(scale=True)
        try:
            obj.visible_shadow = False
        except AttributeError:
            pass
    for index, mote in enumerate(spec.get("particles", [])):
        add_ico(
            f"mote-{index:02d}",
            mote["location"],
            (mote["radius"],) * 3,
            materials[mote["material"]],
        )

    sun_spec = spec["sun"]
    sun_data = bpy.data.lights.new("sun", type="SUN")
    sun_data.energy = sun_spec["energy"]
    sun_data.color = sun_spec["color"]
    sun_data.angle = sun_spec["angle"]
    sun = bpy.data.objects.new("sun", sun_data)
    sun.rotation_euler = sun_spec["rotationEuler"]
    scene.collection.objects.link(sun)

    cameras = {}
    for key, camera_spec in spec["cameras"].items():
        camera_data = bpy.data.cameras.new(f"camera-{key}")
        camera_data.lens = camera_spec["focalLength"]
        camera = bpy.data.objects.new(f"camera-{key}", camera_data)
        camera.location = camera_spec["location"]
        point_camera(camera, camera_spec["target"])
        scene.collection.objects.link(camera)
        cameras[key] = (camera, camera_spec)

    return scene, cameras


def render(scene, cameras):
    scene.render.engine = "BLENDER_EEVEE_NEXT"
    try:
        scene.eevee.taa_render_samples = 32
    except AttributeError:
        pass
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGB"
    scene.render.film_transparent = False
    scene.render.resolution_percentage = 100
    scene.view_settings.view_transform = "Standard"
    scene.view_settings.look = "None"

    outputs = {}
    for key in ("landscape", "portrait"):
        camera, camera_spec = cameras[key]
        scene.camera = camera
        scene.render.resolution_x = camera_spec["width"]
        scene.render.resolution_y = camera_spec["height"]
        output_path = camera_spec["output"]
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        scene.render.filepath = output_path
        bpy.ops.render.render(write_still=True)
        outputs[key] = {
            "path": output_path,
            "width": camera_spec["width"],
            "height": camera_spec["height"],
            "bytes": os.path.getsize(output_path),
            "sha256": sha256_file(output_path),
        }
    return outputs


def main():
    spec_path = parse_args()
    with open(spec_path, "r", encoding="utf-8") as handle:
        spec = json.load(handle)

    scene, cameras = build_scene(spec)
    outputs = render(scene, cameras)

    report = {
        "animal": spec["animal"],
        "habitat": spec["habitat"],
        "seed": spec["seed"],
        "blenderVersion": bpy.app.version_string,
        "engine": scene.render.engine,
        "viewTransform": scene.view_settings.view_transform,
        "spec": spec,
        "outputs": outputs,
    }
    with open(spec["reportPath"], "w", encoding="utf-8") as handle:
        json.dump(report, handle, indent=2)
        handle.write("\n")
    print(f"HABITAT_RENDER_OK {spec['animal']}")


try:
    main()
except HardFail as error:
    print(f"HABITAT_RENDER_FAIL {error}")
    sys.exit(1)
