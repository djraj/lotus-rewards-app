
import { Task, Reward, User } from './types';

export const INITIAL_USER: User = {
  id: 'u1',
  name: 'Alex Rivera',
  avatar: 'https://picsum.photos/seed/alex/200',
  points: 150,
  role: 'user',
};

export const TASKS: Task[] = [
  {
    id: 't1',
    title: 'Morning Meditation',
    description: 'Complete a 15-minute guided meditation session.',
    points: 25,
    icon: 'fa-om',
    category: 'Mindfulness'
  },
  {
    id: 't2',
    title: 'Daily Journaling',
    description: 'Write at least 300 words reflecting on your day.',
    points: 15,
    icon: 'fa-book-open',
    category: 'Growth'
  },
  {
    id: 't3',
    title: 'Healthy Meal Prep',
    description: 'Prepare a balanced meal with fresh ingredients.',
    points: 30,
    icon: 'fa-carrot',
    category: 'Physical'
  },
  {
    id: 't4',
    title: 'Volunteer Hour',
    description: 'Give back to your local community for one hour.',
    points: 100,
    icon: 'fa-hands-holding-heart',
    category: 'Community'
  },
  {
    id: 't5',
    title: 'Nature Walk',
    description: 'Spend 30 minutes walking in a park or forest.',
    points: 20,
    icon: 'fa-leaf',
    category: 'Physical'
  }
];

export const REWARDS: Reward[] = [
  {
    id: 'r1',
    title: 'Premium Yoga Class',
    description: 'A 60-minute private session with an instructor.',
    cost: 500,
    image: 'https://picsum.photos/seed/yoga/400/300',
    available: true
  },
  {
    id: 'r2',
    title: 'Gratitude Journal',
    description: 'A beautiful physical linen-bound journal.',
    cost: 200,
    image: 'https://picsum.photos/seed/journal/400/300',
    available: true
  },
  {
    id: 'r3',
    title: '1-Month App Subscription',
    description: 'Access to premium meditation and fitness tools.',
    cost: 350,
    image: 'https://picsum.photos/seed/app/400/300',
    available: true
  },
  {
    id: 'r4',
    title: 'Plant a Tree',
    description: 'We will plant a tree in your name in a reforestation area.',
    cost: 150,
    image: 'https://picsum.photos/seed/tree/400/300',
    available: true
  }
];
