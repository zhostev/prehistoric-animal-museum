# Meshy 工业级动物 3D 建模管线集成套件

本项目实现了 **Meshy 3D AI 与工业级动物 3D 资产管线（AAA/影视级）的标准对接与工程脚手架**。

---

## 目录索引

- [管线工程与质量验收规范 (SOP)](file:///home/idea/code/prehistoric-animal-museum/meshy_animal_pipeline/PIPELINE_SPEC.md)
- [管线自动化工具与 Meshy 客户端](file:///home/idea/code/prehistoric-animal-museum/meshy_animal_pipeline/meshy_client.py)
- [管线技术参数配置文件](file:///home/idea/code/prehistoric-animal-museum/meshy_animal_pipeline/config.yaml)
- [环境变量配置示例](file:///home/idea/code/prehistoric-animal-museum/meshy_animal_pipeline/.env.example)

---

## 快速上手

### 1. 配置 Meshy API Key
你可以通过以下任一方式配置 API Key：

1. **创建 `.env` 文件（推荐）**：
   ```bash
   cp .env.example .env
   # 编辑 .env 文件，填入你的 MESHY_API_KEY
   ```
2. **设置环境变量**：
   ```bash
   export MESHY_API_KEY="msy_your_real_key"
   ```
3. **命令行直接传入**：在每次执行命令时追加 `--api-key <your_key>`。

---

### 2. 初始化动物资产工程目录

为指定动物生成符合工业标准的 `00` 到 `07` 阶段工程目录：

```bash
python3 meshy_client.py init siberian_tiger
```

生成后的目录结构：
```text
assets/animals/siberian_tiger/
├── 00_references/        # 解剖、正侧无透视参考照片
├── 01_meshy_raw/         # Meshy AI 直出网格与贴图 (Base Mesh)
├── 02_zbrush_sculpt/     # ZBrush 解剖重塑与千万面微观置换雕刻
├── 03_topology_uv/       # 动画级四足全四边面拓扑与 UDIM 展开
├── 04_textures_udim/     # 8K UDIM PBR + SSS 贴图
├── 05_grooming_fur/      # 发丝级毛发 Grooming 导向线与 Houdini/UE 工程
├── 06_rigging_muscle/    # 四足骨骼、IK/FK 切换与肌肉组织仿真
└── 07_delivery_ue5/      # UE5 / 影视级最终交付物
```

---

### 3. 调用 Meshy API 自动生成初胚并归档

#### 方式 A：文本生成（Text-to-3D 二阶段预览与精细化生成）
```bash
python3 meshy_client.py text2mesh siberian_tiger \
  --prompt "A hyper-realistic Siberian tiger standing in anatomical neutral pose, muscular anatomy, detailed fur pattern, 8k textures"
```
*该命令会自动：*
1. 初始化工程目录；
2. 提交 Preview 任务获取粗模网格；
3. 自动提交 Refine 任务进行高精几何体与 PBR 贴图烘焙；
4. 自动下载 `.glb`、`.fbx`、`.obj` 以及所有贴图并保存至 `01_meshy_raw/`。

#### 方式 B：单图/原画生成（Image-to-3D）
```bash
python3 meshy_client.py img2mesh snow_leopard \
  --image ./path_to_reference.png
```
*支持本地图片文件（自动完成 Base64 编码）或公开网络图片 URL。*

---

### 4. 下一步生产环节流转

模型下载到 `01_meshy_raw/` 后，即可无缝流转至专业 DCC 软件：
1. **导入 ZBrush**：将 `01_meshy_raw/meshy_raw_model.obj` 作为底模，对照 `00_references/anatomy/` 精雕肌肉骨骼。
2. **导入 TopoGun/Maya**：进行四足折叠关节手工拓扑，成果保存至 `03_topology_uv/`。
3. **导入 Substance/Mari**：烘焙置换贴图与 8K UDIM 贴图，保存至 `04_textures_udim/`。
4. **导入 Houdini / UE Groom**：梳理多层毛发，保存至 `05_grooming_fur/`。
5. **绑定与肌肉仿真**：设置四足反向动力学与肌肉膨胀，保存至 `06_rigging_muscle/`。
6. **UE5 / 渲染器验收**：整合成最终资产放入 `07_delivery_ue5/`。
