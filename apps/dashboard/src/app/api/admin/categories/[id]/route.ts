import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/permissions';
import { db, categories, assignments, eq, count } from '@itc/db';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const catId = params.id;
    const body = await req.json();
    const { name, slug, description, color, sortOrder } = body;

    const existingCat = await db
      .select()
      .from(categories)
      .where(eq(categories.id, catId))
      .get();

    if (!existingCat) {
      return NextResponse.json(
        { error: 'Kategori tidak ditemukan' },
        { status: 404 }
      );
    }

    let cleanSlug = existingCat.slug;
    if (slug) {
      cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');
      // If slug changed, verify not in use
      if (cleanSlug !== existingCat.slug) {
        const dup = await db
          .select({ id: categories.id })
          .from(categories)
          .where(eq(categories.slug, cleanSlug))
          .get();
        if (dup) {
          return NextResponse.json(
            { error: 'Slug sudah digunakan oleh kategori lain' },
            { status: 400 }
          );
        }
      }
    }

    await db
      .update(categories)
      .set({
        name: name !== undefined ? name.trim() : existingCat.name,
        slug: cleanSlug,
        description:
          description !== undefined
            ? description
              ? description.trim()
              : null
            : existingCat.description,
        color: color !== undefined ? color : existingCat.color,
        sortOrder:
          sortOrder !== undefined ? Number(sortOrder) || 0 : existingCat.sortOrder,
        updatedAt: new Date(),
      })
      .where(eq(categories.id, catId));

    return NextResponse.json({ success: true });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || 'Gagal memperbarui kategori' },
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
    const catId = params.id;

    // Guard: check if assignments exist under this category
    const countRes = await db
      .select({ value: count() })
      .from(assignments)
      .where(eq(assignments.categoryId, catId))
      .get();

    if ((countRes?.value ?? 0) > 0) {
      return NextResponse.json(
        {
          error: `Kategori tidak dapat dihapus karena masih digunakan oleh ${countRes?.value} penugasan.`,
        },
        { status: 400 }
      );
    }

    await db.delete(categories).where(eq(categories.id, catId));

    return NextResponse.json({ success: true });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || 'Gagal menghapus kategori' },
      { status: 500 }
    );
  }
}
