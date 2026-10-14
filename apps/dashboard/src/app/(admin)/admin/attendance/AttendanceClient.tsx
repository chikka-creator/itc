'use client';

import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Plus,
  Calendar,
  CheckCircle2,
  X,
  Users,
  Save,
  Check,
  AlertCircle,
} from 'lucide-react';

interface AttendanceSession {
  id: string;
  meetingNo: number;
  title?: string | null;
  date: string;
  notes?: string | null;
}

interface AttendanceRecord {
  id: string;
  sessionId: string;
  userId: string;
  status: 'present' | 'absent' | 'excused';
}

interface MemberUser {
  id: string;
  name: string;
  username: string;
  className?: string | null;
}

interface AttendanceClientProps {
  initialSessions: AttendanceSession[];
  initialRecords: AttendanceRecord[];
  members: MemberUser[];
}

export function AttendanceClient({
  initialSessions,
  initialRecords,
  members,
}: AttendanceClientProps) {
  const [sessions, setSessions] = useState<AttendanceSession[]>(initialSessions);
  const [records, setRecords] = useState<AttendanceRecord[]>(initialRecords);

  const [selectedSessionId, setSelectedSessionId] = useState<string>(
    initialSessions[0]?.id || ''
  );

  // Modal create session
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [nextMeetingNo, setNextMeetingNo] = useState(
    initialSessions.length > 0
      ? Math.max(...initialSessions.map((s) => s.meetingNo)) + 1
      : 1
  );

  const [newSessionData, setNewSessionData] = useState({
    meetingNo: nextMeetingNo,
    title: '',
    date: new Date().toISOString().slice(0, 10),
    notes: 'Lab Komputer 2, SMKN 1 Surabaya',
  });

  // Current session's attendance map: userId -> status
  const [attendanceMap, setAttendanceMap] = useState<
    Record<string, 'present' | 'absent' | 'excused'>
  >({});

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // When selectedSessionId changes, populate attendanceMap
  useEffect(() => {
    if (!selectedSessionId) return;

    const sessionRecs = records.filter((r) => r.sessionId === selectedSessionId);
    const map: Record<string, 'present' | 'absent' | 'excused'> = {};

    members.forEach((m) => {
      const found = sessionRecs.find((r) => r.userId === m.id);
      map[m.id] = found ? found.status : 'present';
    });

    setAttendanceMap(map);
  }, [selectedSessionId, records, members]);

  const currentSession = sessions.find((s) => s.id === selectedSessionId);

  const handleMarkAll = (status: 'present' | 'absent' | 'excused') => {
    const nextMap: Record<string, 'present' | 'absent' | 'excused'> = {};
    members.forEach((m) => {
      nextMap[m.id] = status;
    });
    setAttendanceMap(nextMap);
  };

  const handleSetUserStatus = (
    userId: string,
    status: 'present' | 'absent' | 'excused'
  ) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [userId]: status,
    }));
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      // Default all members present for the new session
      const initialMemberRecords = members.map((m) => ({
        userId: m.id,
        status: 'present' as const,
      }));

      const res = await fetch('/api/admin/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meetingNo: newSessionData.meetingNo,
          title: newSessionData.title || `Pertemuan #${newSessionData.meetingNo}`,
          date: newSessionData.date,
          notes: newSessionData.notes,
          records: initialMemberRecords,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal membuat sesi pertemuan');
      }

      setSuccessMsg(`Sesi Pertemuan #${newSessionData.meetingNo} berhasil dibuat.`);
      setIsCreateOpen(false);

      // Refresh data
      const refreshRes = await fetch('/api/admin/attendance');
      if (refreshRes.ok) {
        const refreshData = await refreshRes.json();
        setSessions(refreshData.sessions);
        setRecords(refreshData.records);
        setSelectedSessionId(data.sessionId);
        setNextMeetingNo(newSessionData.meetingNo + 1);
      }

      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAttendance = async () => {
    if (!selectedSessionId) return;
    setErrorMsg('');
    setLoading(true);

    try {
      const recordsToSave = members.map((m) => ({
        userId: m.id,
        status: attendanceMap[m.id] || 'present',
      }));

      const res = await fetch('/api/admin/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: selectedSessionId,
          records: recordsToSave,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menyimpan absensi');
      }

      setSuccessMsg('Presensi kehadiran anggota berhasil disimpan.');

      // Refresh records
      const refreshRes = await fetch('/api/admin/attendance');
      if (refreshRes.ok) {
        const refreshData = await refreshRes.json();
        setRecords(refreshData.records);
      }

      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Stats calculation for current session
  const presentCount = members.filter((m) => attendanceMap[m.id] === 'present').length;
  const excusedCount = members.filter((m) => attendanceMap[m.id] === 'excused').length;
  const absentCount = members.filter((m) => attendanceMap[m.id] === 'absent').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-hairline gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-text-3">
            <span>• MANAJEMEN KEGIATAN •</span>
            <span className="text-text-3/60">/</span>
            <span>PRESENSI PERTEMUAN LAB</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-text-1">
            Absensi Pertemuan Ekskul
          </h1>
          <p className="text-xs font-mono text-text-2 mt-1">
            TOTAL {sessions.length} SESI PERTEMUAN TERCATAT • SMKN 1 SURABAYA
          </p>
        </div>

        <button
          onClick={() => {
            setNewSessionData({
              meetingNo: nextMeetingNo,
              title: `Pertemuan #${nextMeetingNo}`,
              date: new Date().toISOString().slice(0, 10),
              notes: 'Lab Komputer 2, SMKN 1 Surabaya',
            });
            setErrorMsg('');
            setIsCreateOpen(true);
          }}
          className="font-mono text-xs uppercase tracking-wider px-4 py-2.5 bg-[#111111] text-white hover:bg-[#2E2E2E] transition-all rounded-none inline-flex items-center gap-2 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Sesi Pertemuan Baru</span>
        </button>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono rounded-none flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-600 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Session Selector & Quick Stats */}
      <div className="bg-surface border border-hairline p-5 rounded-none space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase text-text-3 font-semibold">
              PILIH SESI PERTEMUAN:
            </label>
            <div className="flex items-center gap-3">
              <select
                value={selectedSessionId}
                onChange={(e) => setSelectedSessionId(e.target.value)}
                className="px-3 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono rounded-none focus:outline-none focus:border-[#111111] min-w-[280px]"
              >
                {sessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    Pertemuan #{s.meetingNo} — {s.title || 'Sesi Ekskul'} ({s.date})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {currentSession && (
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-none">
                <span className="font-bold">{presentCount}</span> HADIR
              </div>
              <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-none">
                <span className="font-bold">{excusedCount}</span> IZIN
              </div>
              <div className="p-2.5 bg-red-50 border border-red-200 text-red-800 rounded-none">
                <span className="font-bold">{absentCount}</span> ALPA
              </div>
            </div>
          )}
        </div>

        {currentSession && currentSession.notes && (
          <div className="text-xs font-mono text-text-3 border-t border-hairline-soft pt-3">
            CATATAN LAB: {currentSession.notes}
          </div>
        )}
      </div>

      {/* Member Attendance Checklist */}
      {currentSession ? (
        <div className="bg-surface border border-hairline rounded-none shadow-sm overflow-hidden space-y-0">
          <div className="p-4 border-b border-hairline bg-neutral-50/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-mono text-text-1 font-semibold">
              <Users className="w-4 h-4 text-brand" />
              <span>DAFTAR ANGGOTA ({members.length} SISWA)</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase text-text-3">AKSI CEPAT:</span>
              <button
                type="button"
                onClick={() => handleMarkAll('present')}
                className="px-2.5 py-1 text-[10px] font-mono uppercase bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-none hover:bg-emerald-200 transition-colors"
              >
                Semua Hadir
              </button>
              <button
                type="button"
                onClick={() => handleMarkAll('absent')}
                className="px-2.5 py-1 text-[10px] font-mono uppercase bg-red-100 text-red-800 border border-red-300 rounded-none hover:bg-red-200 transition-colors"
              >
                Semua Alpa
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-hairline bg-neutral-50 text-[10px] uppercase text-text-3">
                  <th className="py-3 px-4 font-semibold w-12">#</th>
                  <th className="py-3 px-4 font-semibold">NAMA LENGKAP</th>
                  <th className="py-3 px-4 font-semibold">USERNAME</th>
                  <th className="py-3 px-4 font-semibold">KELAS / DIVISI</th>
                  <th className="py-3 px-4 font-semibold text-right">STATUS KEHADIRAN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {members.map((member, idx) => {
                  const status = attendanceMap[member.id] || 'present';

                  return (
                    <tr key={member.id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="py-3 px-4 text-text-3">{idx + 1}</td>
                      <td className="py-3 px-4 font-sans font-medium text-text-1">
                        {member.name}
                      </td>
                      <td className="py-3 px-4 text-text-2">@{member.username}</td>
                      <td className="py-3 px-4 text-text-2">
                        {member.className || <span className="text-text-3/60 italic">—</span>}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex border border-hairline rounded-none bg-bg p-0.5">
                          <button
                            type="button"
                            onClick={() => handleSetUserStatus(member.id, 'present')}
                            className={`px-3 py-1 text-[10px] font-mono uppercase tracking-wider transition-all rounded-none ${
                              status === 'present'
                                ? 'bg-emerald-600 text-white font-bold shadow-sm'
                                : 'text-text-3 hover:text-text-1'
                            }`}
                          >
                            Hadir
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSetUserStatus(member.id, 'excused')}
                            className={`px-3 py-1 text-[10px] font-mono uppercase tracking-wider transition-all rounded-none ${
                              status === 'excused'
                                ? 'bg-amber-600 text-white font-bold shadow-sm'
                                : 'text-text-3 hover:text-text-1'
                            }`}
                          >
                            Izin
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSetUserStatus(member.id, 'absent')}
                            className={`px-3 py-1 text-[10px] font-mono uppercase tracking-wider transition-all rounded-none ${
                              status === 'absent'
                                ? 'bg-red-600 text-white font-bold shadow-sm'
                                : 'text-text-3 hover:text-text-1'
                            }`}
                          >
                            Alpa
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-hairline bg-surface flex items-center justify-between">
            <span className="text-xs font-mono text-text-3">
              Perubahan belum tersimpan sampai Anda menekan tombol simpan.
            </span>

            <button
              onClick={handleSaveAttendance}
              disabled={loading}
              className="px-6 py-2.5 bg-[#111111] text-white hover:bg-[#2E2E2E] text-xs font-mono uppercase tracking-wider rounded-none transition-colors disabled:opacity-50 inline-flex items-center gap-2 shadow-sm font-semibold"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Menyimpan...' : 'Simpan Presensi Pertemuan'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-surface border border-hairline p-12 text-center text-text-3 font-mono text-xs rounded-none">
          Belum ada sesi pertemuan. Klik tombol "Buat Sesi Pertemuan Baru" di atas untuk memulai.
        </div>
      )}

      {/* Modal: Create Session */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-hairline max-w-md w-full p-6 rounded-none space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-hairline">
              <div>
                <h3 className="text-lg font-semibold text-text-1 font-sans">
                  Buat Sesi Pertemuan Baru
                </h3>
                <p className="text-[10px] font-mono text-text-3 uppercase tracking-wider">
                  AGENDA LAB IT CLUB SMKN 1 SURABAYA
                </p>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-text-3 hover:text-text-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-mono rounded-none">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateSession} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-text-3 mb-1">
                    PERTEMUAN KE- *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newSessionData.meetingNo}
                    onChange={(e) =>
                      setNewSessionData({
                        ...newSessionData,
                        meetingNo: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono rounded-none focus:outline-none focus:border-[#111111]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-text-3 mb-1">
                    TANGGAL *
                  </label>
                  <input
                    type="date"
                    required
                    value={newSessionData.date}
                    onChange={(e) =>
                      setNewSessionData({
                        ...newSessionData,
                        date: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono rounded-none focus:outline-none focus:border-[#111111]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-text-3 mb-1">
                  TOPIK / MATERI PERTEMUAN
                </label>
                <input
                  type="text"
                  value={newSessionData.title}
                  onChange={(e) =>
                    setNewSessionData({
                      ...newSessionData,
                      title: e.target.value,
                    })
                  }
                  placeholder="e.g. Pertemuan 06: Git Collaboration & PR"
                  className="w-full px-3 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono rounded-none focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-text-3 mb-1">
                  LOKASI / CATATAN RUANGAN
                </label>
                <input
                  type="text"
                  value={newSessionData.notes}
                  onChange={(e) =>
                    setNewSessionData({
                      ...newSessionData,
                      notes: e.target.value,
                    })
                  }
                  placeholder="e.g. Lab Komputer 2, SMKN 1 Surabaya"
                  className="w-full px-3 py-2 border border-hairline bg-bg text-text-1 text-xs font-mono rounded-none focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-hairline">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 border border-hairline text-text-2 hover:text-text-1 text-xs font-mono uppercase rounded-none transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-[#111111] text-white hover:bg-[#2E2E2E] text-xs font-mono uppercase tracking-wider rounded-none transition-colors disabled:opacity-50"
                >
                  {loading ? 'Menyimpan...' : 'Buat Sesi & Buka Presensi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
