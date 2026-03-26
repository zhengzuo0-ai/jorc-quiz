# 取样与数据质量 Sampling & Data Quality

## 取样方法 Sampling Methods

### 钻探取样 Drill Sampling

#### 金刚石岩心取样 Diamond Core Sampling
- 从岩心中沿一定角度切割取样 (half-core 或 quarter-core)
- **Half-core**: 最常用，将岩心纵向切成两半
- **Quarter-core**: 用于加密取样或QA/QC重复样
- 优势: 样品代表性好，可进行地质编录
- 取样长度: 通常 **1m**，矿化带可缩短至 0.5m

#### RC (反循环) 取样 RC Sampling
- 岩屑通过钻杆内管返回
- 取样在每米的旋风分样器 (cyclone) 中进行
- 需注意: 样品污染、回收率、含水层干扰
- 取样长度: 通常 **1m**

### 坑探取样 Trench/Pit Sampling
- 在地表挖槽或探坑中取样
- **刻槽取样 Channel sampling**: 沿矿化体切割连续槽
- 通常截面 10cm × 5cm
- 每1-2m取一个样

### 地表取样 Surface Sampling
- **拣块 Grab sampling**: 随机拣取，**不具代表性**
- **岩屑 Chip sampling**: 系统敲碎一定面积岩石
- **连续切割 Continuous chip**: 类似刻槽但不如刻槽正规

## 取样偏差 Sampling Bias

### 常见偏差来源
| 偏差 Bias | 原因 | 后果 |
|---|---|---|
| 优先取样 Preferential | 倾向于取更矿化的部分 | 品位偏高 |
| 样品损失 Sample Loss | 破碎矿化带取样回收率低 | 品位偏低 |
| 交叉污染 Cross-contamination | 上一个样品残留 | 品位异常 |
| 粒度效应 Nugget Effect | 粗粒金分布不均 | 品位波动大 |
| 长度偏差 Length Bias | 不等长度样品加权不当 | 品位偏差 |

### 金的"块金效应" Nugget Effect
- 金以颗粒状 (nugget) 分布，不均匀
- 同一位置两个样品可能差异很大
- **对策**:
  - 增大样品量 (更大的取样体积)
  - 使用 Screen Fire Assay (筛分火试金)
  - 增加分析子样品数量

## 样品制备 Sample Preparation

### 标准流程
```
原始样品 (2-5 kg)
  → 粗碎 Jaw Crush (-10mm)
  → 分样 Riffle Split (取 1-3 kg)
  → 中碎 Cone Crush (-2mm)
  → 分样 Riffle Split (取 200-500g)
  → 研磨 Pulverize (-75μm, >85% passing)
  → 取分析子样 (30-50g for Fire Assay)
```

### 关键注意事项
- 每一步都可能引入误差
- **粗碎至分样比 (reduction ratio)** 应符合 Gy's sampling theory
- 分样器必须正确使用 (不能用铲子"估量")
- 研磨必须达到目标细度 (-75μm)

## QA/QC 质量控制体系

### 三大质控手段
1. **标准样 CRM** → 检查**准确度 Accuracy**
2. **空白样 Blank** → 检查**污染 Contamination**
3. **重复样 Duplicate** → 检查**精密度 Precision**

### 插入频率和判定标准

| 质控类型 | 频率 | 合格标准 |
|---|---|---|
| CRM | 1/20-25 样 | 结果在 ±2σ 以内 |
| 空白样 | 1/20-30 样 | 低于检出限或 <0.1 g/t |
| 现场重复 | 1/20 样 | HARD (Half Absolute Relative Difference) <30% |
| 粗副样 | 1/20 样 | HARD <20% |

### HARD 计算
```
HARD = |原样 - 重复样| / ((原样 + 重复样) / 2) × 100%
```

### 异常处理
- CRM 超标 → 该批次重新分析
- 空白样超标 → 调查污染源，必要时重送
- 重复样 HARD 过高 → 增加复查样品数

---

*数据质量是资源估算的基础。"垃圾进，垃圾出" (Garbage in, garbage out) — 没有可靠的取样和QA/QC，就没有可靠的资源估算。*
