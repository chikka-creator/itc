import * as React from 'react';
import type { Dictionary } from '@/lib/i18n';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Button } from '@/components/ui/Button';
import {
  getUpcomingMeetings,
  getPublicLeaderboard,
  getPublicStats,
  MeetingPreview,
  LeaderboardEntry,
  PublicStats,
} from '@/lib/data';

export async function ScheduleAndLeaderboard({ dict }: { dict: Dictionary }) {
  const [meetings, leaderboard, stats]: [MeetingPreview[], LeaderboardEntry[], PublicStats] =
    await Promise.all([
      getUpcomingMeetings(3),
      getPublicLeaderboard(5),
      getPublicStats(),
    ]);

  return (
    <section id="schedule" className="bg-bg py-24 md:py-36 border-t border-hairline/60">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16 md:mb-20">
          <div className="lg:col-span-7">
            <Eyebrow variant="asterisk">DATA & KEGIATAN TERKINI</Eyebrow>
            <h2 className="mt-4 text-[clamp(2rem,4vw,3.25rem)] font-semibold tracking-[-0.02em] leading-[1.12] text-text-1">
              Jadwal Pertemuan & Papan Peringkat Terbuka
            </h2>
          </div>
          <div className="lg:col-span-5 flex flex-col justify-end">
            <p className="text-body-lg text-text-2 leading-relaxed mb-6">
              Data terintegrasi langsung dari database sistem. Pantau agenda pertemuan ekskul mendatang dan posisi peringkat anggota secara transparan.
            </p>
            <div>
              <Button variant="solid" href="http://localhost:3001/dashboard">
                Lihat Semua di Dashboard
              </Button>
            </div>
          </div>
        </div>

        {/* 2-Column Split: Upcoming Meetings vs Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Column 1: Upcoming Meetings Schedule */}
          <div className="lg:col-span-6 bg-surface rounded-none border border-hairline p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-5 mb-6 border-b border-hairline-soft">
              <div className="flex items-center gap-2.5">
                <span className="size-2 rounded-none bg-emerald-500 animate-pulse" />
                <h3 className="text-[18px] font-semibold text-text-1">Agenda Pertemuan Ekskul</h3>
              </div>
              <span className="font-mono text-[11px] text-text-3 uppercase tracking-wider bg-bg px-2.5 py-1 rounded-none border border-hairline">
                {stats.meetingsCount} SESI TERCATAT
              </span>
            </div>

            <div className="space-y-4">
              {meetings.map((m) => (
                <div
                  key={m.id}
                  className="group p-4 rounded-none bg-bg/70 border border-hairline/70 hover:bg-bg hover:border-hairline transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-brand font-bold bg-brand-soft px-2.5 py-0.5 rounded-none">
                      PERTEMUAN #{m.meetingNo}
                    </span>
                    <span className="font-mono text-[11px] text-text-3">
                      {m.date}
                    </span>
                  </div>
                  <h4 className="text-[15px] font-semibold text-text-1 group-hover:text-brand transition-colors">
                    {m.title || `Sesi Pertemuan Ke-${m.meetingNo}`}
                  </h4>
                  {m.notes && (
                    <p className="mt-1.5 text-[13px] text-text-2 leading-relaxed">
                      {m.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-hairline-soft flex items-center justify-between font-mono text-[11px] text-text-3">
              <span>LOKASI: LAB KOMPUTER SMKN 1</span>
              <span className="text-text-1 font-medium">JADWAL MINGGUAN</span>
            </div>
          </div>

          {/* Column 2: Public Leaderboard Top 5 */}
          <div className="lg:col-span-6 bg-surface rounded-none border border-hairline p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-5 mb-6 border-b border-hairline-soft">
              <div className="flex items-center gap-2.5">
                <span className="text-brand text-lg">★</span>
                <h3 className="text-[18px] font-semibold text-text-1">Top Leaderboard Anggota</h3>
              </div>
              <span className="font-mono text-[11px] text-text-3 uppercase tracking-wider bg-bg px-2.5 py-1 rounded-none border border-hairline">
                {stats.membersCount} SISWA AKTIF
              </span>
            </div>

            <div className="space-y-3">
              {leaderboard.map((item) => (
                <div
                  key={item.rank}
                  className={`flex items-center justify-between p-3.5 rounded-none border transition-all ${
                    item.rank === 1
                      ? 'bg-brand-soft/40 border-brand/30 shadow-sm'
                      : 'bg-bg/70 border-hairline/70 hover:bg-bg'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span
                      className={`size-7 rounded-none flex items-center justify-center font-mono text-[12px] font-bold ${
                        item.rank === 1
                          ? 'bg-neutral-900 text-white'
                          : 'bg-surface text-text-2 border border-hairline'
                      }`}
                    >
                      {item.rank < 10 ? `0${item.rank}` : item.rank}
                    </span>
                    <div>
                      <p className="text-[14px] font-semibold text-text-1 leading-snug">
                        {item.name}
                      </p>
                      <p className="font-mono text-[10px] text-text-3 uppercase tracking-wider">
                        {item.className || 'Anggota Aktif'} • {item.submissionsCount} Tugas Terkumpul
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-[14px] font-bold text-text-1">
                      {item.points} PTS
                    </span>
                    {item.rank === 1 && (
                      <p className="font-mono text-[9px] uppercase tracking-wider text-brand font-bold">
                        LEADER
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-hairline-soft flex items-center justify-between font-mono text-[11px] text-text-3">
              <span>DIHITUNG DARI NILAI & PRESENSI</span>
              <a
                href="http://localhost:3001/dashboard"
                className="text-text-1 font-medium hover:underline"
              >
                Papan Peringkat Lengkap →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
