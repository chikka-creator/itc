import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, assignments, submissions, eq, and } from '@itc/db';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const { fileUrl, fileName, fileSize, linkUrl } = body;

    const existing = await db
      .select()
      .from(submissions)
      .where(and(eq(submissions.id, id), eq(submissions.userId, session.user.id)))
      .get();

    if (!existing) {
      return NextResponse.json(
        { error: 'Submisi tidak ditemukan' },
        { status: 404 }
      );
    }

    // Verify deadline
    const assignment = await db
      .select()
      .from(assignments)
      .where(eq(assignments.id, existing.assignmentId))
      .get();

    if (!assignment) {
      return NextResponse.json(
        { error: 'Tugas tidak ditemukan' },
        { status: 404 }
      );
    }

    const deadlineMs = assignment.deadline instanceof Date
      ? assignment.deadline.getTime()
      : new Date(assignment.deadline).getTime();

    if (Date.now() > deadlineMs) {
      return NextResponse.json(
        { error: 'Batas waktu pengumpulan telah berakhir. Submisi tidak dapat diubah lagi.' },
        { status: 400 }
      );
    }

    await db
      .update(submissions)
      .set({
        fileUrl: fileUrl ?? existing.fileUrl,
        fileName: fileName ?? existing.fileName,
        fileSize: fileSize ?? existing.fileSize,
        linkUrl: linkUrl ?? existing.linkUrl,
        updatedAt: new Date(),
      })
      .where(eq(submissions.id, id));

    const updated = await db
      .select()
      .from(submissions)
      .where(eq(submissions.id, id))
      .get();

    return NextResponse.json({
      success: true,
      message: 'Submisi berhasil diperbarui',
      submission: updated,
    });
  } catch (error) {
    console.error('Update submission error:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui submisi' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    const existing = await db
      .select()
      .from(submissions)
      .where(and(eq(submissions.id, id), eq(submissions.userId, session.user.id)))
      .get();

    if (!existing) {
      return NextResponse.json(
        { error: 'Submisi tidak ditemukan' },
        { status: 404 }
      );
    }

    // Verify deadline
    const assignment = await db
      .select()
      .from(assignments)
      .where(eq(assignments.id, existing.assignmentId))
      .get();

    if (assignment) {
      const deadlineMs = assignment.deadline instanceof Date
        ? assignment.deadline.getTime()
        : new Date(assignment.deadline).getTime();

      if (Date.now() > deadlineMs) {
        return NextResponse.json(
          { error: 'Batas waktu telah berakhir. Submisi tidak dapat dihapus.' },
          { status: 400 }
        );
      }
    }

    await db.delete(submissions).where(eq(submissions.id, id));

    return NextResponse.json({
      success: true,
      message: 'Submisi berhasil dihapus',
    });
  } catch (error) {
    console.error('Delete submission error:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus submisi' },
      { status: 500 }
    );
  }
}
