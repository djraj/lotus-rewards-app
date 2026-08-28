
export interface Task {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: string;
  category: 'Referral' | 'Service' | 'Content' | 'Coordination';
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  image: string | null;
  available: boolean;
  category: 'Products' | 'Sessions' | 'Workshops' | 'Reviews';
}

export interface Submission {
  id: string;
  userId: string;
  taskId: string;
  taskTitle: string;
  proofNote: string | null;
  proofImagePath: string | null;
  timestamp: string;
  updatedAt: string;
  status: 'ongoing' | 'pending' | 'approved' | 'rejected';
  pointsAwarded: number;
}

export interface RewardClaim {
  id: string;
  userId: string;
  rewardId: string;
  rewardTitle: string;
  cost: number;
  status: 'pending' | 'approved' | 'rejected';
  remark: string | null;
  grantedBy: string | null;
  timestamp: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string | null;
  points: number;
  role: 'user' | 'admin';
}
