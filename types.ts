export interface Student {
  id: number;
  name: string;
  strength: string;
  challenge: string;
  weeklyGoal: string;
  score: number; // Average score
  avatarUrl?: string; // URL for student profile image
  // Individual subjects (optional)
  math?: number;
  literature?: number;
  english?: number;
  science?: number;
  history?: number;
}

export interface ClassMetadata {
  school: string;
  grade: string;
  teacher: string;
}

export interface Awards {
  winner?: Student;
  kindness?: Student;
  creative?: Student;
  persistence?: Student;
}