export type SubmissionStatus =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'late'
  | 'missing'
  | 'graded';

export interface Submission {
  id: string;
  assignmentId: string;
  userId: string;
  fileUrl: string | null;
  fileName: string | null;
  fileSize: number | null;
  linkUrl: string | null;
  status: SubmissionStatus;
  score: number | null;
  feedback: string | null;
  gradedBy: string | null;
  gradedAt: Date | null;
  submittedAt: Date;
  updatedAt: Date;
}
