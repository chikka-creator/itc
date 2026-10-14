export type AssignmentStatus = 'draft' | 'published' | 'archived';

export interface Assignment {
  id: string;
  title: string;
  description: string | null;
  categoryId: string;
  deadline: Date;
  maxScore: number;
  status: AssignmentStatus;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
