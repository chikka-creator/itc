import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/permissions';
import { db, gallery, eq } from '@itc/db';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const id = params.id;
    const body = await req.json();
    const { caption, sortOrder, imageUrl } = body;

    const existing = await db
      .select()
      .from(gallery)
      .where(eq(gallery.id, id))
      .get();

    if (!existing) {
      return NextResponse.json(
        { error: 'Foto tidak ditemukan' },
        { status: 404 }
      );
    }

    await db
      .update(gallery)
      .set({
        caption: caption !== undefined ? (caption ? caption.trim() : null) : existing.caption,
        sortOrder: sortOrder !== undefined ? Number(sortOrder) || 0 : existing.sortOrder,
        imageUrl: imageUrl !== undefined ? imageUrl.trim() : existing.imageUrl,
      })
      .where(eq(gallery.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || 'Gagal memperbarui galeri' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const id = params.id;

    await db.delete(gallery).where(eq(gallery.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || 'Gagal menghapus foto' },
      { status: 500 }
    );
  }
}
