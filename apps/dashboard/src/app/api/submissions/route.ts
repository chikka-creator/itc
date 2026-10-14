import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, assignments, submissions, notifications, eq, and, cuid } from '@itc/db';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { assignmentId, fileUrl, fileName, fileSize, linkUrl } = body;

    if (!assignmentId) {
      return NextResponse.json(
        { error: 'ID Tugas wajib disertakan' },
        { status: 400 }
      );
    }

    if (!fileUrl && !linkUrl) {
      return NextResponse.json(
        { error: 'Wajib mengunggah berkas atau menyertakan tautan repository' },
        { status: 400 }
      );
    }

    // Fetch assignment
    const assignment = await db
      .select()
      .from(assignments)
      .where(eq(assignments.id, assignmentId))
      .get();

    if (!assignment) {
      return NextResponse.json(
        { error: 'Tugas tidak ditemukan' },
        { status: 404 }
      );
    }

    // Check deadline
    const deadlineMs = assignment.deadline instanceof Date
      ? assignment.deadline.getTime()
      : new Date(assignment.deadline).getTime();

    if (Date.now() > deadlineMs) {
      return NextResponse.json(
        { error: 'Batas waktu pengumpulan telah berakhir. Submisi tidak lagi diterima.' },
        { status: 400 }
      );
    }

    // Check if user already submitted
    const existing = await db
      .select()
      .from(submissions)
      .where(
        and(
          eq(submissions.userId, session.user.id),
          eq(submissions.assignmentId, assignmentId)
        )
      )
      .get();

    if (existing) {
      // Update submission before deadline
      await db
        .update(submissions)
        .set({
          fileUrl: fileUrl ?? existing.fileUrl,
          fileName: fileName ?? existing.fileName,
          fileSize: fileSize ?? existing.fileSize,
          linkUrl: linkUrl ?? existing.linkUrl,
          status: 'pending',
          updatedAt: new Date(),
        })
        .where(eq(submissions.id, existing.id));

      const updated = await db
        .select()
        .from(submissions)
        .where(eq(submissions.id, existing.id))
        .get();

      return NextResponse.json({
        success: true,
        message: 'Submisi berhasil diperbarui',
        submission: updated,
      });
    }

    // Insert new submission
    const newId = cuid();
    await db.insert(submissions).values({
      id: newId,
      assignmentId,
      userId: session.user.id,
      fileUrl: fileUrl || null,
      fileName: fileName || null,
      fileSize: fileSize || null,
      linkUrl: linkUrl || null,
      status: 'pending',
      submittedAt: new Date(),
      updatedAt: new Date(),
    });

    // Create confirmation notification
    await db.insert(notifications).values({
      id: cuid(),
      userId: session.user.id,
      title: 'Tugas Berhasil Dikumpulkan',
      body: `Kamu telah berhasil mengumpulkan tugas "${assignment.title}". Pengurus akan segera memeriksa dan memberikan masukan.`,
      type: 'assignment',
      read: 0,
      createdAt: new Date(),
    });

    const created = await db
      .select()
      .from(submissions)
      .where(eq(submissions.id, newId))
      .get();

    return NextResponse.json({
      success: true,
      message: 'Tugas berhasil dikumpulkan',
      submission: created,
    });
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memproses submisi tugas' },
      { status: 500 }
    );
  }
}
