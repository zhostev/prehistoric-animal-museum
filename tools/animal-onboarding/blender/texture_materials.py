"""Deterministic procedural texture bake for the animal-onboarding pipeline.

Optional stage driven by `model.textureBake` in the candidate profile. For
animals whose source carries no UVs and only flat base-colour materials, this
adds one Smart-UV-Project map per mesh, builds a small procedural pattern per
material slot (derived from the slot's existing colour chain, so source
tinting such as glTF COLOR_0 vertex colours is preserved), bakes diffuse
colour into per-material images with Cycles and rewires each slot to its
baked image. The GLB exporter then packs the images.

Determinism: Smart UV Project is a fixed algorithm on fixed geometry and the
Noise / Voronoi / Wave textures are seed-stable in Blender 4.5; no external
files and no randomness are involved, so a rerun on the same source produces
the same textures. A rerun after GEOMETRY changes rebakes new UVs/images by
design — that is the maintenance cost this stage accepts in exchange for real
texture detail.

Material quality and the biological plausibility of every baked pattern
remain human-review-only even when the deterministic pipeline passes.

Profile schema (all pattern kinds optional per slot, default "mottle"):

  "model": {
    ...
    "textureBake": {
      "patterns": {"Body": "scales", "Sail": "stripes"},
      "mainMaterial": "Body",   // optional; baked at 1024px, others 512px
      "resolution": 512         // optional default size for non-main slots
    }
  }

Pattern kinds:
  scales  – large mottled patches + fine Voronoi scale cells (main surfaces)
  stripes – contrasting distorted Wave bands along Z (sails, crests)
  mottle  – gentle Noise-only mottling (small accent slots)
"""

import math

import bpy

KINDS = ("scales", "stripes", "mottle")
MAIN_RESOLUTION = 1024
DEFAULT_RESOLUTION = 512


def texture_bake_config(profile):
    """Return the validated textureBake config or None when the stage is off."""
    config = profile.get("model", {}).get("textureBake")
    if config is None:
        return None
    if not isinstance(config, dict):
        raise ValueError("model.textureBake must be an object")
    patterns = config.get("patterns", {})
    if not isinstance(patterns, dict):
        raise ValueError("model.textureBake.patterns must be an object")
    for name, kind in patterns.items():
        if kind not in KINDS:
            raise ValueError(
                f"model.textureBake.patterns.{name} must be one of {KINDS}")
    resolution = config.get("resolution", DEFAULT_RESOLUTION)
    if resolution not in (256, 512, 1024, 2048):
        raise ValueError("model.textureBake.resolution must be 256|512|1024|2048")
    return {
        "patterns": patterns,
        "mainMaterial": config.get("mainMaterial"),
        "resolution": resolution,
    }


def _principled_of(material):
    return next(n for n in material.node_tree.nodes if n.type == "BSDF_PRINCIPLED")


def _slot_materials(meshes):
    seen = {}
    for obj in meshes:
        for slot in obj.material_slots:
            if slot.material is not None:
                seen.setdefault(slot.material.name, slot.material)
    return seen


def smart_unwrap(meshes, log):
    for obj in meshes:
        bpy.context.view_layer.objects.active = obj
        obj.select_set(True)
        bpy.ops.object.mode_set(mode="EDIT")
        bpy.ops.mesh.select_all(action="SELECT")
        bpy.ops.uv.smart_project(angle_limit=math.radians(66), island_margin=0.03)
        bpy.ops.object.mode_set(mode="OBJECT")
        obj.select_set(False)
    log.add("texture bake: Smart UV Project (angle limit 66 deg, island margin "
            f"0.03) on {len(meshes)} mesh(es); geometry is fixed at this point, "
            "so the unwrap is deterministic")


def _ramp_mix(nodes, dark, light):
    mix = nodes.new("ShaderNodeMix")
    mix.data_type = "RGBA"
    mix.inputs["A"].default_value = (*dark, 1.0)
    mix.inputs["B"].default_value = (*light, 1.0)
    return mix


def build_pattern(material, kind):
    """Multiply the slot's existing Base Color source (flat value or a linked
    chain such as the glTF importer's vertex-colour multiply) by a deterministic
    brightness pattern; the source tint survives the bake."""
    nt = material.node_tree
    nodes, links = nt.nodes, nt.links
    bsdf = _principled_of(material)
    base_input = bsdf.inputs["Base Color"]
    if base_input.is_linked:
        orig_color = base_input.links[0].from_socket
    else:
        rgb = nodes.new("ShaderNodeRGB")
        rgb.outputs["Color"].default_value = base_input.default_value
        orig_color = rgb.outputs["Color"]
    tex = nodes.new("ShaderNodeTexCoord")

    def modulated(fac_socket, dark, light):
        mix = _ramp_mix(nodes, dark, light)
        links.new(fac_socket, mix.inputs["Factor"])
        mult = nodes.new("ShaderNodeMix")
        mult.data_type = "RGBA"
        mult.blend_type = "MULTIPLY"
        mult.inputs["Factor"].default_value = 1.0
        links.new(orig_color, mult.inputs["A"])
        links.new(mix.outputs["Result"], mult.inputs["B"])
        links.new(mult.outputs["Result"], base_input)

    if kind == "scales":
        noise = nodes.new("ShaderNodeTexNoise")
        noise.noise_dimensions = "3D"
        noise.inputs["Scale"].default_value = 3.0
        noise.inputs["Detail"].default_value = 3.0
        noise.inputs["Roughness"].default_value = 0.7
        vor = nodes.new("ShaderNodeTexVoronoi")
        vor.voronoi_dimensions = "3D"
        vor.distance = "EUCLIDEAN"
        vor.feature = "DISTANCE_TO_EDGE"
        vor.inputs["Scale"].default_value = 14.0
        links.new(tex.outputs["Generated"], noise.inputs["Vector"])
        links.new(tex.outputs["Generated"], vor.inputs["Vector"])
        mult = nodes.new("ShaderNodeMath")
        mult.operation = "MULTIPLY"
        mult.inputs[1].default_value = 2.2  # thin scale edges only
        links.new(vor.outputs["Distance"], mult.inputs[0])
        add = nodes.new("ShaderNodeMath")
        add.operation = "ADD"
        add.use_clamp = True
        links.new(noise.outputs["Fac"], add.inputs[0])
        links.new(mult.outputs[0], add.inputs[1])
        modulated(add.outputs[0], (0.45,) * 3, (1.25,) * 3)
    elif kind == "stripes":
        wave = nodes.new("ShaderNodeTexWave")
        wave.wave_type = "BANDS"
        wave.bands_direction = "Z"
        wave.inputs["Scale"].default_value = 9.0
        wave.inputs["Distortion"].default_value = 6.0
        wave.inputs["Detail"].default_value = 4.0
        links.new(tex.outputs["Generated"], wave.inputs["Vector"])
        modulated(wave.outputs["Color"], (0.45,) * 3, (1.6,) * 3)
    else:  # mottle
        noise = nodes.new("ShaderNodeTexNoise")
        noise.noise_dimensions = "3D"
        noise.inputs["Scale"].default_value = 6.0
        noise.inputs["Detail"].default_value = 2.0
        links.new(tex.outputs["Generated"], noise.inputs["Vector"])
        modulated(noise.outputs["Fac"], (0.5,) * 3, (1.15,) * 3)


def _bake(meshes, materials, config, log):
    scene = bpy.context.scene
    previous_engine = scene.render.engine
    scene.render.engine = "CYCLES"
    scene.cycles.samples = 8
    baked = {}
    for name, material in materials.items():
        size = MAIN_RESOLUTION if name == config["mainMaterial"] else config["resolution"]
        image = bpy.data.images.new(f"bake_{name}", width=size, height=size)
        node = material.node_tree.nodes.new("ShaderNodeTexImage")
        node.image = image
        material.node_tree.nodes.active = node
        baked[name] = (image, node)
    for obj in meshes:
        if not any(s.material and s.material.name in baked for s in obj.material_slots):
            log.add(f"texture bake: mesh '{obj.name}' has no baked material slot; "
                    "left untextured")
            continue
        bpy.ops.object.mode_set(mode="OBJECT")
        bpy.ops.object.select_all(action="DESELECT")
        bpy.context.view_layer.objects.active = obj
        obj.select_set(True)
        bpy.ops.object.bake(type="DIFFUSE", pass_filter={"COLOR"}, margin=16)
        obj.select_set(False)
    scene.render.engine = previous_engine
    log.add("texture bake: Cycles DIFFUSE color-only bake, 8 samples, margin 16; "
            f"images {({k: f'{v[0].size[0]}px' for k, v in baked.items()})}")
    return baked


def _rewire_to_baked(materials, baked, log):
    for name, material in materials.items():
        if name not in baked:
            continue
        image, node = baked[name]
        image.pack()
        bsdf = _principled_of(material)
        for link in list(material.node_tree.links):
            if link.to_node == bsdf and link.to_socket.name == "Base Color":
                material.node_tree.links.remove(link)
        material.node_tree.links.new(node.outputs["Color"], bsdf.inputs["Base Color"])
    log.add(f"texture bake: {len(baked)} material slot(s) rewired to packed "
            "baked images; procedural nodes discarded from the export path")


def bake_procedural_textures(meshes, config, log):
    """Run the full unwrap -> pattern -> bake -> rewire pass on the given meshes."""
    materials = _slot_materials(meshes)
    if not materials:
        log.add("texture bake: no materials on the animal meshes; stage skipped")
        return
    smart_unwrap(meshes, log)
    for name, material in materials.items():
        kind = config["patterns"].get(name.split(".")[0], "mottle")
        build_pattern(material, kind)
        log.add(f"texture bake: pattern '{kind}' on material '{name}' "
                "(brightness modulation of the existing colour chain)")
    baked = _bake(meshes, materials, config, log)
    _rewire_to_baked(materials, baked, log)
    log.add("texture bake: automated pass; baked material quality and biological "
            "plausibility remain human-review-only (approval category 'materials')")
