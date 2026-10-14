export interface GalleryImage {
  id: string;
  imageUrl: string;
  caption: string | null;
  sortOrder: number;
  uploadedBy: string;
  createdAt: Date;
}
