import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, notifications, eq, or, desc, isNull, and } from '@itc/db';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const list = await db
      .select()
      .from(notifications)
      .where(
        or(
          eq(notifications.userId, session.user.id),
          isNull(notifications.userId)
        )
      )
      .orderBy(desc(notifications.createdAt))
      .limit(30)
      .all();

    const unreadCount = list.filter((n) => n.read === 0).length;

    return NextResponse.json({
      notifications: list,
      unreadCount,
    });
  } catch (error) {
    console.error('Fetch notifications error:', error);
    return NextResponse.json(
      { error: 'Gagal memuat notifikasi' },
      { status: 500 }
    );
  }
}

export async function PATCH() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Mark all as read for this user
    await db
      .update(notifications)
      .set({ read: 1 })
      .where(eq(notifications.userId, session.user.id));

    return NextResponse.json({
      success: true,
      message: 'Semua notifikasi ditandai telah dibaca',
    });
  } catch (error) {
    console.error('Mark all read error:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui status notifikasi' },
      { status: 500 }
    );
  }
}
