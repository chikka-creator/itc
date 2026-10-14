import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, users, eq } from '@itc/db';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Password saat ini dan password baru wajib diisi' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Password baru minimal harus 8 karakter' },
        { status: 400 }
      );
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))
      .get();

    if (!user) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
    }

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Password saat ini salah' },
        { status: 400 }
      );
    }

    const newHash = await bcrypt.hash(newPassword, 12);
    await db
      .update(users)
      .set({
        passwordHash: newHash,
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.user.id));

    return NextResponse.json({
      success: true,
      message: 'Password berhasil diperbarui',
    });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui password' },
      { status: 500 }
    );
  }
}
