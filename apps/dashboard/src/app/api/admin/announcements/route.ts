import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/permissions';
import {
  db,
  announcements,
  notifications,
  cuid,
  desc,
} from '@itc/db';

export async function GET() {
  try {
    await requireAdmin();

    const list = await db
      .select()
      .from(announcements)
      .orderBy(desc(announcements.pinned), desc(announcements.createdAt))
      .all();

    return NextResponse.json({ announcements: list });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || 'Gagal memuat pengumuman' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();
    const { title, body: contentBody, published, pinned } = body;

    if (!title || !contentBody) {
      return NextResponse.json(
        { error: 'Judul dan isi pengumuman wajib diisi' },
        { status: 400 }
      );
    }

    const newId = cuid();
    const isPublished = published ? 1 : 0;
    const isPinned = pinned ? 1 : 0;

    await db.insert(announcements).values({
      id: newId,
      title: title.trim(),
      body: contentBody.trim(),
      published: isPublished,
      pinned: isPinned,
      createdBy: admin.id,
      publishedAt: isPublished ? new Date() : null,
    });

    if (isPublished) {
      await db.insert(notifications).values({
        id: cuid(),
        userId: null, // Broadcast to all users
        title: `Pengumuman: ${title.trim()}`,
        body: contentBody.trim().slice(0, 160) + (contentBody.length > 160 ? '...' : ''),
        type: 'announcement',
        read: 0,
      });
    }

    return NextResponse.json({ success: true, id: newId });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || 'Gagal membuat pengumuman' },
      { status: 500 }
    );
  }
}
