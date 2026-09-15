#!/usr/bin/env python3
"""Batch 3D Generation Pipeline for Animals 19-26.

Prehistoric Animal Museum (19 to 26):
  19: velociraptor   (伶盗龙 / 迅猛龙)
  20: parasaurolophus (副栉龙)
  21: dunkleosteus   (邓氏鱼)
  22: ammonite       (菊石)
  23: jaekelopterus  (莱茵耶克尔鲎)
  24: smilodon       (剑齿虎)
  25: spinosaurus    (棘龙)
  26: corythosaurus  (盔龙)
"""

import os
import sys
import time
from pathlib import Path
from meshy_client import MeshyPipelineClient

ANIMALS_SPEC = {
    19: {
        "id": "velociraptor",
        "name_zh": "伶盗龙 / 迅猛龙",
        "prompt": (
            "A hyper-realistic prehistoric Velociraptor mongoliensis, feathered dromaeosaurid "
            "dinosaur standing in anatomical neutral bipedal pose, prominent curved sickle claw on "
            "second toe of each hind foot, winged feathered forelimbs, stiffened long tail, "
            "bird-like predatory head, realistic plumage patterns, anatomical accuracy, 8k textures, photorealistic"
        ),
        "negative": "low quality, cartoon, jurassic park scaly raptor, broken hands, deformed sickle claw, extra limbs, low poly, blurry",
    },
    20: {
        "id": "parasaurolophus",
        "name_zh": "副栉龙",
        "prompt": (
            "A hyper-realistic prehistoric Parasaurolophus walkeri, hadrosaurid dinosaur standing "
            "in anatomical neutral quadruped pose, iconic long curved backward tubular cranial crest, "
            "duck-billed snout, detailed pebbled dinosaur skin texture, muscular hindquarters, "
            "anatomical accuracy, 8k textures, photorealistic"
        ),
        "negative": "low quality, cartoon, broken crest, deformed limbs, stylized, modern reptile, blurry, low poly",
    },
    21: {
        "id": "dunkleosteus",
        "name_zh": "邓氏鱼",
        "prompt": (
            "A hyper-realistic prehistoric Dunkleosteus terrelli, giant placoderm armored fish "
            "swimming in neutral pose, massive heavy dermal bone head shield, sharp self-sharpening "
            "gnathal dental shearing plates instead of teeth, torpedo-shaped body, heterocercal tail fin, "
            "realistic Devonian marine predator, 8k textures, photorealistic"
        ),
        "negative": "low quality, cartoon, human teeth, fantasy sea monster, deformed fins, blurry, low poly",
    },
    22: {
        "id": "ammonite",
        "name_zh": "菊石",
        "prompt": (
            "A hyper-realistic prehistoric Ammonite (Ammonoidea), planar spiral coiled shell with distinct "
            "ribbed septal sutures, living cephalopod tentacles and large intelligent eyes protruding from "
            "aperture, realistic marine mollusk, anatomical accuracy, underwater cinematic lighting, "
            "8k textures, photorealistic"
        ),
        "negative": "low quality, cartoon, snail, empty broken shell, deformed tentacles, blurry, low poly",
    },
    23: {
        "id": "jaekelopterus",
        "name_zh": "莱茵耶克尔鲎",
        "prompt": (
            "A hyper-realistic prehistoric Jaekelopterus rhenaniae, giant predatory eurypterid sea "
            "scorpion in neutral posture, large anterior chelicerae pincers with sharp denticles, "
            "segmented exoskeleton carapace, paddle swimming legs, telson tail spine, accurate Devonian "
            "arthropod anatomy, 8k textures, photorealistic"
        ),
        "negative": "low quality, cartoon, modern desert scorpion with curved stinger, deformed legs, blurry, low poly",
    },
    24: {
        "id": "smilodon",
        "name_zh": "剑齿虎",
        "prompt": (
            "A hyper-realistic prehistoric Smilodon fatalis, saber-toothed cat standing in anatomical "
            "neutral quadruped pose, massive muscular shoulders and forequarters, iconic elongated curved "
            "saber canines extending from upper jaw, paleolithic feline fur texture, short bobtail, "
            "anatomical accuracy, 8k resolution, photorealistic"
        ),
        "negative": "low quality, cartoon, stylized, distorted legs, deformed paws, modern housecat, blurry textures, low poly",
    },
    25: {
        "id": "spinosaurus",
        "name_zh": "棘龙",
        "prompt": (
            "A hyper-realistic prehistoric Spinosaurus aegyptianus, gigantic semi-aquatic theropod "
            "dinosaur in anatomical neutral pose, tall distinctive neural dorsal sail, elongated "
            "crocodile-like snout with conical teeth, robust forelimbs, paddle-like tail for swimming, "
            "rough scaled reptile skin, anatomical accuracy, 8k textures, photorealistic"
        ),
        "negative": "low quality, cartoon, tyrannosaurus head, missing sail, deformed limbs, blurry, low poly",
    },
    26: {
        "id": "corythosaurus",
        "name_zh": "盔龙 / 冠龙",
        "prompt": (
            "A hyper-realistic prehistoric Corythosaurus casuarius, hadrosaurid dinosaur standing in "
            "anatomical neutral quadruped pose, distinctive tall helmet-like semi-circular hollow bony "
            "crest on head, duck-billed beak, low dorsal spine ridge, detailed scaled dinosaur hide, "
            "anatomical accuracy, 8k textures, photorealistic"
        ),
        "negative": "low quality, cartoon, deformed helmet crest, extra legs, fantasy colors, blurry, low poly",
    },
}


def run_batch(start_idx: int = 19, end_idx: int = 26, force: bool = False):
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

        print(f"\n[{idx}/26] 准备处理: {animal_id} ({animal_zh})")

        # Check if already generated
        if glb_file.exists() and not force:
            print(f"    [SKIP] 该动物模型已存在: {glb_file}，跳过生成 (使用 --force 强制覆盖)")
            continue

        # Check if smilodon was generated as smilodon_sabertooth
        if animal_id == "smilodon" and (pipeline_dir / "assets" / "animals" / "smilodon_sabertooth" / "01_meshy_raw" / "meshy_raw_model.glb").exists() and not force:
            import shutil
            print(f"    [INFO] 发现已生成的 smilodon_sabertooth 资产，正在直接同步复用为 smilodon...")
            client.init_animal_pipeline(pipeline_dir, "smilodon")
            src_raw = pipeline_dir / "assets" / "animals" / "smilodon_sabertooth" / "01_meshy_raw"
            shutil.copytree(src_raw, raw_dir, dirs_exist_ok=True)
            print(f"    [✓] smilodon 同步成功！")
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
    parser = argparse.ArgumentParser(description="批量生成史前动物 19-26")
    parser.add_argument("--start", type=int, default=19, help="起始序号 (默认 19)")
    parser.add_argument("--end", type=int, default=26, help="结束序号 (默认 26)")
    parser.add_argument("--force", action="store_true", help="强制重新生成已存在的模型")
    args = parser.parse_args()

    run_batch(args.start, args.end, args.force)
