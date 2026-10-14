import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/permissions';
import {
  db,
  assignments,
  submissions,
  notifications,
  cuid,
  eq,
  count,
} from '@itc/db';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const assignmentId = params.id;
    const body = await req.json();
    const { title, description, categoryId, deadline, maxScore, status } = body;

    const existing = await db
      .select()
      .from(assignments)
      .where(eq(assignments.id, assignmentId))
      .get();

    if (!existing) {
      return NextResponse.json(
        { error: 'Penugasan tidak ditemukan' },
        { status: 404 }
      );
    }

    const wasDraft = existing.status === 'draft';
    const willBePublished = status === 'published';

    let deadlineDate = existing.deadline;
    if (deadline) {
      const d = new Date(deadline);
      if (!isNaN(d.getTime())) {
        deadlineDate = d;
      }
    }

    await db
      .update(assignments)
      .set({
        title: title !== undefined ? title.trim() : existing.title,
        description:
          description !== undefined
            ? description
              ? description.trim()
              : null
            : existing.description,
        categoryId: categoryId !== undefined ? categoryId : existing.categoryId,
        deadline: deadlineDate,
        maxScore: maxScore !== undefined ? Number(maxScore) || 100 : existing.maxScore,
        status: status !== undefined ? status : existing.status,
        updatedAt: new Date(),
      })
      .where(eq(assignments.id, assignmentId));

    // If transitioned from draft to published, send broadcast
    if (wasDraft && willBePublished) {
      const deadlineStr = deadlineDate.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      await db.insert(notifications).values({
        id: cuid(),
        userId: null,
        title: `Tugas Baru: ${(title || existing.title).trim()}`,
        body: `Tugas telah dipublikasikan. Deadline: ${deadlineStr} WIB.`,
        type: 'assignment',
        read: 0,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || 'Gagal memperbarui penugasan' },
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
    const assignmentId = params.id;

    // Check submission count
    const subCountRes = await db
      .select({ value: count() })
      .from(submissions)
      .where(eq(submissions.assignmentId, assignmentId))
      .get();

    const subCount = subCountRes?.value ?? 0;

    // Guard: cannot delete if has submissions (archive instead)
    if (subCount > 0) {
      // Archive instead
      await db
        .update(assignments)
        .set({ status: 'archived', updatedAt: new Date() })
        .where(eq(assignments.id, assignmentId));

      return NextResponse.json({
        success: true,
        archived: true,
        message:
          'Tugas memiliki berkas submisi siswa, status tugas otomatis dialihkan menjadi Arsip (Archived).',
      });
    }

    await db.delete(assignments).where(eq(assignments.id, assignmentId));

    return NextResponse.json({ success: true });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || 'Gagal menghapus penugasan' },
      { status: 500 }
    );
  }
}
