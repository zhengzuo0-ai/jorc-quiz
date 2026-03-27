# 矿产资源量 | Mineral Resources

> 💡 **资源量是根据地质证据对地下矿化体的吨位和品位估算，按置信度分为推断、标示和探明三个级别。**

## 核心概念 (Core Concepts)

### 三个资源量级别

矿产资源量 (Mineral Resource) 是对具有合理最终经济开采前景的矿化体的估算。JORC规范将资源量按地质置信度从低到高分为三个级别：

#### 推断矿产资源量 (Inferred Mineral Resource)

推断资源量基于**有限的地质证据和采样数据**，地质连续性可以合理推测但尚未得到验证。其特点包括：

- 地质置信度最低，不确定性最大
- 仅可用于**战略规划和概念性研究** (Scoping Study)
- **不能用于预可行性研究 (PFS) 或确定可行性研究 (DFS) 的储量转化基础**
- 不能直接转化为矿石储量 (Ore Reserve)
- 在报告中必须明确标注其高度不确定性
- 典型金矿钻探间距：**100-200米**（视矿床类型而定）

投资者须知：推断资源量的吨位和品位可能与最终结果有显著差异，不应过度依赖。

#### 标示矿产资源量 (Indicated Mineral Resource)

标示资源量基于**充足的勘探、采样和测试数据**，地质和品位连续性可以合理假定。其特点包括：

- 地质置信度中等，数据密度足以支持矿化体的合理推断
- 可用于**预可行性研究 (PFS)**
- 可通过应用修正因子 (Modifying Factors) 转化为**概略储量 (Probable Reserve)**
- 是项目推进到经济评估阶段的关键门槛
- 典型金矿钻探间距：**50-100米**

#### 探明矿产资源量 (Measured Mineral Resource)

探明资源量基于**详细和可靠的勘探、采样和测试数据**，地质和品位连续性已得到确认。其特点包括：

- 地质置信度最高
- 可用于**确定可行性研究 (DFS)**
- 可通过应用修正因子转化为**证实储量 (Proved Reserve)** 或**概略储量 (Probable Reserve)**
- 要求数据点之间的间距足够小，使得地质特征得到充分验证
- 典型金矿钻探间距：**25-50米**

### 品位估算方法 (Grade Estimation Methods)

资源量估算的核心是将离散的钻孔数据推断为连续的矿体模型。常用方法包括：

- **克里金法 (Kriging)**：地统计学方法，是行业黄金标准。利用变差函数 (Variogram) 分析数据的空间相关性，给出最优无偏估计，同时提供估计方差作为不确定性指标。包括普通克里金 (Ordinary Kriging) 和指示克里金 (Indicator Kriging) 等变体。
- **反距离加权法 (Inverse Distance Weighting, IDW)**：距离越近的样品权重越大。简单直观，但缺乏统计严谨性，可能产生"牛眼效应"。常用于数据密度不足以支持克里金法的情况。
- **最近邻法 (Nearest Neighbour, NN)**：将最近样品的品位直接赋予块体。最简单的方法，适用于初步估算或数据验证，但估算精度最低。
- **多元高斯模拟法 (Multiple Indicator / Gaussian Simulation)**：生成多个等概率的品位模型，用于风险评估和不确定性量化。计算成本高但信息量最大。

### 分类边界判断 (Classification Criteria)

将资源量划分为不同级别时，胜任人 (Competent Person) 需要综合考虑以下因素：

- **钻探间距 (Drill Spacing)**：最直观的指标，但不能机械套用
- **数据质量 (Data Quality)**：QA/QC结果、采样方法的可靠性
- **地质复杂性 (Geological Complexity)**：简单层状矿床允许更大间距，复杂脉状矿床需要更密集钻探
- **变差函数分析 (Variogram Analysis)**：通过数据的空间相关性距离来客观评判合理的分类范围
- **矿化连续性 (Mineralization Continuity)**：矿体在走向和倾向上的延续性是否得到验证

### 资源量报告格式

JORC规范要求资源量报告必须包含以下关键信息：

- **吨位 (Tonnage)** × **品位 (Grade)** = **含金属量 (Contained Metal)**
  - 例：标示资源量 10.5 Mt @ 2.3 g/t Au，含金量 776,000 oz
- 必须标明**分类级别** (Inferred / Indicated / Measured)
- 必须说明**切割品位 (Cut-off Grade)**，即纳入资源量的最低品位门槛
- 必须说明**上限品位处理 (Top-cut / High-grade capping)**：是否对异常高值进行了封顶处理
- 必须说明使用的**估算方法**和**块体模型参数**

### 合理的最终经济开采前景 (RPEEE)

RPEEE (Reasonable Prospects for Eventual Economic Extraction) 是资源量报告的**根本前提条件**。即使矿化体在地质上已被确认，如果不具备合理的最终经济开采前景，就不能报告为矿产资源量。评估RPEEE需要考虑：

- 矿体的深度、厚度和品位是否可能支持经济开采
- 合理的金属价格假设下是否有盈利可能
- 采矿和选矿方法是否在技术上可行
- 基础设施和物流的基本可行性
- 环境和法律许可的合理获取前景

RPEEE不要求编制详细的经济评估，但要求胜任人做出合理的专业判断。

## 关键术语表 (Key Terms)

| 中文 | English | 定义 |
|------|---------|------|
| 矿产资源量 | Mineral Resource | 对地下矿化体的吨位和品位的估算，具有合理的最终经济开采前景 |
| 推断资源量 | Inferred Resource | 基于有限数据的最低置信度资源量估算 |
| 标示资源量 | Indicated Resource | 基于充足数据的中等置信度资源量估算 |
| 探明资源量 | Measured Resource | 基于详细数据的最高置信度资源量估算 |
| 克里金法 | Kriging | 基于地统计学的最优品位估算方法 |
| 反距离加权 | Inverse Distance Weighting (IDW) | 按距离加权的品位插值方法 |
| 变差函数 | Variogram | 描述品位空间相关性的统计工具 |
| 切割品位 | Cut-off Grade | 纳入资源量计算的最低品位门槛 |
| 上限品位 | Top-cut / High-grade Cap | 对异常高品位值的封顶处理 |
| 块体模型 | Block Model | 将矿体离散化为三维块体进行品位估算的数字模型 |
| 胜任人 | Competent Person (CP) | 具备相关资质和经验、负责资源量报告的专业人士 |
| RPEEE | Reasonable Prospects for Eventual Economic Extraction | 资源量报告的前提——合理的最终经济开采前景 |

## PMH 实践关联 (PMH Context)

> PMH在西非和纳米比亚的金矿项目中，资源量级别直接决定了项目的推进节奏和融资能力：
>
> - **西非金矿勘探**：热带风化层 (laterite) 和基岩中的剪切带型金矿 (shear-zone hosted gold) 通常需要先通过RC钻建立推断资源量，再通过加密金刚石岩芯钻提升至标示/探明级别
> - **钻探间距的实际考量**：西非的地质条件（如品位变异性较高的石英脉型矿化）可能要求比一般指导值更密的钻探间距
> - **RPEEE在偏远地区的挑战**：西非部分地区基础设施薄弱，论证RPEEE时需要特别关注道路、电力和水源的可获得性
> - **资源量升级是融资里程碑**：从推断升级到标示是吸引机构投资者和启动PFS的先决条件

## 深入阅读 (Further Reading)

- JORC Code (2012), Clauses 20-34: Mineral Resource 报告要求
- AusIMM Mineral Resource Estimation Best Practice Guidelines
- Journel & Huijbregts, *Mining Geostatistics* — 克里金法经典教材
- Snowden, D.V., "Practical Interpretation of Mineral Resource and Ore Reserve Classification Guidelines"
- CIM Estimation of Mineral Resources Best Practices Guidelines (2019) — 与JORC兼容的加拿大指南

## 自测要点 (Self-Check)

- 推断资源量 (Inferred) 为什么不能用于可行性研究中的储量转化？其不确定性意味着什么？
- 克里金法 (Kriging) 相较于反距离加权法 (IDW) 的核心优势是什么？为什么它被视为行业标准？
- 什么是RPEEE？如果一个深埋于地下2000米的低品位矿体被钻探证实，能否报告为资源量？
- 在一个品位变异性很高的脉状金矿中，如何决定从推断升级到标示所需的钻探间距？
- 资源量报告中为什么必须说明切割品位和上限品位处理？这对投资者解读数据有何影响？
