import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/permissions';
import { db, users, cuid, desc, eq } from '@itc/db';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    await requireAdmin();

    const allUsers = await db
      .select({
        id: users.id,
        name: users.name,
        username: users.username,
        email: users.email,
        role: users.role,
        className: users.className,
        phone: users.phone,
        bio: users.bio,
        lastLoginAt: users.lastLoginAt,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt))
      .all();

    return NextResponse.json({ users: allUsers });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || 'Gagal memuat pengguna' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { name, username, email, password, role, className, phone, bio } = body;

    if (!name || !username || !password) {
      return NextResponse.json(
        { error: 'Nama, username, dan password wajib diisi' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password minimal 6 karakter' },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim().toLowerCase();

    // Check unique username
    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.username, cleanUsername))
      .get();

    if (existing) {
      return NextResponse.json(
        { error: 'Username sudah digunakan oleh akun lain' },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newId = cuid();

    await db.insert(users).values({
      id: newId,
      name: name.trim(),
      username: cleanUsername,
      email: email ? email.trim() : null,
      passwordHash,
      role: role === 'admin' ? 'admin' : 'member',
      className: className ? className.trim() : null,
      phone: phone ? phone.trim() : null,
      bio: bio ? bio.trim() : null,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: newId,
        name: name.trim(),
        username: cleanUsername,
        role: role === 'admin' ? 'admin' : 'member',
        className: className ? className.trim() : null,
      },
    });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || 'Gagal menambahkan anggota' },
      { status: 500 }
    );
  }
}
