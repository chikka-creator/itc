import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/permissions';
import { db, users, eq } from '@itc/db';
import bcrypt from 'bcryptjs';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const userId = params.id;
    const body = await req.json();
    const { password } = body;

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: 'Password baru minimal 6 karakter' },
        { status: 400 }
      );
    }

    const targetUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, userId))
      .get();

    if (!targetUser) {
      return NextResponse.json(
        { error: 'Pengguna tidak ditemukan' },
        { status: 404 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await db
      .update(users)
      .set({
        passwordHash,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    return NextResponse.json({ success: true });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || 'Gagal mereset kata sandi' },
      { status: 500 }
    );
  }
}
