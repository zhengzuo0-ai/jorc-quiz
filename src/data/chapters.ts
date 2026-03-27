import type { Chapter } from '../types';

export const chapters: Chapter[] = [
  // Domain A: JORC Code 2012
  { id: 'jorc-01', domain: 'jorc', name: '三大原则', nameEn: 'Transparency, Materiality, Competence', description: 'JORC 的基础哲学框架', questionCount: 28 },
  { id: 'jorc-02', domain: 'jorc', name: '胜任人 (CP)', nameEn: 'Competent Person', description: '定义、资质要求、法律责任', questionCount: 28 },
  { id: 'jorc-03', domain: 'jorc', name: '资源量与储量分类', nameEn: 'Resource vs Reserve Framework', description: '分类体系、Figure 1、CRIRSCO 对齐', questionCount: 28 },
  { id: 'jorc-04', domain: 'jorc', name: '勘探目标与结果报告', nameEn: 'Exploration Targets & Results', description: 'Clauses 17-19, 报告要求', questionCount: 28 },
  { id: 'jorc-05', domain: 'jorc', name: '矿产资源量', nameEn: 'Mineral Resources', description: 'Inferred/Indicated/Measured 定义与转换条件', questionCount: 28 },
  { id: 'jorc-06', domain: 'jorc', name: '矿石储量', nameEn: 'Ore Reserves', description: 'Probable/Proved, Modifying Factors', questionCount: 28 },
  { id: 'jorc-07', domain: 'jorc', name: '技术研究', nameEn: 'Technical Studies', description: 'Scoping/PFS/DFS 要求与报告', questionCount: 28 },
  { id: 'jorc-08', domain: 'jorc', name: 'Table 1 采样与数据', nameEn: 'Sampling Techniques & Data', description: '采样方法、QA/QC、数据验证', questionCount: 28 },
  { id: 'jorc-09', domain: 'jorc', name: 'Table 1 勘探结果', nameEn: 'Reporting Exploration Results', description: '报告格式、重要性判断', questionCount: 28 },
  { id: 'jorc-10', domain: 'jorc', name: 'Table 1 资源量估算', nameEn: 'Resource Estimation & Reporting', description: '估算方法、分类标准', questionCount: 28 },
  { id: 'jorc-11', domain: 'jorc', name: 'Table 1 储量估算', nameEn: 'Reserve Estimation & Reporting', description: '储量计算、Modifying Factors 报告', questionCount: 28 },
  { id: 'jorc-12', domain: 'jorc', name: 'ASIC 监管与合规', nameEn: 'ASIC Guidance & Compliance', description: '澳洲监管、GN31、常见违规', questionCount: 28 },

  // Domain B: Gold Exploration & Operations
  { id: 'gold-01', domain: 'gold', name: '黄金基础', nameEn: 'Gold Fundamentals', description: '性质、品位单位（g/t, ppb）、计量', questionCount: 27 },
  { id: 'gold-02', domain: 'gold', name: '矿床类型', nameEn: 'Deposit Types', description: 'Orogenic, Epithermal, Porphyry, Carlin, Alluvial', questionCount: 27 },
  { id: 'gold-03', domain: 'gold', name: '西非金矿地质', nameEn: 'West Africa Gold Geology', description: 'Birimian 绿岩带、Man Shield、主要金矿带', questionCount: 27 },
  { id: 'gold-04', domain: 'gold', name: '勘探流程', nameEn: 'Exploration Pipeline', description: 'Desktop → 踏勘 → 系统勘探 → 钻探 → FS', questionCount: 27 },
  { id: 'gold-05', domain: 'gold', name: '勘探方法', nameEn: 'Exploration Methods', description: '地球化学、地球物理、遥感、填图', questionCount: 27 },
  { id: 'gold-06', domain: 'gold', name: '资源量估算', nameEn: 'Resource Estimation', description: '克里金法、反距离加权、块体模型', questionCount: 27 },
  { id: 'gold-07', domain: 'gold', name: '采矿方法', nameEn: 'Mining Methods', description: 'Open Pit, Underground, ASM 对比', questionCount: 27 },
  { id: 'gold-08', domain: 'gold', name: '选矿冶金', nameEn: 'Gold Processing', description: '重选、CIL/CIP、浮选、堆浸、冶炼', questionCount: 27 },
  { id: 'gold-09', domain: 'gold', name: '矿山经济学', nameEn: 'Mine Economics', description: 'AISC、NPV、IRR、敏感性分析', questionCount: 27 },
  { id: 'gold-10', domain: 'gold', name: '法律与监管', nameEn: 'Legal & Regulatory', description: '许可证体系、权利金、JV 结构、ESG', questionCount: 27 },
  { id: 'gold-11', domain: 'gold', name: '黄金价值链', nameEn: 'Gold Value Chain', description: 'Doré → 精炼 → LBMA → 市场', questionCount: 27 },
  { id: 'gold-12', domain: 'gold', name: 'Junior Mining', nameEn: 'Junior Mining Strategy', description: '生命周期、融资方式、JV vs 自主开发', questionCount: 27 },
  { id: 'gold-13', domain: 'gold', name: '钻探技术', nameEn: 'Drilling', description: 'RC vs Diamond Core, 规划、QA/QC、成本', questionCount: 27 },
  { id: 'gold-14', domain: 'gold', name: '世界级金矿公司', nameEn: 'World-Class Gold Companies', description: 'Barrick、Newmont、AngloGold等顶级公司发展史', questionCount: 30 },
  { id: 'gold-15', domain: 'gold', name: '科特迪瓦黄金', nameEn: 'Côte d\'Ivoire Gold Mining', description: 'CDI矿法、矿权、运营公司', questionCount: 25 },
  { id: 'gold-16', domain: 'gold', name: '马里黄金', nameEn: 'Mali Gold Mining', description: '马里金矿历史、矿法改革、军政府影响', questionCount: 25 },
  { id: 'gold-17', domain: 'gold', name: '纳米比亚矿业', nameEn: 'Namibia Mining', description: 'Damara带、矿法、NEEEF', questionCount: 20 },
  { id: 'gold-18', domain: 'gold', name: '老挝矿业', nameEn: 'Laos Mining', description: '印支块体、Sepon、矿法2017', questionCount: 20 },
  { id: 'gold-19', domain: 'gold', name: '矿业金融', nameEn: 'Mining Finance & Capital Markets', description: '上市、流式融资、项目融资', questionCount: 25 },
  { id: 'gold-20', domain: 'gold', name: '矿业人力资源', nameEn: 'Mining HR & Team Building', description: '团队构建、安全文化、劳动法', questionCount: 20 },
  { id: 'gold-21', domain: 'gold', name: '矿业ESG与社区', nameEn: 'Mining ESG & Community Relations', description: '环境管理、社区关系、IFC标准', questionCount: 20 },
];

export const jorcChapters = chapters.filter(c => c.domain === 'jorc');
export const goldChapters = chapters.filter(c => c.domain === 'gold');
