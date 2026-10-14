import React from 'react';
import { requireAdmin } from '@/lib/permissions';
import {
  db,
  users,
  assignments,
  submissions,
  attendanceSessions,
  attendanceRecords,
  desc,
  eq,
} from '@itc/db';
import Link from 'next/link';
import {
  Users,
  BookOpen,
  FileCheck,
  CheckSquare,
  Plus,
  ArrowRight,
  TrendingUp,
  Clock,
  UserPlus,
  FileSpreadsheet,
} from 'lucide-react';

export default async function AdminOverviewPage() {
  const admin = await requireAdmin();

  // Fetch counts and records
  const allUsers = await db.select().from(users).orderBy(desc(users.createdAt)).all();
  const allAssignments = await db.select().from(assignments).all();
  const allSubmissions = await db
    .select({
      id: submissions.id,
      assignmentId: submissions.assignmentId,
      assignmentTitle: assignments.title,
      userId: submissions.userId,
      userName: users.name,
      userUsername: users.username,
      status: submissions.status,
      score: submissions.score,
      submittedAt: submissions.submittedAt,
    })
    .from(submissions)
    .innerJoin(assignments, eq(submissions.assignmentId, assignments.id))
    .innerJoin(users, eq(submissions.userId, users.id))
    .orderBy(desc(submissions.submittedAt))
    .limit(8)
    .all();

  const totalSubsCount = (await db.select().from(submissions).all()).length;
  const allSessions = await db.select().from(attendanceSessions).all();
  const allRecords = await db.select().from(attendanceRecords).all();

  const members = allUsers.filter((u) => u.role === 'member');
  const activeAssignments = allAssignments.filter((a) => a.status === 'published');
  const pendingSubs = allSubmissions.filter((s) => s.status === 'pending');

  // Submission rate calculation
  const totalPossibleSubmissions = members.length * activeAssignments.length;
  const submissionRate =
    totalPossibleSubmissions > 0
      ? Math.min(100, Math.round((totalSubsCount / totalPossibleSubmissions) * 100))
      : 85;

  // Attendance rate calculation
  const totalAttRecords = allRecords.length;
  const presentRecords = allRecords.filter((r) => r.status === 'present').length;
  const avgAttendance =
    totalAttRecords > 0 ? Math.round((presentRecords / totalAttRecords) * 100) : 92;

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-hairline gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-text-3">
            <span>• PANEL PENGURUS EKSKUL •</span>
            <span className="text-text-3/60">/</span>
            <span>OVERVIEW SISTEM</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-text-1">
            Konsol Administrasi IT Club
          </h1>
          <p className="text-xs font-mono text-text-2 mt-1">
            AKUN: {admin.username} • AKSES: PENGURUS & PEMBINA SMKN 1 SURABAYA
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/assignments"
            className="font-mono text-xs uppercase tracking-wider px-3.5 py-2.5 bg-[#111111] text-white hover:bg-[#2E2E2E] transition-all rounded-none inline-flex items-center gap-2 shadow-sm font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Buat Tugas</span>
          </Link>
          <Link
            href="/admin/attendance"
            className="font-mono text-xs uppercase tracking-wider px-3.5 py-2.5 border border-hairline bg-surface text-text-1 hover:bg-neutral-100 transition-all rounded-none inline-flex items-center gap-2 shadow-sm font-medium"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Presensi Lab</span>
          </Link>
          <Link
            href="/admin/users"
            className="font-mono text-xs uppercase tracking-wider px-3.5 py-2.5 border border-hairline bg-surface text-text-1 hover:bg-neutral-100 transition-all rounded-none inline-flex items-center gap-2 shadow-sm font-medium"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Anggota</span>
          </Link>
        </div>
      </div>

      {/* KPI Overview Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface border border-hairline p-6 rounded-none space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs font-mono text-text-3">
            <span>TOTAL ANGGOTA</span>
            <Users className="w-4 h-4 text-brand" />
          </div>
          <div className="text-3xl font-mono text-text-1 font-semibold">
            {allUsers.length}{' '}
            <span className="text-sm font-sans text-text-3 font-normal">SISWA</span>
          </div>
          <div className="text-xs text-text-3 font-mono">
            {members.length} anggota aktif terdaftar
          </div>
        </div>

        <div className="bg-surface border border-hairline p-6 rounded-none space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs font-mono text-text-3">
            <span>TUGAS AKTIF</span>
            <BookOpen className="w-4 h-4 text-brand" />
          </div>
          <div className="text-3xl font-mono text-text-1 font-semibold">
            {activeAssignments.length}{' '}
            <span className="text-sm font-sans text-text-3 font-normal">TUGAS</span>
          </div>
          <div className="text-xs text-text-3 font-mono">
            {allAssignments.length} total materi kurikulum
          </div>
        </div>

        <div className="bg-surface border border-hairline p-6 rounded-none space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs font-mono text-text-3">
            <span>SUBMISI MASUK</span>
            <FileCheck className="w-4 h-4 text-brand" />
          </div>
          <div className="text-3xl font-mono text-text-1 font-semibold">
            {totalSubsCount}{' '}
            <span className="text-sm font-sans text-text-3 font-normal">BERKAS</span>
          </div>
          <div className="text-xs text-amber-700 font-mono font-medium">
            {pendingSubs.length} berkas perlu review nilai
          </div>
        </div>

        <div className="bg-surface border border-hairline p-6 rounded-none space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs font-mono text-text-3">
            <span>KEHADIRAN LAB</span>
            <CheckSquare className="w-4 h-4 text-brand" />
          </div>
          <div className="text-3xl font-mono text-text-1 font-semibold">
            {avgAttendance}
            <span className="text-sm font-sans text-text-3 font-normal">%</span>
          </div>
          <div className="text-xs text-emerald-700 font-mono font-medium">
            {allSessions.length} sesi pertemuan tercatat
          </div>
        </div>
      </div>

      {/* Middle Grid: Submission Rate Gauge + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Submission Rate Meter (4 cols) */}
        <div className="lg:col-span-4 bg-surface border border-hairline p-6 rounded-none space-y-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-text-3 mb-2">
              <span>TINGKAT PENGUMPULAN TUGAS</span>
              <TrendingUp className="w-4 h-4 text-brand" />
            </div>
            <h3 className="text-base font-semibold text-text-1 font-sans">
              Submission Completion Rate
            </h3>
            <p className="text-xs text-text-2 mt-1">
              Rasio persentase tugas yang berhasil dikumpulkan oleh seluruh anggota ekskul.
            </p>
          </div>

          <div className="p-6 bg-bg border border-hairline rounded-none flex flex-col items-center justify-center text-center space-y-3">
            <div className="text-5xl font-mono font-bold text-text-1 tracking-tight">
              {submissionRate}%
            </div>
            <div className="w-full bg-neutral-200 h-2.5 rounded-none overflow-hidden">
              <div
                className="bg-[#111111] h-full rounded-none transition-all duration-500"
                style={{ width: `${submissionRate}%` }}
              />
            </div>
            <p className="text-[11px] font-mono text-text-3 uppercase">
              STATUS KURIKULUM: AKTIF & TERPANTAU
            </p>
          </div>

          <div className="pt-2 border-t border-hairline flex items-center justify-between text-xs font-mono">
            <span className="text-text-3">PERLU PENILAIAN:</span>
            <Link
              href="/admin/grading"
              className="text-text-1 font-semibold hover:underline flex items-center gap-1"
            >
              <span>{pendingSubs.length} berkas antrean</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Recent Submissions Queue (8 cols) */}
        <div className="lg:col-span-8 bg-surface border border-hairline p-6 rounded-none space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-hairline">
            <div>
              <h3 className="text-base font-semibold text-text-1 font-sans">
                Aktivitas Pengumpulan Terbaru
              </h3>
              <p className="text-[10px] font-mono text-text-3 uppercase tracking-wider">
                BERKAS TUGAS YANG BARU SAJA MASUK DARI ANGGOTA
              </p>
            </div>
            <Link
              href="/admin/grading"
              className="text-xs font-mono text-text-1 hover:underline flex items-center gap-1 font-medium"
            >
              <span>Buka Panel Penilaian</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-hairline bg-neutral-50 text-[10px] uppercase text-text-3">
                  <th className="py-2.5 px-3 font-semibold">ANGGOTA</th>
                  <th className="py-2.5 px-3 font-semibold">TUGAS</th>
                  <th className="py-2.5 px-3 font-semibold">WAKTU</th>
                  <th className="py-2.5 px-3 font-semibold">STATUS</th>
                  <th className="py-2.5 px-3 font-semibold text-right">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {allSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-text-3 font-mono">
                      Belum ada aktivitas submisi tugas.
                    </td>
                  </tr>
                ) : (
                  allSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="py-2.5 px-3">
                        <div className="font-sans font-medium text-text-1">{sub.userName}</div>
                        <div className="text-[10px] text-text-3">@{sub.userUsername}</div>
                      </td>
                      <td className="py-2.5 px-3 text-text-2 font-medium">
                        {sub.assignmentTitle}
                      </td>
                      <td className="py-2.5 px-3 text-text-3 text-[11px]">
                        {new Date(sub.submittedAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-block px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-wider font-semibold rounded-none ${
                            sub.status === 'graded'
                              ? 'bg-emerald-100 text-emerald-800'
                              : sub.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-neutral-100 text-neutral-800'
                          }`}
                        >
                          {sub.status === 'graded' ? `${sub.score} Poin` : sub.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <Link
                          href="/admin/grading"
                          className="text-[11px] font-mono text-text-1 hover:underline font-semibold"
                        >
                          Review →
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* User Accounts Overview Table */}
      <div className="bg-surface border border-hairline p-6 rounded-none space-y-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-hairline-soft">
          <div>
            <h2 className="text-lg font-semibold text-text-1 font-sans">
              Daftar Anggota & Pengurus Ekskul Terdaftar
            </h2>
            <p className="text-xs font-mono text-text-3 mt-0.5 uppercase tracking-wider">
              AKUN SISWA AKTIF IT CLUB SMK NEGERI 1 SURABAYA
            </p>
          </div>
          <Link
            href="/admin/users"
            className="text-xs font-mono text-text-1 hover:underline flex items-center gap-1 font-medium"
          >
            <span>Kelola Semua Pengguna</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-hairline text-text-3 bg-neutral-50 text-[10px] uppercase">
                <th className="py-3 px-4 font-semibold">NAMA LENGKAP</th>
                <th className="py-3 px-4 font-semibold">USERNAME</th>
                <th className="py-3 px-4 font-semibold">PERAN</th>
                <th className="py-3 px-4 font-semibold">KELAS / DIVISI</th>
                <th className="py-3 px-4 font-semibold">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {allUsers.slice(0, 6).map((u) => (
                <tr key={u.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="py-3.5 px-4 text-text-1 font-sans font-medium">
                    {u.name}
                  </td>
                  <td className="py-3.5 px-4 text-text-2">@{u.username}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-none text-[10px] tracking-wider uppercase font-semibold ${
                        u.role === 'admin'
                          ? 'bg-[#111111] text-white'
                          : 'bg-neutral-100 text-neutral-800 border border-hairline'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-text-2">
                    {u.className || 'Pengurus Inti'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                      <span className="w-1.5 h-1.5 rounded-none bg-emerald-600 inline-block" />
                      <span>Aktif</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
