'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Users,
  FileCheck,
  Award,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

interface MemberPerfItem {
  id: string;
  name: string;
  username: string;
  className: string;
  submissionsCount: number;
  avgScore: number;
  attendanceRate: number;
  totalPoints: number;
}

interface AssignmentPerfItem {
  id: string;
  title: string;
  categoryName: string;
  categoryColor: string;
  deadline: Date;
  submissionsCount: number;
  avgScore: number;
  onTimeRate: number;
}

interface ReportsClientProps {
  membersData: MemberPerfItem[];
  assignmentsData: AssignmentPerfItem[];
  summary: {
    totalMembers: number;
    totalSubmissions: number;
    avgScore: number;
    avgAttendance: number;
  };
}

export function ReportsClient({
  membersData,
  assignmentsData,
  summary,
}: ReportsClientProps) {
  const [activeTab, setActiveTab] = useState<'members' | 'assignments'>('members');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-hairline gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-text-3">
            <span>• ANALITIK & EVALUASI •</span>
            <span className="text-text-3/60">/</span>
            <span>LAPORAN KINERJA EKSKUL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-text-1">
            Rekap & Laporan Data Ekskul
          </h1>
          <p className="text-xs font-mono text-text-2 mt-1">
            STATISTIK AKUMULATIF SISWA & PENUGASAN • SMKN 1 SURABAYA
          </p>
        </div>

        {/* CSV Export Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href="/api/admin/reports/export?type=members"
            download
            className="font-mono text-xs uppercase tracking-wider px-3.5 py-2.5 bg-[#111111] text-white hover:bg-[#2E2E2E] transition-all rounded-none inline-flex items-center gap-2 shadow-sm font-semibold"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Anggota (CSV)</span>
          </a>
          <a
            href="/api/admin/reports/export?type=assignments"
            download
            className="font-mono text-xs uppercase tracking-wider px-3.5 py-2.5 border border-hairline bg-surface text-text-1 hover:bg-neutral-100 transition-all rounded-none inline-flex items-center gap-2 shadow-sm font-medium"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Tugas (CSV)</span>
          </a>
        </div>
      </div>

      {/* KPI Summary Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface border border-hairline p-6 rounded-none space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs font-mono text-text-3">
            <span>TOTAL ANGGOTA</span>
            <Users className="w-4 h-4 text-brand" />
          </div>
          <div className="text-3xl font-mono text-text-1 font-semibold">
            {summary.totalMembers}{' '}
            <span className="text-sm font-sans text-text-3 font-normal">SISWA</span>
          </div>
          <div className="text-xs text-text-3 font-mono">Anggota aktif terdaftar</div>
        </div>

        <div className="bg-surface border border-hairline p-6 rounded-none space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs font-mono text-text-3">
            <span>SUBMISI TUGAS</span>
            <FileCheck className="w-4 h-4 text-brand" />
          </div>
          <div className="text-3xl font-mono text-text-1 font-semibold">
            {summary.totalSubmissions}{' '}
            <span className="text-sm font-sans text-text-3 font-normal">BERKAS</span>
          </div>
          <div className="text-xs text-text-3 font-mono">Total berkas dikumpulkan</div>
        </div>

        <div className="bg-surface border border-hairline p-6 rounded-none space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs font-mono text-text-3">
            <span>RATA-RATA NILAI</span>
            <Award className="w-4 h-4 text-brand" />
          </div>
          <div className="text-3xl font-mono text-text-1 font-semibold">
            {summary.avgScore}{' '}
            <span className="text-sm font-sans text-text-3 font-normal">/ 100</span>
          </div>
          <div className="text-xs text-emerald-700 font-mono font-medium">
            Rata-rata kumulatif tugas
          </div>
        </div>

        <div className="bg-surface border border-hairline p-6 rounded-none space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs font-mono text-text-3">
            <span>KEHADIRAN LAB</span>
            <CheckCircle2 className="w-4 h-4 text-brand" />
          </div>
          <div className="text-3xl font-mono text-text-1 font-semibold">
            {summary.avgAttendance}
            <span className="text-sm font-sans text-text-3 font-normal">%</span>
          </div>
          <div className="text-xs text-emerald-700 font-mono font-medium">
            Rata-rata presensi lab
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center justify-between border-b border-hairline pb-3">
        <div className="inline-flex border border-hairline rounded-none bg-surface p-0.5">
          <button
            onClick={() => setActiveTab('members')}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all rounded-none ${
              activeTab === 'members'
                ? 'bg-[#111111] text-white font-semibold'
                : 'text-text-2 hover:text-text-1'
            }`}
          >
            Rekap Kinerja Anggota ({membersData.length})
          </button>
          <button
            onClick={() => setActiveTab('assignments')}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all rounded-none ${
              activeTab === 'assignments'
                ? 'bg-[#111111] text-white font-semibold'
                : 'text-text-2 hover:text-text-1'
            }`}
          >
            Rekap Tingkat Penugasan ({assignmentsData.length})
          </button>
        </div>
      </div>

      {/* Active Tab View */}
      {activeTab === 'members' ? (
        <div className="bg-surface border border-hairline rounded-none shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-hairline bg-neutral-50 text-[10px] uppercase text-text-3">
                  <th className="py-3.5 px-4 font-semibold w-12">#</th>
                  <th className="py-3.5 px-4 font-semibold">NAMA ANGGOTA</th>
                  <th className="py-3.5 px-4 font-semibold">USERNAME</th>
                  <th className="py-3.5 px-4 font-semibold">KELAS</th>
                  <th className="py-3.5 px-4 font-semibold text-center">TUGAS DISUBMIT</th>
                  <th className="py-3.5 px-4 font-semibold text-center">RATA-RATA NILAI</th>
                  <th className="py-3.5 px-4 font-semibold text-center">PRESENSI LAB</th>
                  <th className="py-3.5 px-4 font-semibold text-right">TOTAL POIN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {membersData.map((m, idx) => (
                  <tr key={m.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3.5 px-4 text-text-3">{idx + 1}</td>
                    <td className="py-3.5 px-4 font-sans font-medium text-text-1">
                      {m.name}
                    </td>
                    <td className="py-3.5 px-4 text-text-2">@{m.username}</td>
                    <td className="py-3.5 px-4 text-text-2">{m.className}</td>
                    <td className="py-3.5 px-4 text-center font-semibold text-text-1">
                      {m.submissionsCount}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-semibold text-text-1">{m.avgScore}</span>
                      <span className="text-[10px] text-text-3"> / 100</span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-semibold text-emerald-700">
                      {m.attendanceRate}%
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-text-1">
                      {m.totalPoints} PTS
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-surface border border-hairline rounded-none shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-hairline bg-neutral-50 text-[10px] uppercase text-text-3">
                  <th className="py-3.5 px-4 font-semibold w-12">#</th>
                  <th className="py-3.5 px-4 font-semibold">JUDUL PENUGASAN</th>
                  <th className="py-3.5 px-4 font-semibold">KATEGORI</th>
                  <th className="py-3.5 px-4 font-semibold">DEADLINE</th>
                  <th className="py-3.5 px-4 font-semibold text-center">TOTAL SUBMISI</th>
                  <th className="py-3.5 px-4 font-semibold text-center">RATA-RATA NILAI</th>
                  <th className="py-3.5 px-4 font-semibold text-right">TEPAT WAKTU</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {assignmentsData.map((a, idx) => (
                  <tr key={a.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3.5 px-4 text-text-3">{idx + 1}</td>
                    <td className="py-3.5 px-4 font-sans font-medium text-text-1">
                      {a.title}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-hairline rounded-none text-[10px] font-mono uppercase bg-bg">
                        <span
                          className="size-2 rounded-none inline-block"
                          style={{ backgroundColor: a.categoryColor }}
                        />
                        <span>{a.categoryName}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-text-2">
                      {new Date(a.deadline).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-center font-semibold text-text-1">
                      {a.submissionsCount}
                    </td>
                    <td className="py-3.5 px-4 text-center font-semibold text-text-1">
                      {a.avgScore} / 100
                    </td>
                    <td className="py-3.5 px-4 text-right font-semibold text-emerald-700">
                      {a.onTimeRate}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
