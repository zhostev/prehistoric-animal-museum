#!/usr/bin/env python3
"""Meshy 3D API Client & Asset Pipeline Automation.

Integrates Meshy AI into industrial-grade 3D animal production pipeline.
Supports:
  - Project directory scaffolding (00_references to 07_delivery_ue5)
  - Text-to-3D (v2 Preview -> Refine two-step generation)
  - Image-to-3D (Local file or remote URL)
  - Automatic download and organization of 3D assets (GLB, OBJ, FBX, textures)
"""

import argparse
import base64
import json
import mimetypes
import os
import sys
import time
from pathlib import Path
from typing import Any, Dict, Optional
import requests

DEFAULT_BASE_URL = "https://api.meshy.ai"
POLL_INTERVAL_SECONDS = 5
MAX_WAIT_TIME_SECONDS = 900  # 15 minutes timeout

PIPELINE_DIRECTORIES = [
    "00_references/anatomy",
    "00_references/orthographic",
    "00_references/dynamic_locomotion",
    "01_meshy_raw/textures_raw",
    "02_zbrush_sculpt/exports",
    "03_topology_uv/uv_layout",
    "04_textures_udim/maps_8k_udim",
    "05_grooming_fur/curves",
    "05_grooming_fur/houdini",
    "05_grooming_fur/ue_groom",
    "06_rigging_muscle/skeleton",
    "06_rigging_muscle/muscle_sim",
    "06_rigging_muscle/skin_weights",
    "07_delivery_ue5",
]


class MeshyPipelineClient:
    def __init__(self, api_key: Optional[str] = None, base_url: str = DEFAULT_BASE_URL):
        self.api_key = api_key or os.environ.get("MESHY_API_KEY", "").strip()
        if not self.api_key:
            # Check .env file in the same dir or current dir
            env_path = Path(".env")
            if not env_path.exists():
                env_path = Path(__file__).resolve().parent / ".env"
            if env_path.exists():
                for line in env_path.read_text(encoding="utf-8").splitlines():
                    if line.strip().startswith("MESHY_API_KEY="):
                        self.api_key = line.split("=", 1)[1].strip().strip('"\'')
                        break

        self.base_url = base_url.rstrip("/")
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

    def _validate_auth(self) -> None:
        if not self.api_key:
            raise ValueError(
                "MESHY_API_KEY 未找到。请通过命令行参数 --api-key、环境变量 MESHY_API_KEY 或 .env 文件进行配置。"
            )

    def init_animal_pipeline(self, base_dir: Path, animal_name: str) -> Path:
        """Create standard pipeline folders for an animal project."""
        animal_root = base_dir / "assets" / "animals" / animal_name
        for sub in PIPELINE_DIRECTORIES:
            target = animal_root / sub
            target.mkdir(parents=True, exist_ok=True)
            # Create a placeholder .gitkeep
            (target / ".gitkeep").touch(exist_ok=True)

        readme_file = animal_root / "README.md"
        if not readme_file.exists():
            readme_file.write_text(
                f"# 动物工程资产: {animal_name}\n\n"
                f"创建时间: {time.strftime('%Y-%m-%d %H:%M:%S')}\n\n"
                "各阶段说明：\n"
                "- `00_references`: 解剖、正侧无透视参考照片\n"
                "- `01_meshy_raw`: Meshy AI 直出网格与贴图 (Base Mesh)\n"
                "- `02_zbrush_sculpt`: ZBrush 解剖重塑与微观置换雕刻\n"
                "- `03_topology_uv`: 动画四足拓扑与 UDIM 展开\n"
                "- `04_textures_udim`: 8K UDIM PBR+SSS 贴图\n"
                "- `05_grooming_fur`: 发丝级毛发 Grooming 导向线与 Houdini/UE 工程\n"
                "- `06_rigging_muscle`: 四足骨骼、IK/FK 切换与肌肉组织仿真\n"
                "- `07_delivery_ue5`: UE5 最终资产包 (Skeletal Mesh, Groom, Materials)\n",
                encoding="utf-8",
            )
        print(f"[✓] 已成功初始化管线工程目录: {animal_root}")
        return animal_root

    def _poll_task(self, task_type: str, task_id: str, desc: str = "任务生成中") -> Dict[str, Any]:
        """Poll task until completion with live progress report."""
        url = f"{self.base_url}/openapi/v1/{task_type}/{task_id}"
        if task_type == "text-to-3d":
            url = f"{self.base_url}/openapi/v2/text-to-3d/{task_id}"

        start_time = time.time()
        print(f"[*] 开始轮询任务 [{task_id}] ({desc})...")

        while True:
            elapsed = int(time.time() - start_time)
            if elapsed > MAX_WAIT_TIME_SECONDS:
                raise TimeoutError(f"任务 {task_id} 执行超时 (>{MAX_WAIT_TIME_SECONDS}秒)")

            resp = requests.get(url, headers=self.headers, timeout=30)
            if resp.status_code != 200:
                raise RuntimeError(f"查询任务状态失败: HTTP {resp.status_code} - {resp.text}")

            data = resp.json()
            status = data.get("status")
            progress = data.get("progress", 0)

            print(f"    [{desc}] 状态: {status} | 进度: {progress}% | 耗时: {elapsed}s", end="\r")

            if status == "SUCCEEDED":
                print(f"\n[✓] 任务 {task_id} 已成功完成！")
                return data
            elif status in ("FAILED", "EXPIRED"):
                print()
                err_msg = data.get("task_error", {}).get("message", "未知错误")
                raise RuntimeError(f"任务 {task_id} 失败: {status} - {err_msg}")

            time.sleep(POLL_INTERVAL_SECONDS)

    def download_file(self, url: str, dest_path: Path) -> None:
        """Download remote asset file to local path."""
        print(f"    -> 正在下载: {dest_path.name} ...")
        resp = requests.get(url, stream=True, timeout=60)
        resp.raise_for_status()
        dest_path.parent.mkdir(parents=True, exist_ok=True)
        with open(dest_path, "wb") as f:
            for chunk in resp.iter_content(chunk_size=65536):
                if chunk:
                    f.write(chunk)

    def save_assets(self, task_data: Dict[str, Any], output_dir: Path, meta_name: str = "generation_meta.json") -> None:
        """Download all model variants and textures into 01_meshy_raw."""
        output_dir.mkdir(parents=True, exist_ok=True)
        textures_dir = output_dir / "textures_raw"
        textures_dir.mkdir(parents=True, exist_ok=True)

        model_urls = task_data.get("model_urls", {})
        for fmt, url in model_urls.items():
            if url:
                ext = fmt.lower()
                dest = output_dir / f"meshy_raw_model.{ext}"
                try:
                    self.download_file(url, dest)
                except Exception as e:
                    print(f"    [!] 下载模型 {fmt} 失败: {e}")

        texture_urls = task_data.get("texture_urls", [])
        if isinstance(texture_urls, list):
            for item in texture_urls:
                if isinstance(item, dict):
                    for tex_type, url in item.items():
                        if url:
                            ext = url.split("?")[0].split(".")[-1]
                            if len(ext) > 4 or not ext:
                                ext = "png"
                            dest = textures_dir / f"{tex_type}.{ext}"
                            try:
                                self.download_file(url, dest)
                            except Exception as e:
                                print(f"    [!] 下载贴图 {tex_type} 失败: {e}")

        # Save metadata
        meta_file = output_dir / meta_name
        with open(meta_file, "w", encoding="utf-8") as f:
            json.dump(task_data, f, indent=2, ensure_ascii=False)
        print(f"[✓] 元数据与模型资产已完整归档至: {output_dir}")

    def generate_text_to_3d(
        self,
        prompt: str,
        negative_prompt: str = "low quality, deformed limbs, blurry, distorted, cartoonish",
        art_style: str = "realistic",
        ai_model: str = "meshy-6",
        output_raw_dir: Optional[Path] = None,
    ) -> Dict[str, Any]:
        """Execute complete Text-to-3D pipeline: Preview -> Refine."""
        self._validate_auth()

        # Step 1: Preview
        print(f"[*] [阶段 1/2] 提交 Text-to-3D 预览阶段任务 (Mesh 生成)...")
        preview_payload = {
            "mode": "preview",
            "prompt": prompt,
            "negative_prompt": negative_prompt,
            "art_style": art_style,
            "ai_model": ai_model,
        }
        res = requests.post(
            f"{self.base_url}/openapi/v2/text-to-3d",
            headers=self.headers,
            json=preview_payload,
            timeout=30,
        )
        if res.status_code not in (200, 201, 202):
            raise RuntimeError(f"预览任务提交失败: HTTP {res.status_code} - {res.text}")

        preview_task_id = res.json().get("result")
        preview_data = self._poll_task("text-to-3d", preview_task_id, desc="预览几何体生成")

        # Step 2: Refine
        print(f"[*] [阶段 2/2] 提交 Text-to-3D 精细化阶段任务 (PBR 材质与细节)...")
        refine_payload = {
            "mode": "refine",
            "preview_task_id": preview_task_id,
            "enable_pbr": True,
        }
        res_refine = requests.post(
            f"{self.base_url}/openapi/v2/text-to-3d",
            headers=self.headers,
            json=refine_payload,
            timeout=30,
        )
        if res_refine.status_code not in (200, 201, 202):
            raise RuntimeError(f"精细化任务提交失败: HTTP {res_refine.status_code} - {res_refine.text}")

        refine_task_id = res_refine.json().get("result")
        refine_data = self._poll_task("text-to-3d", refine_task_id, desc="材质与精细化烘焙")

        if output_raw_dir:
            self.save_assets(refine_data, output_raw_dir)

        return refine_data

    def generate_image_to_3d(
        self,
        image_path_or_url: str,
        enable_pbr: bool = True,
        output_raw_dir: Optional[Path] = None,
    ) -> Dict[str, Any]:
        """Execute Image-to-3D pipeline."""
        self._validate_auth()

        # Check if local image
        if os.path.exists(image_path_or_url):
            mime, _ = mimetypes.guess_type(image_path_or_url)
            if not mime:
                mime = "image/png"
            with open(image_path_or_url, "rb") as f:
                b64_data = base64.b64encode(f.read()).decode("utf-8")
            image_url = f"data:{mime};base64,{b64_data}"
            print(f"[*] 成功编码本地图像文件: {image_path_or_url}")
        else:
            image_url = image_path_or_url

        payload = {
            "image_url": image_url,
            "enable_pbr": enable_pbr,
        }

        print(f"[*] 提交 Image-to-3D 任务...")
        res = requests.post(
            f"{self.base_url}/openapi/v1/image-to-3d",
            headers=self.headers,
            json=payload,
            timeout=30,
        )
        if res.status_code not in (200, 201, 202):
            raise RuntimeError(f"Image-to-3D 提交失败: HTTP {res.status_code} - {res.text}")

        task_id = res.json().get("result")
        task_data = self._poll_task("image-to-3d", task_id, desc="单图生成 3D 资产")

        if output_raw_dir:
            self.save_assets(task_data, output_raw_dir)

        return task_data


def main():
    parser = argparse.ArgumentParser(
        description="Meshy 3D 工业级动物建模集成客户端与管线脚手架工具"
    )
    parser.add_argument("--api-key", help="Meshy API Key (若未指定则读取 MESHY_API_KEY 环境变量或 .env)")
    parser.add_argument("--base-dir", default="./", help="项目根目录 (默认当前目录)")

    subparsers = parser.add_subparsers(dest="command", required=True)

    # init
    p_init = subparsers.add_parser("init", help="初始化动物工程资产目录结构 (00~07阶段)")
    p_init.add_argument("animal_name", help="动物英文标识名，如 siberian_tiger_01")

    # text2mesh
    p_text = subparsers.add_parser("text2mesh", help="执行 Text-to-3D 并自动下载归档")
    p_text.add_argument("animal_name", help="动物英文标识名")
    p_text.add_argument("--prompt", required=True, help="动物详细 Prompt 描述")
    p_text.add_argument("--negative", default="low quality, distorted, extra limbs, cartoon", help="负面提示词")
    p_text.add_argument("--model", default="meshy-6", help="Meshy 模型架构版本 (如 meshy-6)")

    # img2mesh
    p_img = subparsers.add_parser("img2mesh", help="执行 Image-to-3D 并自动下载归档")
    p_img.add_argument("animal_name", help="动物英文标识名")
    p_img.add_argument("--image", required=True, help="参考图本地路径或网络 URL")

    args = parser.parse_args()
    client = MeshyPipelineClient(api_key=args.api_key)
    base_dir = Path(args.base_dir).resolve()

    if args.command == "init":
        client.init_animal_pipeline(base_dir, args.animal_name)

    elif args.command == "text2mesh":
        animal_root = client.init_animal_pipeline(base_dir, args.animal_name)
        raw_dir = animal_root / "01_meshy_raw"
        print(f"[*] 启动动物 [{args.animal_name}] 的 Text-to-3D 工业管线...")
        client.generate_text_to_3d(
            prompt=args.prompt,
            negative_prompt=args.negative,
            ai_model=args.model,
            output_raw_dir=raw_dir,
        )
        print(f"[✓] 资产生成与下载全部完成！请导入 ZBrush (02_zbrush_sculpt) 开展解剖雕刻。")

    elif args.command == "img2mesh":
        animal_root = client.init_animal_pipeline(base_dir, args.animal_name)
        raw_dir = animal_root / "01_meshy_raw"
        print(f"[*] 启动动物 [{args.animal_name}] 的 Image-to-3D 工业管线...")
        client.generate_image_to_3d(
            image_path_or_url=args.image,
            output_raw_dir=raw_dir,
        )
        print(f"[✓] 资产生成与下载全部完成！请导入 ZBrush (02_zbrush_sculpt) 开展解剖雕刻。")


if __name__ == "__main__":
    main()
