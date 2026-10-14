export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}
