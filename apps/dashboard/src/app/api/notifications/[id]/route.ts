import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, notifications, eq, and } from '@itc/db';

export async function PATCH(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    await db
      .update(notifications)
      .set({ read: 1 })
      .where(and(eq(notifications.id, id), eq(notifications.userId, session.user.id)));

    return NextResponse.json({
      success: true,
      message: 'Notifikasi ditandai dibaca',
    });
  } catch (error) {
    console.error('Mark notification read error:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui notifikasi' },
      { status: 500 }
    );
  }
}
