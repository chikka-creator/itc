export interface AttendanceSession {
  id: string;
  meetingNo: number;
  title: string | null;
  date: string; // ISO YYYY-MM-DD
  notes: string | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export type AttendanceStatus = 'present' | 'absent' | 'excused';

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  userId: string;
  status: AttendanceStatus;
  markedBy: string | null;
  markedAt: Date;
}
