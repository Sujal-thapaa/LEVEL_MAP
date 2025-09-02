export interface Level {
  id: number;
  position: { x: number; y: number };
  difficulty: 'Easy' | 'Medium' | 'Hard';
  stars: number;
  description: string;
  isCompleted: boolean;
  isUnlocked: boolean;
  isCurrent: boolean;
  color?: string;
  icon?: string;
  topic?: string;
}

export enum LevelStatus {
  LOCKED = 'locked',
  UNLOCKED = 'unlocked',
  COMPLETED = 'completed',
  CURRENT = 'current',
}