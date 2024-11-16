export interface Activity {
  id: string;
  title: string;
  description: string;
  projectId: string;
  date: string;
  timeSpent: number; // in minutes
  cost: number;
  imageUrl?: string;
  linkUrl?: string;
  status: 'completed' | 'planned' | 'in-progress' | 'stuck' | 'cancelled';
}

export interface Project {
  id: string;
  name: string;
  color: string;
}