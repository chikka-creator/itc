'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Clock, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

interface AssignmentItem {
  id: string;
  title: string;
  description: string | null;
  deadline: Date;
  deadlineStr: string;
  maxScore: number;
  categoryName: string;
  isSubmitted: boolean;
  isOverdue: boolean;
  submissionStatus: string | null;
  score: number | null;
}

export function AssignmentsClient({
  assignments,
}: {
  assignments: AssignmentItem[];
}) {
  const [tab, setTab] = useState<'all' | 'active' | 'completed' | 'overdue'>('all');
  const [search, setSearch] = useState('');

  const filtered = assignments.filter((item) => {
    // Search filter
    if (
      search &&
      !item.title.toLowerCase().includes(search.toLowerCase()) &&
      !item.categoryName.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }

    // Tab filter
    if (tab === 'active') return !item.isSubmitted && !item.isOverdue;
    if (tab === 'completed') return item.isSubmitted;
    if (tab === 'overdue') return !item.isSubmitted && item.isOverdue;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-1 bg-surface border border-hairline p-1 rounded-none overflow-x-auto">
          {[
            { id: 'all', label: `Semua (${assignments.length})` },
            {
              id: 'active',
              label: `Aktif (${assignments.filter((a) => !a.isSubmitted && !a.isOverdue).length})`,
            },
            {
              id: 'completed',
              label: `Selesai (${assignments.filter((a) => a.isSubmitted).length})`,
            },
            {
              id: 'overdue',
              label: `Terlambat (${assignments.filter((a) => !a.isSubmitted && a.isOverdue).length})`,
            },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as typeof tab)}
              className={`px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors rounded-none whitespace-nowrap ${
                tab === t.id
                  ? 'bg-[#111111] text-white font-medium'
                  : 'text-text-2 hover:text-text-1 hover:bg-neutral-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-3" />
          <input
            type="text"
            placeholder="Cari tugas / kategori..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-surface border border-hairline text-xs font-mono rounded-none focus:outline-none focus:border-text-1 text-text-1 placeholder:text-text-3"
          />
        </div>
      </div>

      {/* Assignments Grid / List */}
      {filtered.length === 0 ? (
        <div className="bg-surface border border-hairline p-12 text-center rounded-none shadow-sm space-y-2">
          <p className="font-mono text-xs text-text-3 uppercase tracking-wider">
            Tidak ada tugas yang sesuai filter.
          </p>
          <button
            onClick={() => {
              setTab('all');
              setSearch('');
            }}
            className="text-xs font-mono text-brand hover:underline font-semibold"
          >
            Reset filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-surface border border-hairline p-5 rounded-none shadow-sm flex flex-col justify-between space-y-4 hover:border-text-1 transition-all"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-0.5 bg-brand-soft text-brand font-bold border border-brand/20 rounded-none">
                    {item.categoryName}
                  </span>

                  {item.isSubmitted ? (
                    <span className="font-mono text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-none font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{item.score !== null ? `DINILAI: ${item.score} PTS` : 'TERKUMPUL'}</span>
                    </span>
                  ) : item.isOverdue ? (
                    <span className="font-mono text-[10px] text-red-800 bg-red-100 px-2 py-0.5 rounded-none font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>DEADLINE LEWAT</span>
                    </span>
                  ) : (
                    <span className="font-mono text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded-none font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>AKTIF</span>
                    </span>
                  )}
                </div>

                <h3 className="text-base font-semibold text-text-1 leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-text-2 line-clamp-2 leading-relaxed">
                  {item.description || 'Tidak ada deskripsi detail tambahan.'}
                </p>
              </div>

              <div className="pt-3 border-t border-hairline flex items-center justify-between">
                <div className="font-mono text-[11px]">
                  <span className="text-text-3">BATAS: </span>
                  <span className="font-semibold text-text-1">{item.deadlineStr}</span>
                </div>

                <Link
                  href={`/assignments/${item.id}`}
                  className="font-mono text-[10px] uppercase tracking-wider px-3.5 py-1.5 bg-[#111111] text-white hover:bg-[#2E2E2E] transition-colors rounded-none flex items-center gap-1.5"
                >
                  <span>{item.isSubmitted ? 'Lihat Submisi' : 'Kumpulkan'}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
