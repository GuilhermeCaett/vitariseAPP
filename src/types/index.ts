export interface User {
  id: string;
  email: string;
  name?: string;
  anonymous: boolean;
  createdAt: Date;
  treatmentStartDate: Date;
}

export interface DailyEntry {
  id: string;
  date: string;
  medicationTaken: boolean;
  symptoms: {
    energy: number; // 1-10
    libido: number; // 1-10
    rigidity: number; // 1-10
    selfEsteem: number; // 1-10
  };
  performance?: number; // 1-10
  notes?: string;
  createdAt: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress?: number;
  target?: number;
}

export interface EducationalContent {
  id: string;
  title: string;
  type: 'video' | 'article' | 'tip';
  content: string;
  duration?: number;
  category: string;
}