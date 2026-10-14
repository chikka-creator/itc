import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/permissions';
import {
  db,
  submissions,
  assignments,
  notifications,
  cuid,
  eq,
} from '@itc/db';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin();
    const submissionId = params.id;
    const body = await req.json();
    const { score, feedback, status } = body;

    const sub = await db
      .select({
        id: submissions.id,
        userId: submissions.userId,
        assignmentId: submissions.assignmentId,
        assignmentTitle: assignments.title,
        maxScore: assignments.maxScore,
      })
      .from(submissions)
      .innerJoin(assignments, eq(submissions.assignmentId, assignments.id))
      .where(eq(submissions.id, submissionId))
      .get();

    if (!sub) {
      return NextResponse.json(
        { error: 'Submisi tidak ditemukan' },
        { status: 404 }
      );
    }

    if (status === 'graded') {
      if (score === undefined || score === null || isNaN(Number(score))) {
        return NextResponse.json(
          { error: 'Nilai angka wajib diisi' },
          { status: 400 }
        );
      }
      const numScore = Number(score);
      if (numScore < 0 || numScore > sub.maxScore) {
        return NextResponse.json(
          { error: `Nilai harus berada di rentang 0 hingga ${sub.maxScore}` },
          { status: 400 }
        );
      }
    }

    if (status === 'rejected' && (!feedback || !feedback.trim())) {
      return NextResponse.json(
        { error: 'Catatan feedback wajib diisi jika submisi ditolak / perlu revisi' },
        { status: 400 }
      );
    }

    const finalStatus = status || 'graded';
    const finalScore = finalStatus === 'graded' ? Number(score) : null;

    await db
      .update(submissions)
      .set({
        status: finalStatus,
        score: finalScore,
        feedback: feedback ? feedback.trim() : null,
        gradedBy: admin.id,
        gradedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(submissions.id, submissionId));

    // Send notification to the member
    let notifBody = '';
    if (finalStatus === 'graded') {
      notifBody = `Tugas Anda dinilai: ${finalScore}/${sub.maxScore} Poin. ${
        feedback ? `Feedback: "${feedback.trim()}"` : ''
      }`;
    } else if (finalStatus === 'accepted') {
      notifBody = `Submisi Anda telah diterima oleh pembina.`;
    } else if (finalStatus === 'rejected') {
      notifBody = `Submisi perlu revisi. Catatan: "${feedback ? feedback.trim() : ''}"`;
    }

    await db.insert(notifications).values({
      id: cuid(),
      userId: sub.userId,
      title: `Penilaian: ${sub.assignmentTitle}`,
      body: notifBody,
      type: 'grade',
      read: 0,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || 'Gagal menyimpan penilaian' },
      { status: 500 }
    );
  }
}
