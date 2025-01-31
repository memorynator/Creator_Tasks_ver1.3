export type StaffRole = 'designer' | 'illustrator' | 'director' | 'videoCreator' | 'engineer';

export type ProjectPriority = 'SS' | 'S' | 'A' | 'B' | 'C';

export type BusinessType = 'vtuber' | 'creative';

export interface Staff {
  id: string;
  name: string;
  role: StaffRole;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Project {
  id: string;
  name: string;
  categoryId: string;
  revenue: number;
  estimatedHours: number;
  targetMonth: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
  priority: ProjectPriority;
  businessType: BusinessType;
}

export interface Task {
  id: string;
  title: string;
  projectId: string;
  assigneeId: string;
  categoryId: string;
  startDate: string;
  endDate: string;
  duration: number; // 小数点第2位まで対応
  completed: boolean;
}

export const roleLabels: Record<StaffRole, string> = {
  designer: 'デザイナー',
  illustrator: 'イラストレーター',
  director: 'ディレクター',
  videoCreator: '動画クリエイター',
  engineer: 'エンジニア',
};

export const priorityLabels: Record<ProjectPriority, string> = {
  SS: 'SS',
  S: 'S',
  A: 'A',
  B: 'B',
  C: 'C',
};

export const priorityColors: Record<ProjectPriority, string> = {
  SS: '#FF3B30', // 鮮やかな赤
  S: '#FF9500',  // オレンジ
  A: '#34C759',  // グリーン
  B: '#007AFF', // ブルー
  C: '#8E8E93', // グレー
};

export const businessTypeLabels: Record<BusinessType, string> = {
  vtuber: 'VTuber事業',
  creative: 'クリエイティブ事業',
};