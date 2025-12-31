
export enum ProjectStatus {
  IN_PROGRESS = '进行中',
  NOT_STARTED = '未启动',
  COMPLETED = '已完成'
}

export enum PhaseStatus {
  IN_PROGRESS = '进行中',
  COMPLETED = '已完成'
}

export interface PhaseInstance {
  id: string;
  name: string;
  startOffset: number; // Percentage or relative units from start of timeline
  topOffset: number; // Vertical offset from top of the row
  width: number; // Width in relative units
  height: number; // Height in pixels
  status: PhaseStatus;
}

export interface Project {
  id: string;
  module: string;
  useCase: string;
  content: string;
  businessLead: string;
  overallStatus: ProjectStatus;
  phases: PhaseInstance[];
}

export interface TimelineConfig {
  startDate: Date;
  totalDays: number;
  cellWidth: number; // Pixel width for one day
}
