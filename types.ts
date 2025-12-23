
export interface Task {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: string;
  category: 'Mindfulness' | 'Growth' | 'Physical' | 'Community';
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  image: string;
  available: boolean;
}

export interface Submission {
  id: string;
  userId: string;
  taskId: string;
  taskTitle: string;
  proof: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
  pointsAwarded: number;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  points: number;
  role: 'user' | 'admin';
}

export interface AppState {
  user: User;
  tasks: Task[];
  rewards: Reward[];
  submissions: Submission[];
}
