import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/permissions';
import { db, categories, assignments, cuid, asc, eq, count } from '@itc/db';

export async function GET() {
  try {
    await requireAdmin();

    const allCategories = await db
      .select()
      .from(categories)
      .orderBy(asc(categories.sortOrder), asc(categories.name))
      .all();

    // Get count of assignments per category
    const catCounts = await db
      .select({
        categoryId: assignments.categoryId,
        count: count(assignments.id),
      })
      .from(assignments)
      .groupBy(assignments.categoryId)
      .all();

    const countMap: Record<string, number> = {};
    for (const c of catCounts) {
      countMap[c.categoryId] = c.count;
    }

    const categoriesWithCount = allCategories.map((cat) => ({
      ...cat,
      assignmentCount: countMap[cat.id] || 0,
    }));

    return NextResponse.json({ categories: categoriesWithCount });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || 'Gagal memuat kategori' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { name, slug, description, color, sortOrder } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Nama dan slug kategori wajib diisi' },
        { status: 400 }
      );
    }

    const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');

    // Check slug uniqueness
    const existing = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.slug, cleanSlug))
      .get();

    if (existing) {
      return NextResponse.json(
        { error: 'Slug kategori sudah digunakan' },
        { status: 400 }
      );
    }

    const newId = cuid();
    await db.insert(categories).values({
      id: newId,
      name: name.trim(),
      slug: cleanSlug,
      description: description ? description.trim() : null,
      color: color || '#7C8C6B',
      sortOrder: Number(sortOrder) || 0,
    });

    return NextResponse.json({ success: true, id: newId });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || 'Gagal membuat kategori' },
      { status: 500 }
    );
  }
}
