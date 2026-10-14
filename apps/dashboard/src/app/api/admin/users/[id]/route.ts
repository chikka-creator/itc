import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/permissions';
import { db, users, eq, and, count } from '@itc/db';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin();
    const userId = params.id;
    const body = await req.json();
    const { name, email, role, className, phone, bio } = body;

    const targetUser = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .get();

    if (!targetUser) {
      return NextResponse.json(
        { error: 'Pengguna tidak ditemukan' },
        { status: 404 }
      );
    }

    // Safeguard: Cannot demote the last admin
    if (targetUser.role === 'admin' && role === 'member') {
      const adminCountRes = await db
        .select({ value: count() })
        .from(users)
        .where(eq(users.role, 'admin'))
        .get();

      if ((adminCountRes?.value ?? 0) <= 1) {
        return NextResponse.json(
          { error: 'Tidak dapat mengubah peran admin terakhir menjadi anggota' },
          { status: 400 }
        );
      }
    }

    await db
      .update(users)
      .set({
        name: name !== undefined ? name.trim() : targetUser.name,
        email: email !== undefined ? (email ? email.trim() : null) : targetUser.email,
        role: role !== undefined ? role : targetUser.role,
        className:
          className !== undefined
            ? className
              ? className.trim()
              : null
            : targetUser.className,
        phone:
          phone !== undefined ? (phone ? phone.trim() : null) : targetUser.phone,
        bio: bio !== undefined ? (bio ? bio.trim() : null) : targetUser.bio,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    return NextResponse.json({ success: true });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || 'Gagal memperbarui pengguna' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin();
    const userId = params.id;

    // Safeguard 1: Cannot delete self
    if (admin.id === userId) {
      return NextResponse.json(
        { error: 'Anda tidak dapat menghapus akun Anda sendiri' },
        { status: 400 }
      );
    }

    const targetUser = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .get();

    if (!targetUser) {
      return NextResponse.json(
        { error: 'Pengguna tidak ditemukan' },
        { status: 404 }
      );
    }

    // Safeguard 2: Cannot delete last admin
    if (targetUser.role === 'admin') {
      const adminCountRes = await db
        .select({ value: count() })
        .from(users)
        .where(eq(users.role, 'admin'))
        .get();

      if ((adminCountRes?.value ?? 0) <= 1) {
        return NextResponse.json(
          { error: 'Tidak dapat menghapus admin terakhir di sistem' },
          { status: 400 }
        );
      }
    }

    await db.delete(users).where(eq(users.id, userId));

    return NextResponse.json({ success: true });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || 'Gagal menghapus pengguna' },
      { status: 500 }
    );
  }
}
