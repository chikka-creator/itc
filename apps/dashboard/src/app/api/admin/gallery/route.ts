import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/permissions';
import { db, gallery, cuid, asc } from '@itc/db';

export async function GET() {
  try {
    await requireAdmin();

    const items = await db
      .select()
      .from(gallery)
      .orderBy(asc(gallery.sortOrder), asc(gallery.createdAt))
      .all();

    return NextResponse.json({ gallery: items });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || 'Gagal memuat galeri' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();
    const { imageUrl, caption, sortOrder } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'URL foto wajib diisi' },
        { status: 400 }
      );
    }

    const newId = cuid();

    await db.insert(gallery).values({
      id: newId,
      imageUrl: imageUrl.trim(),
      caption: caption ? caption.trim() : null,
      sortOrder: Number(sortOrder) || 0,
      uploadedBy: admin.id,
    });

    return NextResponse.json({ success: true, id: newId });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || 'Gagal menambahkan foto galeri' },
      { status: 500 }
    );
  }
}
