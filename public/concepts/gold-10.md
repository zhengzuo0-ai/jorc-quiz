# JORC 资源量与储量估算 Resource & Reserve Estimation

## JORC 框架概述 JORC Framework Overview

**JORC Code** (Joint Ore Reserves Committee) 是澳大利亚/亚太地区矿业报告的标准准则。

### 资源量与储量关系 Resource vs Reserve

```
勘探结果 (Exploration Results)
    ↓ 增加地质认识
推断资源量 (Inferred Mineral Resource)
    ↓ 增加采样密度
标示资源量 (Indicated Mineral Resource)
    ↓ 更密集采样
探明资源量 (Measured Mineral Resource)
    ↓ + 经济可行性研究 (Modifying Factors)
概略储量 (Probable Ore Reserve) ← 从标示
证实储量 (Proved Ore Reserve) ← 从探明
```

### 关键区别 Key Differences

| 类别 Category | 地质确定性 | 经济可行性 | 信心水平 |
|---|---|---|---|
| 推断资源 Inferred | 低 Low | 未考虑 | 最低 |
| 标示资源 Indicated | 中 Moderate | 未考虑 | 中等 |
| 探明资源 Measured | 高 High | 未考虑 | 高 |
| 概略储量 Probable | 中 Moderate | **已验证** | 中等 |
| 证实储量 Proved | 高 High | **已验证** | 最高 |

**关键概念:**
- **资源量 Resource** = 有合理前景被经济开采的矿化体 (reasonable prospects for eventual economic extraction)
- **储量 Reserve** = 经过修正因素 (Modifying Factors) 验证后可经济开采的部分
- **修正因素**: 采矿、加工、冶金、经济、市场、法律、环境、社会

## 品位估算方法 Grade Estimation Methods

### 地质统计学 Geostatistics

#### 克里金法 Kriging (最常用)
- **普通克里金 Ordinary Kriging (OK)**: 最基本，假设均值未知但恒定
- **简单克里金 Simple Kriging**: 假设均值已知
- **指示克里金 Indicator Kriging**: 用于品位分布不均匀的矿体

**变差函数 Variogram:**
```
γ(h) = (1/2N) × Σ[Z(xᵢ) - Z(xᵢ+h)]²
```
- 描述空间相关性随距离变化的模型
- 关键参数: 块金值 (Nugget)、基台值 (Sill)、变程 (Range)
- **变程 Range** = 空间相关性的有效距离 → 决定钻探间距

#### 多指标克里金 Multiple Indicator Kriging (MIK)
- 适合**高度不均匀**的金矿床
- 在多个品位阈值上建模
- 更好地表达品位分布的尾部特征

### 反距离加权法 Inverse Distance Weighting (IDW)
```
Z* = Σ(wᵢ × Zᵢ) / Σwᵢ, where wᵢ = 1/dᵢⁿ
```
- n通常取2 (IDW²) 或3 (IDW³)
- 简单快速
- 不如克里金准确，但适合初步估算

### 最近邻法 Nearest Neighbour / Polygonal
- 最简单的方法
- 每个块体赋值为最近样品的品位
- 适用于非常早期的估算

## 模型构建流程 Resource Modelling Workflow

1. **数据库验证 Database Validation**
   - 检查钻孔测量数据
   - 验证样品分析结果
   - QA/QC检查 (标准样、空白样、重复样)

2. **地质建模 Geological Modelling**
   - 3D矿体模型 (wireframes)
   - 断裂构造模型
   - 风化壳模型

3. **数据分析 Data Analysis**
   - 统计分析 (直方图、概率图)
   - 异常值处理 (capping/cutting)
   - 变差函数分析

4. **块体模型 Block Model**
   - 建立3D块体模型 (typically 5m × 5m × 5m to 20m × 20m × 10m)
   - 品位插值 (克里金/IDW)
   - 密度赋值

5. **资源量分类 Resource Classification**
   - 基于: 采样密度、变差函数变程、克里金方差
   - 划分为 Measured / Indicated / Inferred

6. **验证 Validation**
   - 目视检查 (截面图、平面图)
   - 全局统计对比
   - Swath plots (条带对比)
   - 品位-吨位曲线 (Grade-tonnage curves)

## 胜任人制度 Competent Person (CP)

- JORC Code 的核心: 所有公开报告必须由**胜任人**签署
- 要求:
  - 5年以上相关经验
  - AusIMM/AIG或同等专业机构会员
  - 对报告内容负责
- 相当于签字盖章的"技术背书"

---

*关键记忆: Resource ≠ Reserve (资源 ≠ 储量)。从资源到储量需要经过修正因素验证。克里金是最主流的品位估算方法。*
