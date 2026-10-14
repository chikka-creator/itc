import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/permissions';
import { db, notifications, cuid } from '@itc/db';

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { title, body: contentBody, type } = body;

    if (!title || !contentBody) {
      return NextResponse.json(
        { error: 'Judul dan isi pemberitahuan wajib diisi' },
        { status: 400 }
      );
    }

    const newId = cuid();
    await db.insert(notifications).values({
      id: newId,
      userId: null, // Broadcast to all users
      title: title.trim(),
      body: contentBody.trim(),
      type: type || 'info',
      read: 0,
    });

    return NextResponse.json({ success: true, id: newId });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || 'Gagal menyiarkan notifikasi' },
      { status: 500 }
    );
  }
}
