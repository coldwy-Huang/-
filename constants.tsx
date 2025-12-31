
import { Project, ProjectStatus } from './types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    module: '物流计划',
    useCase: '库存削减',
    content: '安全库存应用至原料、半成品、成品',
    businessLead: '陈从定(24079)',
    overallStatus: ProjectStatus.IN_PROGRESS,
    phases: []
  },
  {
    id: '2',
    module: '物流计划',
    useCase: '生成计划排程',
    content: '按需求自动排程；生产资源柔性配置',
    businessLead: '金成(24981)',
    overallStatus: ProjectStatus.IN_PROGRESS,
    phases: []
  },
  {
    id: '3',
    module: '物流计划',
    useCase: '立库存储效率',
    content: '存储与调度的最佳配置；出货与拣选节拍',
    businessLead: '尚江忠(21908)',
    overallStatus: ProjectStatus.IN_PROGRESS,
    phases: []
  },
  {
    id: '4',
    module: '物流计划',
    useCase: '厂内物流配送',
    content: '配送至产线工位的全面铺开，融合数字化的齐套率、上线及时率、人效等指标优化',
    businessLead: '陈辉兵 64974',
    overallStatus: ProjectStatus.IN_PROGRESS,
    phases: []
  },
  {
    id: '5',
    module: '辅助平台',
    useCase: '产线效率智能管理',
    content: '产线运行效率实时监控与瓶颈优化建议',
    businessLead: '周侃(24291)',
    overallStatus: ProjectStatus.IN_PROGRESS,
    phases: []
  },
  {
    id: '6',
    module: '辅助平台',
    useCase: '制费分析及预测',
    content: '制造费用实时归集与多维度趋势预测',
    businessLead: '王双喜(35908)',
    overallStatus: ProjectStatus.IN_PROGRESS,
    phases: []
  },
  {
    id: '7',
    module: '质量管理',
    useCase: 'FAI智能识图',
    content: '基于CAD工具拓展智能识图，并集成设备数据，提升FAI检验效率，缩短检验周期',
    businessLead: '张建(12149)',
    overallStatus: ProjectStatus.COMPLETED,
    phases: []
  }
];

export const TIMELINE_CELL_WIDTH = 120; // px
export const TIMELINE_TOTAL_CELLS = 12; // Jan to Dec
