# 选矿方法 Gold Processing & Beneficiation

## 选矿流程概述 Processing Flowsheet Overview

```
矿石 (ROM) → 破碎 Crushing → 磨矿 Grinding → 分选 Separation → 精炼 Refining
```

## 破碎与磨矿 Comminution

### 破碎 Crushing (粗碎→中碎→细碎)

| 阶段 Stage | 设备 Equipment | 产品粒度 |
|---|---|---|
| 粗碎 Primary | 颚式破碎机 Jaw Crusher | <150mm |
| 中碎 Secondary | 圆锥破碎机 Cone Crusher | <40mm |
| 细碎 Tertiary | 圆锥/短头破碎机 | <10mm |

### 磨矿 Grinding
- **球磨机 Ball Mill**: 最常用，钢球作为研磨介质
- **棒磨机 Rod Mill**: 粗磨阶段
- **SAG磨机 Semi-Autogenous Grinding**: 大型矿山首选
  - 矿石自身作为研磨介质 + 少量钢球
  - 处理能力: 10,000-100,000 t/d
- **磨矿细度**: 通常磨至 **-75μm (200目) 占80%**
  - 目的: 使金从矿物中解离 (liberation)

## 重选法 Gravity Separation

### 原理 Principle
利用金的高密度 (19.3 g/cm³) 与脉石矿物 (2.6-3.0 g/cm³) 的密度差进行分选。

### 常用设备
| 设备 Equipment | 原理 | 适用粒度 |
|---|---|---|
| 跳汰机 Jig | 脉动水流分层 | 粗粒 (0.5-10mm) |
| 摇床 Shaking Table | 水流+振动+倾斜 | 细粒 (0.05-2mm) |
| 螺旋溜槽 Spiral Concentrator | 离心力+重力 | 0.05-3mm |
| 尼尔森选矿机 Knelson Concentrator | 离心力 (60-200G) | 细粒金 |
| 猎鹰选矿机 Falcon Concentrator | 离心力 | 超细粒金 |

### 应用
- 常用于磨矿回路的**重选回收 (gravity circuit)**
- 在CIL/CIP之前先回收粗粒自由金
- 可回收 **20-50%** 的金 (取决于粗粒金占比)

## 浮选法 Flotation

### 原理 Principle
利用矿物表面的**疏水性 (hydrophobicity)** 差异。
加入药剂使含金硫化物矿物附着气泡浮升，脉石矿物留在槽底。

### 药剂体系 Reagent System
| 药剂类型 | 代表药剂 | 作用 |
|---|---|---|
| 捕收剂 Collector | 丁基黄药 (PAX) | 使矿物疏水 |
| 起泡剂 Frother | MIBC, 松油 | 产生稳定气泡 |
| 活化剂 Activator | 硫酸铜 CuSO₄ | 活化闪锌矿等 |
| 抑制剂 Depressant | 石灰 Lime | 抑制黄铁矿 |
| pH调节剂 | 石灰/硫酸 | 控制浮选pH |

### 金的浮选特点
- 自然金本身可浮性差，需与硫化物一起浮选
- 含金黄铁矿、含金毒砂是主要浮选目标
- 浮选精矿品位: 20-100 g/t Au (富集比 10-50倍)

## 氰化法 Cyanidation

**最重要的金回收方法**，全球约 **80%** 的金通过氰化法提取。

### 化学原理 Chemistry
```
4Au + 8NaCN + O₂ + 2H₂O → 4Na[Au(CN)₂] + 4NaOH
```
- 金溶于碱性氰化钠溶液 (pH 10-11)
- 需要氧的参与 (通常鼓入空气)
- 反应速度受: 金粒度、NaCN浓度、O₂供给、pH、温度影响

### CIL 炭浸法 Carbon-in-Leach
- 浸出和吸附**同时进行**
- 活性炭直接加入浸出槽中
- 优势: 适合含"劫金"矿物的矿石 (preg-robbing)
- 最常用方法

### CIP 炭浆法 Carbon-in-Pulp
- 先浸出，后吸附
- 浸出在前面的搅拌槽中完成
- 含金溶液流入后面的吸附槽
- 活性炭逆流吸附金

### CIL vs CIP 对比
| 特征 | CIL | CIP |
|---|---|---|
| 浸出和吸附 | 同步 | 分步 |
| 抗"劫金" | 好 Better | 差 Worse |
| 活性炭用量 | 多 | 少 |
| 适用 | 含有机碳矿石 | 普通矿石 |

### 金的回收流程
```
载金炭 → 解吸 (Elution) → 电积 (Electrowinning) → 金泥 → 熔炼 (Smelting) → 金锭 (Doré bar)
```
- Doré bar: 含金85-95%的粗金锭
- 需送精炼厂进一步提纯至 **99.99% (4N)** 纯金

## 难处理金矿 Refractory Gold Ores

约 **30%** 的金矿石属于难处理类型，直接氰化回收率 <80%。

### 难处理原因及解决方案
| 原因 Cause | 描述 | 预处理方法 |
|---|---|---|
| 硫化物包裹 Sulfide-locked | 金被黄铁矿/毒砂包裹 | 焙烧/加压氧化/细菌氧化 |
| 有机碳 Preg-robbing | 矿石中碳质吸附金 | CIL + 毛毯法 |
| 碲化物 Tellurides | 金以碲化物形式存在 | 超细磨 + 强氰化 |

### 预处理技术
1. **焙烧 Roasting**: 高温 (500-700°C) 氧化硫化物
2. **加压氧化 POX (Pressure Oxidation)**: 高温高压釜中氧化
3. **细菌氧化 BIOX**: 利用嗜酸菌分解硫化物
4. **超细磨 Ultra-fine Grinding**: 磨至 <10μm 暴露金粒

---

*选矿要点: 重选(先回收粗粒金) → 浮选(富集含金硫化物) → 氰化(溶解金) → 炭吸附(回收金) → 精炼(提纯)*
