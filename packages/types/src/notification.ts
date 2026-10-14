export type NotificationType =
  | 'info'
  | 'assignment'
  | 'deadline'
  | 'grade'
  | 'announcement';

export interface Notification {
  id: string;
  userId: string | null;
  title: string;
  body: string | null;
  type: NotificationType;
  read: boolean;
  createdAt: Date;
}
