import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/permissions';
import {
  db,
  announcements,
  notifications,
  cuid,
  eq,
} from '@itc/db';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const id = params.id;
    const body = await req.json();
    const { title, body: contentBody, published, pinned } = body;

    const existing = await db
      .select()
      .from(announcements)
      .where(eq(announcements.id, id))
      .get();

    if (!existing) {
      return NextResponse.json(
        { error: 'Pengumuman tidak ditemukan' },
        { status: 404 }
      );
    }

    const wasDraft = existing.published === 0;
    const willBePublished = published === 1 || published === true;

    await db
      .update(announcements)
      .set({
        title: title !== undefined ? title.trim() : existing.title,
        body: contentBody !== undefined ? contentBody.trim() : existing.body,
        published: published !== undefined ? (published ? 1 : 0) : existing.published,
        pinned: pinned !== undefined ? (pinned ? 1 : 0) : existing.pinned,
        publishedAt:
          willBePublished && wasDraft
            ? new Date()
            : existing.publishedAt,
        updatedAt: new Date(),
      })
      .where(eq(announcements.id, id));

    if (wasDraft && willBePublished) {
      const finalTitle = title ? title.trim() : existing.title;
      const finalBody = contentBody ? contentBody.trim() : existing.body;

      await db.insert(notifications).values({
        id: cuid(),
        userId: null,
        title: `Pengumuman: ${finalTitle}`,
        body: finalBody.slice(0, 160) + (finalBody.length > 160 ? '...' : ''),
        type: 'announcement',
        read: 0,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || 'Gagal memperbarui pengumuman' },
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

    await db.delete(announcements).where(eq(announcements.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || 'Gagal menghapus pengumuman' },
      { status: 500 }
    );
  }
}
