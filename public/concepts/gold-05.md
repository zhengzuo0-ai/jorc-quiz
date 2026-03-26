# 物探·化探·遥感方法原理 Geophysics, Geochemistry & Remote Sensing

*参考资料: [Farmonaut - Geophysical Methods for Gold Exploration](https://farmonaut.com/mining/geophysical-methods-for-gold-exploration-top-5-techniques), [AGI - Introduction to IP Surveying](https://www.agiusa.com/introduction-to-induced-polarization-surveying), [Rangefront - IP Studies](https://rangefront.com/blog/induced-polarization-studies/)*

## 物探方法 Geophysical Methods

物探 (地球物理勘探) 通过测量岩石和矿物的**物理性质差异**来寻找地下矿体。

> **关键认知**: 物探**不能直接探测到金**（因为金的品位太低，即使10 g/t的高品位矿石也只含百万分之十的金）。但金常常与硫化物矿物（黄铁矿、毒砂）伴生，而这些矿物具有可探测的物理性质。所以物探是**间接找金**。

### 磁法勘探 Magnetic Survey

#### 原理 Principle
- 地球是一个大磁体，产生**地磁场 (geomagnetic field)**
- 不同岩石和矿物具有不同的**磁化率 (magnetic susceptibility)**
- 含磁性矿物 (磁铁矿 magnetite) 的岩石会造成局部**磁异常 (magnetic anomaly)**

#### 物理基础
| 参数 Parameter | 说明 |
|---|---|
| 磁化率 Susceptibility (κ) | 岩石被磁化的能力，无量纲 |
| 磁场强度 | 单位: nT (纳特斯拉) |
| 地磁场强度 | 约 25,000-65,000 nT |
| 可检测异常 | 几十到几千 nT |

**不同岩石的磁化率 (SI × 10⁻³):**
- 磁铁矿 Magnetite: 1,000-5,700
- 玄武岩 Basalt: 0.2-175
- 花岗岩 Granite: 0-50
- 砂岩 Sandstone: 0-20
- 石灰岩 Limestone: 0-3

#### 在金矿勘探中的应用
- **识别含磁铁矿蚀变带**: 某些金矿化伴生磁铁矿化
- **磁铁矿破坏带 (Magnetic Depletion)**: 热液蚀变破坏了原有磁铁矿，形成低磁异常 → **反向找矿标志**
- **构造解释**: 断裂带通常表现为磁场的线性不连续
- **BIF定位**: 条带状含铁建造是强磁体

### 电法勘探 Electrical Methods

#### 激发极化法 Induced Polarization (IP)

**原理:**
1. 向地下注入直流电 (或低频交流电)
2. 电流通过含导电矿物 (硫化物) 的岩石时
3. 矿物颗粒界面产生**电荷积累 (chargeability)**
4. 断电后观测电压衰减过程
5. 衰减越慢 = 硫化物含量越高

**测量参数:**
- **充电率 Chargeability (M)**: 单位 ms 或 mV/V
- **视电阻率 Apparent Resistivity (ρₐ)**: 单位 Ω·m

**为什么IP对金矿特别有效？**
- 金常与硫化物 (黄铁矿 pyrite、毒砂 arsenopyrite) 伴生
- 硫化物产生强IP异常
- "**黄铁矿是金矿最好的朋友**" — IP异常 = 潜在金矿化

#### 电阻率法 Resistivity

**原理:**
不同岩石和矿物导电能力不同:
- 硫化物矿体: **低电阻率** (10-100 Ω·m)
- 蚀变带: **中-低电阻率** (100-1,000 Ω·m)
- 新鲜围岩: **高电阻率** (1,000-100,000 Ω·m)
- 石英脉: **极高电阻率** (>10,000 Ω·m)

### 电磁法 Electromagnetic (EM) Methods

#### 原理 Principle
- 发射线圈产生**交变电磁场 (primary field)**
- 地下导体受电磁场激励产生**感应电流 (eddy currents)**
- 感应电流产生**二次场 (secondary field)**
- 接收线圈测量二次场的强度和相位

#### 方法类型
| 方法 | 特点 | 探测深度 |
|---|---|---|
| 地面EM (Ground EM) | 高分辨率 | 50-300m |
| 航空EM (Airborne EM, AEM) | 覆盖面广 | 100-500m |
| 大地电磁 (MT/AMT) | 利用天然场源 | 1-30 km |
| 瞬变电磁 (TEM) | 脉冲式，抗干扰好 | 50-500m |

### 重力测量 Gravity Survey

**原理:** 测量地球引力场的微小变化 (0.01 mGal精度)

- 高密度矿体 (硫化物) → **正重力异常**
- 低密度岩体 (花岗岩) → **负重力异常**
- 断裂带 → **重力梯度变化**

**在金矿勘探中的作用:**
- 识别侵入岩体 (斑岩型金矿的母岩)
- 确定基底构造格架
- 辅助解释其他物探资料

## 化探方法 Geochemical Methods

### 基本原理 Fundamental Principle

矿体经风化作用释放的元素沿地表水系和土壤扩散，形成**地球化学异常 (geochemical anomaly)**。

```
矿体 → 风化/侵蚀 → 元素释放 → 介质中富集 → 异常
Ore body → Weathering → Element release → Enrichment in media → Anomaly
```

### 采样介质类型 Sampling Media

| 介质 Medium | 采样密度 | 适用阶段 | 优势 |
|---|---|---|---|
| 水系沉积物 Stream Sediment | 1-2 样/km² | 区域踏勘 | 覆盖面广 |
| 土壤 Soil | 10-100 样/km² | 普查-详查 | 异常清晰 |
| 岩石 Rock (Litho) | 可变 | 详查-勘探 | 直接指示 |
| 地下水 Groundwater | 可变 | 特殊环境 | 覆盖区有效 |
| 气体 Gas (Soil Gas) | 10-50 样/km² | 覆盖区 | 穿透覆盖层 |
| 生物 Biogeochemistry | 可变 | 特殊环境 | 深根植物取样 |

### 金的地球化学特征

**金的指示元素 (Pathfinder Elements):**

| 元素 | 化学符号 | 在金矿中的意义 | 检测灵敏度 |
|---|---|---|---|
| 砷 | As | **最重要指示元素** — 毒砂中伴生 | 高 |
| 锑 | Sb | 浅成热液型金矿指示 | 高 |
| 汞 | Hg | 浅表矿化指示，气态迁移远 | 很高 |
| 铋 | Bi | 高温矿化，造山型 | 中 |
| 碲 | Te | 碲化物型金矿 | 中 |
| 钨 | W | 造山型金矿 | 中 |
| 银 | Ag | 浅成热液型 (高Ag/Au比) | 高 |
| 铜 | Cu | 斑岩型含金矿床 | 高 |

### 数据处理与异常圈定

**异常阈值确定方法:**
1. 均值+2倍标准差 (Mean + 2σ)
2. 累计频率法 — 85%分位数
3. 中位数绝对偏差法 (MAD)
4. 分形/多重分形方法

**多元素组合分析:**
- 主成分分析 PCA
- 因子分析 Factor Analysis
- 聚类分析 Cluster Analysis
- 这些方法能识别**元素组合异常**，比单元素更可靠

## 遥感方法 Remote Sensing Methods

### 原理 Principle
利用不同物质对**电磁波的反射、吸收和辐射特征**进行识别。

### 电磁波谱与矿物识别

| 波段 Band | 波长 | 可识别目标 | 应用 |
|---|---|---|---|
| 可见光 VIS | 0.4-0.7 μm | 铁氧化物 (褐铁矿、赤铁矿) | 铁帽识别 |
| 近红外 NIR | 0.7-1.3 μm | 植被、铁氧化物 | 植被应力 |
| 短波红外 SWIR | 1.3-2.5 μm | 羟基矿物 (绢云母、高岭石) | **蚀变填图关键** |
| 热红外 TIR | 8-14 μm | 硅酸盐、碳酸盐 | 硅化带识别 |
| 微波 SAR | cm-m | 地形、构造 | 全天候，穿透植被 |

### 关键卫星数据源 Key Satellite Data

| 卫星 Satellite | 波段数 | 分辨率 | 特点 |
|---|---|---|---|
| Landsat 8/9 | 11 | 30m | 免费，全球覆盖 |
| Sentinel-2 | 13 | 10-60m | 免费，5天重访 |
| ASTER | 14 | 15-90m | SWIR+TIR组合最佳 |
| WorldView-3 | 29 | 1.24m | 商业高分辨率 |
| Hyperion | 242 | 30m | 高光谱 (已退役) |

### 蚀变矿物遥感识别 Alteration Mineral Mapping

#### ASTER 蚀变填图方法
- **铁氧化物**: Band 2/Band 1 比值
- **羟基蚀变 (OH)**: Band 6/Band 7 比值 → 识别绢云母、高岭石
- **碳酸盐**: Band 8/Band 7 比值
- **硅化**: Band 11/Band 10 比值

#### 高光谱矿物识别
- 200+ 窄波段可精确区分:
  - 绢云母 (Sericite/Muscovite): 2.2 μm 吸收
  - 高岭石 (Kaolinite): 2.16 + 2.21 μm 双吸收
  - 明矾石 (Alunite): 2.17 μm 吸收
  - 绿泥石 (Chlorite): 2.32-2.35 μm 吸收

### 综合应用模式 Integrated Approach

```
第一步: 遥感 → 识别蚀变带和构造 (面)
第二步: 物探 → 磁法/IP测量异常区 (面/线)
第三步: 化探 → 土壤/岩石取样验证 (线/点)
第四步: 钻探 → 直接验证矿化 (点)
```

> **记忆口诀**: 遥感看面、物探测体、化探追踪、钻探验证
> **English**: Remote sensing sees the surface, geophysics measures the body, geochemistry traces the path, drilling confirms the deposit

---

*学习建议: 物探理解"物理性质差异"，化探理解"元素迁移富集"，遥感理解"光谱特征"。三者结合使用效果最佳。*
