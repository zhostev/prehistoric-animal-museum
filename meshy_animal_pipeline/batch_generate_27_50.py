#!/usr/bin/env python3
"""Batch 3D Generation Pipeline for Animals 27-50 via Meshy-6.

Prehistoric Animal Museum expansion (27 to 50):
  27: allosaurus          (异特龙)
  28: brachiosaurus       (腕龙)
  29: quetzalcoatlus      (风神翼龙)
  30: elasmosaurus        (薄板龙)
  31: megaloceros         (大角鹿)
  32: anomalocaris        (奇虾)
  33: albertosaurus       (阿尔伯塔龙)
  34: carnotaurus         (食肉牛龙)
  35: ceratosaurus        (角鼻龙)
  36: compsognathus       (美颌龙)
  37: deinonychus         (恐爪龙)
  38: dimetrodon          (异齿龙)
  39: baryonyx            (重爪龙)
  40: edmontosaurus       (埃德蒙顿龙)
  41: ankylosaurus        (甲龙)
  42: diplodocus          (梁龙)
  43: microraptor         (小盗龙)
  44: glyptodon           (雕齿兽)
  45: acrocanthosaurus    (高棘龙)
  46: carcharodontosaurus (鲨齿龙)
  47: herrerasaurus       (埃雷拉龙)
  48: argentinosaurus     (阿根廷龙)
  49: anhanguera          (安汉格拉翼龙)
  50: ophthalmosaurus     (眼龙)
"""

import os
import sys
import time
from pathlib import Path
from meshy_client import MeshyPipelineClient

ANIMALS_SPEC = {
    27: {
        "id": "allosaurus",
        "name_zh": "异特龙",
        "prompt": (
            "A hyper-realistic prehistoric Allosaurus fragilis, large Late Jurassic carnivorous theropod "
            "dinosaur standing in anatomical neutral bipedal pose, massive skull with prominent brow ridges "
            "and lacrimal horns, powerful three-fingered forelimbs with large curved claws, bipedal stance "
            "with stout muscular legs, detailed realistic scaled reptile skin with subtle color variation, "
            "anatomical accuracy, 8k textures, photorealistic"
        ),
        "negative": "low quality, cartoon, stylized, feathers, extra limbs, deformed skull, blurry, low poly",
    },
    28: {
        "id": "brachiosaurus",
        "name_zh": "腕龙",
        "prompt": (
            "A hyper-realistic prehistoric Brachiosaurus altithorax, enormous long-necked sauropod dinosaur "
            "standing in anatomical neutral quadruped pose, extremely long neck reaching upward to browse on "
            "tall trees, relatively small head with chisel-like teeth, massive pillar-like legs, longer "
            "forelimbs than hindlimbs creating upward-sloping back, long tapering tail, detailed wrinkled "
            "elephant-like skin texture, anatomical accuracy, 8k textures, photorealistic"
        ),
        "negative": "low quality, cartoon, stylized, short neck, deformed limbs, blurry, low poly",
    },
    29: {
        "id": "quetzalcoatlus",
        "name_zh": "风神翼龙",
        "prompt": (
            "A hyper-realistic prehistoric Quetzalcoatlus northropi, giant azhdarchid pterosaur in neutral "
            "standing terrestrial pose on all four limbs, enormous wingspan, extremely long toothless beak "
            "and long neck, prominent head crest, membranous wing patagia, leathery pterosaur skin with "
            "fine pycnofibers, giraffe-like proportions when standing, anatomical accuracy, 8k textures, photorealistic"
        ),
        "negative": "low quality, cartoon, dragon, feathered wings, bat wings, flying pose, deformed beak, blurry, low poly",
    },
    30: {
        "id": "elasmosaurus",
        "name_zh": "薄板龙",
        "prompt": (
            "A hyper-realistic prehistoric Elasmosaurus platyurus, Late Cretaceous long-necked plesiosaur "
            "in neutral swimming pose, extraordinarily long serpentine neck with over 70 vertebrae, small "
            "narrow head with sharp conical teeth, four large paddle-like flippers, relatively small barrel-shaped "
            "body, short tail, smooth scaleless streamlined skin, dark dorsal counter-shaded coloration, "
            "anatomical accuracy, 8k textures, photorealistic"
        ),
        "negative": "low quality, cartoon, short neck, sea monster, deformed flippers, blurry, low poly",
    },
    31: {
        "id": "megaloceros",
        "name_zh": "大角鹿",
        "prompt": (
            "A hyper-realistic prehistoric Megaloceros giganteus, giant ice age deer standing in anatomical "
            "neutral quadruped pose, enormous palmate antlers spanning up to 3.7 meters, robust muscular "
            "cervid body, thick Pleistocene winter coat fur, muscular neck to support massive antler weight, "
            "hooved legs, noble deer-like facial features with large nostrils, anatomical accuracy, "
            "8k textures, photorealistic"
        ),
        "negative": "low quality, cartoon, modern deer, small antlers, deformed legs, blurry, low poly",
    },
    32: {
        "id": "anomalocaris",
        "name_zh": "奇虾",
        "prompt": (
            "A hyper-realistic prehistoric Anomalocaris canadensis, giant Cambrian predatory radiodont "
            "in neutral swimming pose, pair of large segmented frontal appendages with sharp spines, "
            "circular mouth with sharp plates, segmented body with lateral lobes for swimming, compound "
            "stalked eyes, fan-shaped tail fins, iridescent and translucent exoskeleton, anatomical "
            "accuracy, 8k textures, photorealistic"
        ),
        "negative": "low quality, cartoon, shrimp, lobster, modern crustacean, deformed appendages, blurry, low poly",
    },
    33: {
        "id": "albertosaurus",
        "name_zh": "阿尔伯塔龙",
        "prompt": (
            "A hyper-realistic prehistoric Albertosaurus sarcophagus, tyrannosaurid theropod dinosaur "
            "standing in anatomical neutral bipedal pose, relatively slender build compared to T-rex, "
            "two-fingered vestigial forelimbs, large deep skull with binocular vision, long powerful hind "
            "legs with three functional toes, detailed scaly reptile skin texture with rich color variation, "
            "anatomical accuracy, 8k textures, photorealistic"
        ),
        "negative": "low quality, cartoon, T-rex clone, three fingers, feathers, deformed skull, blurry, low poly",
    },
    34: {
        "id": "carnotaurus",
        "name_zh": "食肉牛龙",
        "prompt": (
            "A hyper-realistic prehistoric Carnotaurus sastrei, abelisaurid theropod dinosaur in anatomical "
            "neutral bipedal pose, distinctive pair of thick bull-like horns above the eyes, extremely short "
            "deep snout, vestigial tiny forelimbs, robust barrel-like torso, powerful hindlimbs adapted for "
            "speed, small osteoderms embedded in detailed scaly skin, anatomical accuracy, 8k textures, photorealistic"
        ),
        "negative": "low quality, cartoon, no horns, feathers, large arms, deformed snout, blurry, low poly",
    },
    35: {
        "id": "ceratosaurus",
        "name_zh": "角鼻龙",
        "prompt": (
            "A hyper-realistic prehistoric Ceratosaurus nasicornis, Late Jurassic ceratosaurid theropod "
            "in anatomical neutral bipedal pose, distinctive nasal horn on snout, two small orbital horns "
            "above eyes, four-fingered hands unlike most theropods, flexible sinuous body, row of small "
            "osteoderms along midline of back, detailed scaly skin, anatomical accuracy, 8k textures, photorealistic"
        ),
        "negative": "low quality, cartoon, no horn, missing nasal horn, deformed, feathers, blurry, low poly",
    },
    36: {
        "id": "compsognathus",
        "name_zh": "美颌龙",
        "prompt": (
            "A hyper-realistic prehistoric Compsognathus longipes, tiny elegant coelurosaur theropod "
            "standing in anatomical neutral bipedal pose, chicken-sized body, long slender neck and tail, "
            "pointed narrow snout with small sharp teeth, two-fingered hands, long slender bipedal legs "
            "adapted for running, detailed fine-scaled skin texture, anatomical accuracy, 8k textures, photorealistic"
        ),
        "negative": "low quality, cartoon, feathers, large size, deformed limbs, blurry, low poly",
    },
    37: {
        "id": "deinonychus",
        "name_zh": "恐爪龙",
        "prompt": (
            "A hyper-realistic prehistoric Deinonychus antirrhopus, medium-sized dromaeosaurid theropod "
            "in anatomical neutral bipedal pose, prominent large sickle-shaped killing claw on second toe "
            "held raised off the ground, feathered body with wing-like forearms, long stiff tail balanced "
            "by ossified tendons, fierce hawk-like head with binocular vision, detailed feather plumage, "
            "anatomical accuracy, 8k textures, photorealistic"
        ),
        "negative": "low quality, cartoon, scaly raptor, missing sickle claw, no feathers, deformed, blurry, low poly",
    },
    38: {
        "id": "dimetrodon",
        "name_zh": "异齿龙",
        "prompt": (
            "A hyper-realistic prehistoric Dimetrodon grandis, Permian synapsid pelycosaur in anatomical "
            "neutral sprawling quadruped pose, enormous tall sail of elongated neural spines connected by "
            "skin membrane on its back, large skulled head with differentiated heterodont teeth including "
            "large canine-like teeth and smaller cutting teeth, lizard-like sprawling limb posture, "
            "detailed scaly reptilian skin, anatomical accuracy, 8k textures, photorealistic"
        ),
        "negative": "low quality, cartoon, dinosaur, no sail, deformed spine, upright posture, blurry, low poly",
    },
    39: {
        "id": "baryonyx",
        "name_zh": "重爪龙",
        "prompt": (
            "A hyper-realistic prehistoric Baryonyx walkeri, spinosaurid theropod dinosaur standing in "
            "anatomical neutral semi-bipedal pose, elongated low flat crocodilian-like snout with conical "
            "teeth and terminal rosette, massive hooked thumb claw on forelimb, robust forelimbs, low "
            "body profile with long neck, detailed scaly skin texture, anatomical accuracy, 8k textures, photorealistic"
        ),
        "negative": "low quality, cartoon, regular theropod snout, missing thumb claw, deformed, blurry, low poly",
    },
    40: {
        "id": "edmontosaurus",
        "name_zh": "埃德蒙顿龙",
        "prompt": (
            "A hyper-realistic prehistoric Edmontosaurus regalis, large hadrosaurid dinosaur in anatomical "
            "neutral quadruped pose, broad flat duck-billed snout without a crest, massive battery of "
            "hundreds of grinding teeth, fleshy soft-tissue frill or comb on head based on mummy specimens, "
            "robust muscular body, detailed scaled skin with skin impressions showing pebbly texture, "
            "anatomical accuracy, 8k textures, photorealistic"
        ),
        "negative": "low quality, cartoon, head crest, deformed bill, blurry, low poly, stylized",
    },
    41: {
        "id": "ankylosaurus",
        "name_zh": "甲龙",
        "prompt": (
            "A hyper-realistic prehistoric Ankylosaurus magniventris, massive armored ankylosaur in anatomical "
            "neutral quadruped pose, entire dorsal surface covered with thick osteoderms and bony scutes, "
            "rows of spikes along flanks, large bony tail club, wide low-slung body, small beaked head with "
            "small teeth, four sturdy pillar-like legs, detailed armored skin texture, anatomical accuracy, "
            "8k textures, photorealistic"
        ),
        "negative": "low quality, cartoon, no armor, deformed tail club, blurry, low poly, stylized",
    },
    42: {
        "id": "diplodocus",
        "name_zh": "梁龙",
        "prompt": (
            "A hyper-realistic prehistoric Diplodocus carnegii, enormous long-necked diplodocid sauropod "
            "in anatomical neutral quadruped pose, extremely long horizontal neck and equally long tapering "
            "whip-like tail used for defense, relatively small head with peg-like teeth only at front of "
            "jaws, slender gracile body compared to brachiosaurid sauropods, pillar-like legs, detailed "
            "wrinkled skin with possible keratinous dorsal spines, anatomical accuracy, 8k textures, photorealistic"
        ),
        "negative": "low quality, cartoon, short neck, deformed tail, blurry, low poly, stylized",
    },
    43: {
        "id": "microraptor",
        "name_zh": "小盗龙",
        "prompt": (
            "A hyper-realistic prehistoric Microraptor gui, tiny four-winged dromaeosaurid dinosaur in "
            "anatomical neutral perched or gliding pose, fully feathered body with iridescent black plumage, "
            "flight feathers on both forelimbs and hindlimbs forming four wings, long feathered tail with "
            "diamond-shaped terminal fan, small sharp-toothed jaws, anatomical accuracy, 8k textures, photorealistic"
        ),
        "negative": "low quality, cartoon, no feathers, two wings only, deformed, blurry, low poly",
    },
    44: {
        "id": "glyptodon",
        "name_zh": "雕齿兽",
        "prompt": (
            "A hyper-realistic prehistoric Glyptodon clavipes, giant Pleistocene armadillo-like glyptodont "
            "in anatomical neutral quadruped pose, enormous domed bony carapace shell made of interlocking "
            "hexagonal osteoderms, separate armored head cap shield, armored tail with terminal club or ring "
            "bands, small beaked head, four sturdy legs, rough tessellated shell surface texture, anatomical "
            "accuracy, 8k textures, photorealistic"
        ),
        "negative": "low quality, cartoon, modern armadillo, no shell, deformed, blurry, low poly",
    },
    45: {
        "id": "acrocanthosaurus",
        "name_zh": "高棘龙",
        "prompt": (
            "A hyper-realistic prehistoric Acrocanthosaurus atokensis, giant carcharodontosaurid theropod "
            "in anatomical neutral bipedal pose, distinctive tall neural spines along back forming a low "
            "muscular ridge or hump, massive skull with sharp serrated blade-like teeth, large three-fingered "
            "forelimbs, robust muscular hindlimbs, detailed scaly skin texture, anatomical accuracy, "
            "8k textures, photorealistic"
        ),
        "negative": "low quality, cartoon, T-rex proportions, no spines, deformed, blurry, low poly",
    },
    46: {
        "id": "carcharodontosaurus",
        "name_zh": "鲨齿龙",
        "prompt": (
            "A hyper-realistic prehistoric Carcharodontosaurus saharicus, massive carcharodontosaurid "
            "theropod in anatomical neutral bipedal pose, enormous skull with highly serrated shark-like "
            "blade teeth, powerful muscular three-fingered forelimbs, robust barrel-like chest, massive "
            "pillar-like hindlimbs, long counterbalancing tail, detailed scaly skin texture, anatomical "
            "accuracy, 8k textures, photorealistic"
        ),
        "negative": "low quality, cartoon, T-rex clone, deformed skull, blurry, low poly",
    },
    47: {
        "id": "herrerasaurus",
        "name_zh": "埃雷拉龙",
        "prompt": (
            "A hyper-realistic prehistoric Herrerasaurus ischigualastensis, early Triassic predatory dinosaur "
            "in anatomical neutral bipedal pose, primitive saurischian anatomy, relatively small slender body, "
            "long skull with serrated recurved teeth, three-fingered grasping forelimbs with large claws, "
            "five-toed feet with three functional toes, long balancing tail, detailed fine-scaled skin, "
            "anatomical accuracy, 8k textures, photorealistic"
        ),
        "negative": "low quality, cartoon, large size, deformed limbs, blurry, low poly",
    },
    48: {
        "id": "argentinosaurus",
        "name_zh": "阿根廷龙",
        "prompt": (
            "A hyper-realistic prehistoric Argentinosaurus huinculensis, titanosaur sauropod dinosaur of "
            "enormous scale in anatomical neutral quadruped pose, massive wide-gauge body with broad hips "
            "and deep chest, long neck with relatively small head, robust column-like limbs with rounded "
            "feet, long tapering tail, detailed wrinkled and pebbly skin texture suggesting massive weight, "
            "anatomical accuracy, 8k textures, photorealistic"
        ),
        "negative": "low quality, cartoon, short neck, deformed, blurry, low poly",
    },
    49: {
        "id": "anhanguera",
        "name_zh": "安汉格拉翼龙",
        "prompt": (
            "A hyper-realistic prehistoric Anhanguera santanae, ornithocheirid pterosaur in neutral standing "
            "or perched pose, distinctive rounded bony crest at tip of upper and lower jaw, long narrow "
            "jaws with conical fang-like teeth, large wing membranes with pteroid bone, furry pycnofiber "
            "covered body, large eyes with scleral rings, four-limbed stance on wing fingers and hind feet, "
            "anatomical accuracy, 8k textures, photorealistic"
        ),
        "negative": "low quality, cartoon, dragon, feathered wings, bat wings, no crest, deformed beak, blurry, low poly",
    },
    50: {
        "id": "ophthalmosaurus",
        "name_zh": "眼龙 / 大眼鱼龙",
        "prompt": (
            "A hyper-realistic prehistoric Ophthalmosaurus icenicus, ophthalmosaurid ichthyosaur in neutral "
            "swimming pose, distinctive enormous circular eyes adapted for deep-sea vision, highly streamlined "
            "dolphin-like body, prominent dorsal fin, crescent-shaped hypocercal tail fin, two pairs of "
            "paddle-like flippers, smooth scaleless skin with subtle counter-shading, anatomical accuracy, "
            "8k textures, photorealistic"
        ),
        "negative": "low quality, cartoon, dolphin, fish, deformed flippers, small eyes, blurry, low poly",
    },
}


def run_batch(start_idx: int = 27, end_idx: int = 50, force: bool = False):
    pipeline_dir = Path(__file__).resolve().parent
    client = MeshyPipelineClient(base_url="https://api.meshy.ai")

    print("=" * 70)
    print(f"[*] 启动史前动物批量生成管线 (序号 {start_idx} ~ {end_idx})")
    print("=" * 70)

    for idx in range(start_idx, end_idx + 1):
        if idx not in ANIMALS_SPEC:
            continue
        spec = ANIMALS_SPEC[idx]
        animal_id = spec["id"]
        animal_zh = spec["name_zh"]

        animal_root = pipeline_dir / "assets" / "animals" / animal_id
        raw_dir = animal_root / "01_meshy_raw"
        glb_file = raw_dir / "meshy_raw_model.glb"

        print(f"\n[{idx}/50] 准备处理: {animal_id} ({animal_zh})")

        # Check if already generated
        if glb_file.exists() and not force:
            print(f"    [SKIP] 该动物模型已存在: {glb_file}，跳过生成 (使用 --force 强制覆盖)")
            continue

        # Initialize folders
        client.init_animal_pipeline(pipeline_dir, animal_id)

        # Execute text2mesh
        print(f"    [PROMPT]: {spec['prompt']}")
        try:
            client.generate_text_to_3d(
                prompt=spec["prompt"],
                negative_prompt=spec["negative"],
                ai_model="meshy-6",
                output_raw_dir=raw_dir,
            )
            print(f"    [✓] {animal_id} ({animal_zh}) 生成并下载完成！")
        except Exception as e:
            print(f"    [✗] {animal_id} 生成失败: {e}", file=sys.stderr)
            # Brief pause before next
            time.sleep(5)
            continue

        # Polite delay between tasks to avoid rapid API bursts
        time.sleep(3)

    print("\n" + "=" * 70)
    print("[✓] 批量生成任务处理完毕！")
    print("=" * 70)


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="批量生成史前动物 27-50 (Meshy-6 PBR 高质量)")
    parser.add_argument("--start", type=int, default=27, help="起始序号 (默认 27)")
    parser.add_argument("--end", type=int, default=50, help="结束序号 (默认 50)")
    parser.add_argument("--force", action="store_true", help="强制重新生成已存在的模型")
    args = parser.parse_args()

    run_batch(args.start, args.end, args.force)
