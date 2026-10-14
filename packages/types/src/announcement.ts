export interface Announcement {
  id: string;
  title: string;
  body: string;
  published: boolean;
  pinned: boolean;
  createdBy: string;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
