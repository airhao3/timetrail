export type ActivityStatus = 'completed' | 'planned' | 'in-progress' | 'stuck' | 'cancelled';

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
  status: ActivityStatus;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  user_id: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  project_id?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';