import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/permissions';
import {
  db,
  assignments,
  categories,
  submissions,
  notifications,
  cuid,
  desc,
  eq,
  count,
} from '@itc/db';

export async function GET() {
  try {
    await requireAdmin();

    const allAssignments = await db
      .select({
        id: assignments.id,
        title: assignments.title,
        description: assignments.description,
        categoryId: assignments.categoryId,
        categoryName: categories.name,
        categoryColor: categories.color,
        deadline: assignments.deadline,
        maxScore: assignments.maxScore,
        status: assignments.status,
        createdAt: assignments.createdAt,
      })
      .from(assignments)
      .leftJoin(categories, eq(assignments.categoryId, categories.id))
      .orderBy(desc(assignments.createdAt))
      .all();

    // Fetch submissions count per assignment
    const subCounts = await db
      .select({
        assignmentId: submissions.assignmentId,
        count: count(submissions.id),
      })
      .from(submissions)
      .groupBy(submissions.assignmentId)
      .all();

    const countMap: Record<string, number> = {};
    for (const sc of subCounts) {
      countMap[sc.assignmentId] = sc.count;
    }

    const result = allAssignments.map((a) => ({
      ...a,
      submissionsCount: countMap[a.id] || 0,
    }));

    return NextResponse.json({ assignments: result });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || 'Gagal memuat daftar penugasan' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();
    const { title, description, categoryId, deadline, maxScore, status } = body;

    if (!title || !categoryId || !deadline) {
      return NextResponse.json(
        { error: 'Judul tugas, kategori, dan tenggat waktu wajib diisi' },
        { status: 400 }
      );
    }

    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) {
      return NextResponse.json(
        { error: 'Format tenggat waktu tidak valid' },
        { status: 400 }
      );
    }

    const newId = cuid();
    const assignmentStatus = status === 'draft' ? 'draft' : 'published';

    await db.insert(assignments).values({
      id: newId,
      title: title.trim(),
      description: description ? description.trim() : null,
      categoryId,
      deadline: deadlineDate,
      maxScore: Number(maxScore) || 100,
      status: assignmentStatus,
      createdBy: admin.id,
    });

    // If published, broadcast notification to all members
    if (assignmentStatus === 'published') {
      const deadlineStr = deadlineDate.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      await db.insert(notifications).values({
        id: cuid(),
        userId: null, // Broadcast to all users
        title: `Tugas Baru: ${title.trim()}`,
        body: `Deadline pengumpulan: ${deadlineStr} WIB. Segera kumpulkan sebelum batas waktu.`,
        type: 'assignment',
        read: 0,
      });
    }

    return NextResponse.json({ success: true, id: newId });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || 'Gagal membuat penugasan' },
      { status: 500 }
    );
  }
}
