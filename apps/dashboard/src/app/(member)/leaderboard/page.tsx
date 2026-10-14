import React from 'react';
import { requireUser } from '@/lib/permissions';
import { getFullLeaderboard } from '@/lib/points';
import { Trophy, Award, Medal, CheckCircle2, Star } from 'lucide-react';

export default async function LeaderboardPage() {
  const user = await requireUser();
  const leaderboard = await getFullLeaderboard();

  const top1 = leaderboard[0];
  const top2 = leaderboard[1];
  const top3 = leaderboard[2];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="pb-6 border-b border-hairline">
        <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-text-3 mb-1.5">
          <span>• CAPAIAN & PRESTASI •</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-text-1">
          Papan Peringkat Anggota (Leaderboard)
        </h1>
        <p className="text-xs font-mono text-text-2 mt-1">
          PERINGKAT DIHITUNG DARI AKUMULASI NILAI TUGAS, KETEPATAN WAKTU, DAN KONSISTENSI PRESENSI LAB
        </p>
      </div>

      {/* Top 3 Podium */}
      {leaderboard.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          {/* Rank 2 */}
          <div className="bg-surface border border-hairline p-6 rounded-none shadow-sm space-y-3 order-2 md:order-1 text-center">
            <div className="size-10 bg-neutral-200 text-neutral-800 font-mono text-base font-bold flex items-center justify-center mx-auto rounded-none">
              02
            </div>
            <div>
              <p className="font-semibold text-text-1 text-base leading-snug">
                {top2?.name}
              </p>
              <p className="font-mono text-xs text-text-3 mt-0.5">
                {top2?.className || 'Anggota Aktif'}
              </p>
            </div>
            <div className="pt-2 border-t border-hairline font-mono">
              <span className="text-2xl font-bold text-text-1">{top2?.totalPoints}</span>{' '}
              <span className="text-xs text-text-3">PTS</span>
            </div>
            <p className="font-mono text-[10px] text-text-3 uppercase">
              {top2?.submissionCount} Tugas • {top2?.attendanceRate}% Absen
            </p>
          </div>

          {/* Rank 1 (Elevated) */}
          <div className="bg-surface border-2 border-brand p-8 rounded-none shadow-float space-y-4 order-1 md:order-2 text-center relative bg-gradient-to-b from-brand-soft/20 to-surface">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-neutral-900 text-white font-mono text-[10px] uppercase tracking-widest px-3 py-1 font-bold">
              ★ JUARA 1 KLASEMEN ★
            </div>
            <div className="size-14 bg-neutral-900 text-white font-mono text-xl font-bold flex items-center justify-center mx-auto rounded-none shadow-sm">
              01
            </div>
            <div>
              <p className="font-semibold text-text-1 text-lg leading-snug">
                {top1?.name}
              </p>
              <p className="font-mono text-xs text-brand font-semibold mt-0.5">
                {top1?.className || 'Anggota Aktif'}
              </p>
            </div>
            <div className="pt-3 border-t border-hairline font-mono">
              <span className="text-3xl font-bold text-text-1">{top1?.totalPoints}</span>{' '}
              <span className="text-sm text-text-3">PTS</span>
            </div>
            <p className="font-mono text-[11px] text-emerald-700 uppercase font-semibold">
              {top1?.submissionCount} Tugas Terkumpul • {top1?.attendanceRate}% Kehadiran
            </p>
          </div>

          {/* Rank 3 */}
          <div className="bg-surface border border-hairline p-6 rounded-none shadow-sm space-y-3 order-3 text-center">
            <div className="size-10 bg-neutral-100 text-neutral-700 font-mono text-base font-bold flex items-center justify-center mx-auto rounded-none">
              03
            </div>
            <div>
              <p className="font-semibold text-text-1 text-base leading-snug">
                {top3?.name}
              </p>
              <p className="font-mono text-xs text-text-3 mt-0.5">
                {top3?.className || 'Anggota Aktif'}
              </p>
            </div>
            <div className="pt-2 border-t border-hairline font-mono">
              <span className="text-2xl font-bold text-text-1">{top3?.totalPoints}</span>{' '}
              <span className="text-xs text-text-3">PTS</span>
            </div>
            <p className="font-mono text-[10px] text-text-3 uppercase">
              {top3?.submissionCount} Tugas • {top3?.attendanceRate}% Absen
            </p>
          </div>
        </div>
      )}

      {/* Full Leaderboard Table */}
      <div className="bg-surface border border-hairline rounded-none shadow-sm overflow-hidden">
        <div className="p-5 border-b border-hairline flex items-center justify-between">
          <h2 className="font-semibold text-base text-text-1">
            Seluruh Peringkat Anggota Aktif ({leaderboard.length})
          </h2>
          <span className="font-mono text-xs text-text-3 uppercase tracking-wider">
            SINKRONISASI REAL-TIME
          </span>
        </div>

        {leaderboard.length === 0 ? (
          <div className="p-12 text-center">
            <Trophy className="size-10 text-text-3/40 mx-auto mb-3" />
            <p className="font-semibold text-text-1 text-sm">Belum Ada Anggota Terdaftar</p>
            <p className="text-xs text-text-3 font-mono mt-1">
              Admin dapat menambahkan akun anggota baru melalui Konsol Admin &gt; Manajemen User.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="bg-neutral-50 border-b border-hairline text-text-3 text-[10px] uppercase tracking-wider">
                  <th className="py-3 px-4">RANK</th>
                  <th className="py-3 px-4">NAMA LENGKAP</th>
                  <th className="py-3 px-4">KELAS</th>
                  <th className="py-3 px-4 text-center">TUGAS SUBMIT</th>
                  <th className="py-3 px-4 text-center">KEHADIRAN LAB</th>
                  <th className="py-3 px-4 text-right">TOTAL POIN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {leaderboard.map((member) => {
                  const isCurrentUser = member.userId === user.id;

                  return (
                    <tr
                      key={member.userId}
                      className={`transition-colors ${
                        isCurrentUser
                          ? 'bg-neutral-900 text-white font-semibold'
                          : 'hover:bg-neutral-50 text-text-1'
                      }`}
                    >
                      <td className="py-3 px-4 font-bold">
                        {member.rank < 10 ? `0${member.rank}` : member.rank}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span>{member.name}</span>
                          {isCurrentUser && (
                            <span className="px-2 py-0.5 bg-emerald-400 text-black text-[9px] font-bold uppercase rounded-none">
                              KAMU
                            </span>
                          )}
                        </div>
                      </td>
                      <td className={`py-3 px-4 ${isCurrentUser ? 'text-neutral-300' : 'text-text-2'}`}>
                        {member.className || 'Anggota'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {member.submissionCount}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {member.attendanceRate}%
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-sm">
                        {member.totalPoints} PTS
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
