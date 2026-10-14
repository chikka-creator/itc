'use client';

import React, { useState } from 'react';
import {
  Terminal,
  Trophy,
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  ExternalLink,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Save,
  RotateCcw,
  Sparkles,
  User,
  Award,
} from 'lucide-react';

export interface ShowcaseProject {
  id: string;
  title: string;
  description: string;
  category: 'lab' | 'portfolio';
  tag: string;
  techStack: string[];
  member: {
    username: string;
    name: string;
    className: string;
    role: string;
    avatarInitial: string;
    avatarBg: string;
  };
  demoUrl?: string;
  githubUrl?: string;
  accentColor?: string;
  badge?: string;
  highlights: string[];
  year: string;
  active?: boolean;
}

export interface MemberStory {
  id: string;
  name: string;
  username: string;
  role: string;
  className: string;
  avatarInitial: string;
  avatarBg: string;
  quote: string;
  fullStory: string;
  achievements: {
    title: string;
    year: string;
    badge: string;
  }[];
  skills: string[];
  githubUrl?: string;
  portfolioUrl?: string;
  verified: boolean;
  active?: boolean;
}

export interface ShowcaseConfig {
  labProjects: ShowcaseProject[];
  portfolioProjects: ShowcaseProject[];
  prestasiMembers: MemberStory[];
}

interface RegisteredUser {
  id: string;
  name: string;
  username: string;
  role: string;
  className: string | null;
  avatarUrl: string | null;
  bio: string | null;
}

interface ShowcaseAdminClientProps {
  initialConfig: ShowcaseConfig | null;
  registeredUsers: RegisteredUser[];
}

export function ShowcaseAdminClient({
  initialConfig,
  registeredUsers,
}: ShowcaseAdminClientProps) {
  const [config, setConfig] = useState<ShowcaseConfig>(() => {
    if (initialConfig && initialConfig.labProjects) {
      return initialConfig;
    }
    // Default fallback
    return {
      labProjects: [],
      portfolioProjects: [],
      prestasiMembers: [],
    };
  });

  const [activeTab, setActiveTab] = useState<'lab' | 'prestasi' | 'portfolio'>('lab');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Modals state
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ShowcaseProject | null>(null);

  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<MemberStory | null>(null);

  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'project' | 'member';
    id: string;
    title: string;
  } | null>(null);

  // Form states for Project
  const [projectForm, setProjectForm] = useState({
    id: '',
    title: '',
    description: '',
    category: 'lab' as 'lab' | 'portfolio',
    tag: 'IOT & HARDWARE',
    badge: 'REAL LAB PROJECT',
    techStackText: '',
    highlightsText: '',
    demoUrl: '',
    githubUrl: '',
    year: '2026',
    active: true,
    authorSource: 'custom' as 'custom' | 'registered',
    selectedUserId: '',
    authorName: '',
    authorUsername: '',
    authorClass: '',
    authorRole: '',
    authorAvatarInitial: '',
    authorAvatarBg: 'bg-[#1E3A4C]',
  });

  // Form states for Member
  const [memberForm, setMemberForm] = useState({
    id: '',
    name: '',
    username: '',
    role: '',
    className: '',
    avatarInitial: '',
    avatarBg: 'bg-[#3D4537]',
    quote: '',
    fullStory: '',
    achievementsText: '',
    skillsText: '',
    githubUrl: '',
    portfolioUrl: '',
    active: true,
    authorSource: 'custom' as 'custom' | 'registered',
    selectedUserId: '',
  });

  // Re-fetch config from server if needed
  const reloadConfig = async () => {
    try {
      const res = await fetch('/api/admin/showcase');
      if (res.ok) {
        const data = await res.json();
        if (data.config) {
          setConfig(data.config);
        }
      }
    } catch (err) {
      console.warn('Failed reloading config:', err);
    }
  };

  // If initialConfig was empty, trigger initial fetch
  React.useEffect(() => {
    if (!initialConfig || !initialConfig.labProjects) {
      reloadConfig();
    }
  }, []);

  const showNotification = (msg: string, isError = false) => {
    if (isError) {
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(''), 4000);
    } else {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/showcase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan');
      showNotification('Perubahan showcase berhasil disimpan ke database!');
    } catch (err: any) {
      showNotification(err.message || 'Terjadi kesalahan saat menyimpan', true);
    } finally {
      setSaving(false);
    }
  };

  // ── Project Handlers ──
  const openAddProject = (category: 'lab' | 'portfolio') => {
    setEditingProject(null);
    setProjectForm({
      id: `proj-${Date.now()}`,
      title: '',
      description: '',
      category,
      tag: category === 'lab' ? 'IOT & HARDWARE' : 'PRODUCTION APPS',
      badge: category === 'lab' ? 'REAL LAB PROJECT' : 'INDUSTRY READY',
      techStackText: category === 'lab' ? 'Next.js 14, TailwindCSS, SQLite' : 'Next.js 14, TypeScript, GraphQL',
      highlightsText: 'Performa sub-50ms\nIntegrasi API real-time\nDesain responsive',
      demoUrl: '',
      githubUrl: '',
      year: '2026',
      active: true,
      authorSource: 'custom',
      selectedUserId: '',
      authorName: '',
      authorUsername: '@',
      authorClass: 'XII RPL 1',
      authorRole: 'Software Developer',
      authorAvatarInitial: 'DEV',
      authorAvatarBg: 'bg-[#1E3A4C]',
    });
    setIsProjectModalOpen(true);
  };

  const openEditProject = (proj: ShowcaseProject) => {
    setEditingProject(proj);
    setProjectForm({
      id: proj.id,
      title: proj.title,
      description: proj.description,
      category: proj.category,
      tag: proj.tag,
      badge: proj.badge || 'PROYEK SISWA',
      techStackText: proj.techStack.join(', '),
      highlightsText: proj.highlights.join('\n'),
      demoUrl: proj.demoUrl || '',
      githubUrl: proj.githubUrl || '',
      year: proj.year || '2026',
      active: proj.active !== false,
      authorSource: 'custom',
      selectedUserId: '',
      authorName: proj.member.name,
      authorUsername: proj.member.username,
      authorClass: proj.member.className,
      authorRole: proj.member.role,
      authorAvatarInitial: proj.member.avatarInitial,
      authorAvatarBg: proj.member.avatarBg,
    });
    setIsProjectModalOpen(true);
  };

  const handleSelectUserForProject = (userId: string) => {
    const u = registeredUsers.find((x) => x.id === userId);
    if (!u) return;
    const initial = u.name
      .split(' ')
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase();

    setProjectForm((prev) => ({
      ...prev,
      selectedUserId: userId,
      authorSource: 'registered',
      authorName: u.name,
      authorUsername: `@${u.username}`,
      authorClass: u.className || 'Anggota Aktif',
      authorAvatarInitial: initial || 'MB',
    }));
  };

  const handleSaveProjectForm = () => {
    if (!projectForm.title.trim()) {
      showNotification('Judul proyek tidak boleh kosong!', true);
      return;
    }
    if (!projectForm.authorName.trim() || !projectForm.authorUsername.trim()) {
      showNotification('Nama dan username pembuat wajib diisi!', true);
      return;
    }

    const newProject: ShowcaseProject = {
      id: projectForm.id,
      title: projectForm.title.trim(),
      description: projectForm.description.trim(),
      category: projectForm.category,
      tag: projectForm.tag.trim().toUpperCase(),
      badge: projectForm.badge.trim().toUpperCase(),
      techStack: projectForm.techStackText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      highlights: projectForm.highlightsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      demoUrl: projectForm.demoUrl.trim() || undefined,
      githubUrl: projectForm.githubUrl.trim() || undefined,
      year: projectForm.year.trim() || '2026',
      active: projectForm.active,
      member: {
        name: projectForm.authorName.trim(),
        username: projectForm.authorUsername.startsWith('@')
          ? projectForm.authorUsername.trim()
          : `@${projectForm.authorUsername.trim()}`,
        className: projectForm.authorClass.trim(),
        role: projectForm.authorRole.trim() || 'Pengembang Proyek',
        avatarInitial: projectForm.authorAvatarInitial.trim().toUpperCase() || 'DEV',
        avatarBg: projectForm.authorAvatarBg,
      },
    };

    if (projectForm.category === 'lab') {
      const list = [...config.labProjects];
      const idx = list.findIndex((p) => p.id === newProject.id);
      if (idx >= 0) {
        list[idx] = newProject;
      } else {
        list.push(newProject);
      }
      setConfig({ ...config, labProjects: list });
    } else {
      const list = [...config.portfolioProjects];
      const idx = list.findIndex((p) => p.id === newProject.id);
      if (idx >= 0) {
        list[idx] = newProject;
      } else {
        list.push(newProject);
      }
      setConfig({ ...config, portfolioProjects: list });
    }

    setIsProjectModalOpen(false);
    showNotification('Proyek berhasil diperbarui di daftar showcase!');
  };

  const toggleProjectActive = (category: 'lab' | 'portfolio', id: string) => {
    if (category === 'lab') {
      setConfig({
        ...config,
        labProjects: config.labProjects.map((p) =>
          p.id === id ? { ...p, active: p.active === false ? true : false } : p
        ),
      });
    } else {
      setConfig({
        ...config,
        portfolioProjects: config.portfolioProjects.map((p) =>
          p.id === id ? { ...p, active: p.active === false ? true : false } : p
        ),
      });
    }
  };

  const moveProject = (category: 'lab' | 'portfolio', idx: number, dir: -1 | 1) => {
    const list = category === 'lab' ? [...config.labProjects] : [...config.portfolioProjects];
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const current = list[idx];
    const target = list[targetIdx];
    if (!current || !target) return;
    list[idx] = target;
    list[targetIdx] = current;
    if (category === 'lab') {
      setConfig({ ...config, labProjects: list });
    } else {
      setConfig({ ...config, portfolioProjects: list });
    }
  };

  // ── Member Handlers ──
  const openAddMember = () => {
    setEditingMember(null);
    setMemberForm({
      id: `prestasi-${Date.now()}`,
      name: '',
      username: '@',
      role: 'KETUA TIM LKS • XII RPL 1',
      className: 'XII RPL 1',
      avatarInitial: 'MB',
      avatarBg: 'bg-[#3D4537]',
      quote: 'Melalui pembinaan intensif di IT Club SMKN 1 Surabaya, saya berhasil menguasai skill standar industri.',
      fullStory: 'Perjalanan belajar di IT Club memberikan saya wawasan luas seputar rekayasa perangkat lunak dan mental bertanding.',
      achievementsText: 'Juara 1 LKS Web Technologies Kota Surabaya|2025|MEDALI EMAS\nMedali Perak LKS Jatim|2025|MEDALI PERAK',
      skillsText: 'Next.js, TypeScript, PostgreSQL, TailwindCSS',
      githubUrl: '',
      portfolioUrl: '',
      active: true,
      authorSource: 'custom',
      selectedUserId: '',
    });
    setIsMemberModalOpen(true);
  };

  const openEditMember = (m: MemberStory) => {
    setEditingMember(m);
    const achievementsStr = m.achievements
      .map((a) => `${a.title}|${a.year}|${a.badge}`)
      .join('\n');

    setMemberForm({
      id: m.id,
      name: m.name,
      username: m.username,
      role: m.role,
      className: m.className,
      avatarInitial: m.avatarInitial,
      avatarBg: m.avatarBg,
      quote: m.quote,
      fullStory: m.fullStory,
      achievementsText: achievementsStr,
      skillsText: m.skills.join(', '),
      githubUrl: m.githubUrl || '',
      portfolioUrl: m.portfolioUrl || '',
      active: m.active !== false,
      authorSource: 'custom',
      selectedUserId: '',
    });
    setIsMemberModalOpen(true);
  };

  const handleSelectUserForMember = (userId: string) => {
    const u = registeredUsers.find((x) => x.id === userId);
    if (!u) return;
    const initial = u.name
      .split(' ')
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase();

    setMemberForm((prev) => ({
      ...prev,
      selectedUserId: userId,
      authorSource: 'registered',
      name: u.name,
      username: `@${u.username}`,
      className: u.className || 'XII RPL 1',
      avatarInitial: initial || 'MB',
      fullStory: u.bio || prev.fullStory,
    }));
  };

  const handleSaveMemberForm = () => {
    if (!memberForm.name.trim() || !memberForm.username.trim()) {
      showNotification('Nama dan username member wajib diisi!', true);
      return;
    }
    if (!memberForm.quote.trim()) {
      showNotification('Kutipan ulasan member wajib diisi!', true);
      return;
    }

    const achievements = memberForm.achievementsText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const parts = line.split('|');
        return {
          title: parts[0]?.trim() || 'Penghargaan Kompetisi',
          year: parts[1]?.trim() || '2025',
          badge: parts[2]?.trim().toUpperCase() || 'JUARA',
        };
      });

    const newMember: MemberStory = {
      id: memberForm.id,
      name: memberForm.name.trim(),
      username: memberForm.username.startsWith('@')
        ? memberForm.username.trim()
        : `@${memberForm.username.trim()}`,
      role: memberForm.role.trim() || 'ANGGOTA IT CLUB',
      className: memberForm.className.trim() || 'XII RPL 1',
      avatarInitial: memberForm.avatarInitial.trim().toUpperCase() || 'MB',
      avatarBg: memberForm.avatarBg,
      quote: memberForm.quote.trim(),
      fullStory: memberForm.fullStory.trim() || memberForm.quote.trim(),
      achievements: achievements.length > 0 ? achievements : [
        { title: 'Prestasi Ekskul IT Club', year: '2025', badge: 'VERIFIED' },
      ],
      skills: memberForm.skillsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      githubUrl: memberForm.githubUrl.trim() || undefined,
      portfolioUrl: memberForm.portfolioUrl.trim() || undefined,
      verified: true,
      active: memberForm.active,
    };

    const list = [...config.prestasiMembers];
    const idx = list.findIndex((m) => m.id === newMember.id);
    if (idx >= 0) {
      list[idx] = newMember;
    } else {
      list.push(newMember);
    }
    setConfig({ ...config, prestasiMembers: list });
    setIsMemberModalOpen(false);
    showNotification('Data member berprestasi berhasil diperbarui!');
  };

  const toggleMemberActive = (id: string) => {
    setConfig({
      ...config,
      prestasiMembers: config.prestasiMembers.map((m) =>
        m.id === id ? { ...m, active: m.active === false ? true : false } : m
      ),
    });
  };

  const moveMember = (idx: number, dir: -1 | 1) => {
    const list = [...config.prestasiMembers];
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const current = list[idx];
    const target = list[targetIdx];
    if (!current || !target) return;
    list[idx] = target;
    list[targetIdx] = current;
    setConfig({ ...config, prestasiMembers: list });
  };

  // ── Delete Handler ──
  const confirmDelete = () => {
    if (!deleteConfirm) return;
    if (deleteConfirm.type === 'project') {
      setConfig({
        ...config,
        labProjects: config.labProjects.filter((p) => p.id !== deleteConfirm.id),
        portfolioProjects: config.portfolioProjects.filter((p) => p.id !== deleteConfirm.id),
      });
    } else {
      setConfig({
        ...config,
        prestasiMembers: config.prestasiMembers.filter((m) => m.id !== deleteConfirm.id),
      });
    }
    setDeleteConfirm(null);
    showNotification('Item berhasil dihapus dari daftar showcase.');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-surface border border-hairline p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="size-2 bg-brand animate-pulse inline-block" />
            <span className="font-mono text-xs uppercase tracking-wider text-text-3 font-semibold">
              CMS LANDING PAGE • SHOWCASE SYSTEM
            </span>
          </div>
          <h1 className="text-2xl font-bold text-text-1">
            Manajemen Showcase Karya & Member Berprestasi
          </h1>
          <p className="text-sm text-text-2 mt-1">
            Atur siapa saja member dan apa saja proyek praktikum/portofolio yang ditampilkan di 3 card keuntungan landing page.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={reloadConfig}
            className="font-mono text-xs uppercase px-4 h-10 border border-hairline bg-surface hover:bg-bg text-text-1 flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="size-3.5" />
            <span>Muat Ulang</span>
          </button>

          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="font-mono text-xs font-semibold uppercase px-5 h-10 bg-brand text-white hover:bg-brand/90 flex items-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            <Save className="size-4" />
            <span>{saving ? 'Menyimpan...' : 'Simpan Semua'}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="size-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono flex items-center gap-2">
          <X className="size-4 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 3 Main Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 border-b border-hairline pb-4">
        <button
          onClick={() => setActiveTab('lab')}
          className={`p-4 border text-left transition-all cursor-pointer ${
            activeTab === 'lab'
              ? 'bg-surface border-brand shadow-sm ring-2 ring-brand/10'
              : 'bg-surface/60 border-hairline hover:bg-surface'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Terminal className={`size-4 ${activeTab === 'lab' ? 'text-brand' : 'text-text-3'}`} />
            <span className="font-mono text-[10px] text-text-3 bg-bg px-2 py-0.5 border border-hairline">
              CARD #01
            </span>
          </div>
          <p className="font-semibold text-sm text-text-1">Lab & Proyek Nyata</p>
          <p className="font-mono text-xs text-text-3 mt-1">
            {config.labProjects.length} Proyek ({config.labProjects.filter((p) => p.active !== false).length} Aktif)
          </p>
        </button>

        <button
          onClick={() => setActiveTab('prestasi')}
          className={`p-4 border text-left transition-all cursor-pointer ${
            activeTab === 'prestasi'
              ? 'bg-surface border-brand shadow-sm ring-2 ring-brand/10'
              : 'bg-surface/60 border-hairline hover:bg-surface'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Trophy className={`size-4 ${activeTab === 'prestasi' ? 'text-amber-500' : 'text-text-3'}`} />
            <span className="font-mono text-[10px] text-text-3 bg-bg px-2 py-0.5 border border-hairline">
              CARD #02 (FOTO 2)
            </span>
          </div>
          <p className="font-semibold text-sm text-text-1">Jalur Prestasi & Ulasan</p>
          <p className="font-mono text-xs text-text-3 mt-1">
            {config.prestasiMembers.length} Member ({config.prestasiMembers.filter((m) => m.active !== false).length} Aktif)
          </p>
        </button>

        <button
          onClick={() => setActiveTab('portfolio')}
          className={`p-4 border text-left transition-all cursor-pointer ${
            activeTab === 'portfolio'
              ? 'bg-surface border-brand shadow-sm ring-2 ring-brand/10'
              : 'bg-surface/60 border-hairline hover:bg-surface'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Briefcase className={`size-4 ${activeTab === 'portfolio' ? 'text-emerald-600' : 'text-text-3'}`} />
            <span className="font-mono text-[10px] text-text-3 bg-bg px-2 py-0.5 border border-hairline">
              CARD #03
            </span>
          </div>
          <p className="font-semibold text-sm text-text-1">Portofolio Siap Industri</p>
          <p className="font-mono text-xs text-text-3 mt-1">
            {config.portfolioProjects.length} Portofolio ({config.portfolioProjects.filter((p) => p.active !== false).length} Aktif)
          </p>
        </button>
      </div>

      {/* ── TAB 1: Lab & Proyek Nyata ── */}
      {activeTab === 'lab' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-text-1">Daftar Proyek Lab Praktikum</h2>
              <p className="text-xs text-text-2">
                Proyek ini muncul di galeri ketika pengunjung mengklik card Keuntungan #01.
              </p>
            </div>
            <button
              onClick={() => openAddProject('lab')}
              className="font-mono text-xs font-semibold uppercase px-4 h-9 bg-brand text-white hover:bg-brand/90 flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="size-3.5" />
              <span>Tambah Proyek Lab</span>
            </button>
          </div>

          <div className="space-y-3">
            {config.labProjects.map((proj, idx) => {
              const isActive = proj.active !== false;
              return (
                <div
                  key={proj.id}
                  className={`bg-surface border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                    isActive ? 'border-hairline shadow-xs' : 'border-dashed border-hairline/80 opacity-60 bg-bg/40'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="size-10 bg-bg border border-hairline flex items-center justify-center font-mono text-xs font-bold text-brand shrink-0">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-base text-text-1">{proj.title}</h3>
                        <span className="font-mono text-[10px] px-2 py-0.5 bg-bg border border-hairline text-text-3">
                          {proj.tag}
                        </span>
                        <span className="font-mono text-[10px] px-2 py-0.5 bg-brand-soft text-brand font-bold">
                          {proj.badge || 'LAB'}
                        </span>
                        {!isActive && (
                          <span className="font-mono text-[10px] px-2 py-0.5 bg-neutral-200 text-neutral-600 font-bold">
                            DISEMBUNYIKAN
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-text-2 mt-1 line-clamp-1">{proj.description}</p>
                      <div className="flex items-center gap-2 font-mono text-[11px] text-text-3 mt-1.5">
                        <span className="text-text-1 font-semibold">{proj.member.name}</span>
                        <span className="text-brand font-bold bg-brand-soft px-1.5 py-0.2">{proj.member.username}</span>
                        <span>• {proj.member.className}</span>
                        <span>• Stack: {proj.techStack.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                    <button
                      onClick={() => moveProject('lab', idx, -1)}
                      disabled={idx === 0}
                      title="Geser Naik"
                      className="size-8 flex items-center justify-center border border-hairline hover:bg-bg disabled:opacity-30"
                    >
                      <ArrowUp className="size-3.5" />
                    </button>
                    <button
                      onClick={() => moveProject('lab', idx, 1)}
                      disabled={idx === config.labProjects.length - 1}
                      title="Geser Turun"
                      className="size-8 flex items-center justify-center border border-hairline hover:bg-bg disabled:opacity-30"
                    >
                      <ArrowDown className="size-3.5" />
                    </button>
                    <button
                      onClick={() => toggleProjectActive('lab', proj.id)}
                      title={isActive ? 'Sembunyikan' : 'Tampilkan'}
                      className={`size-8 flex items-center justify-center border ${
                        isActive ? 'border-hairline text-emerald-600 hover:bg-bg' : 'border-hairline text-text-3 bg-bg'
                      }`}
                    >
                      {isActive ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                    </button>
                    <button
                      onClick={() => openEditProject(proj)}
                      title="Edit Proyek"
                      className="size-8 flex items-center justify-center border border-hairline hover:bg-bg text-text-1"
                    >
                      <Edit2 className="size-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm({ type: 'project', id: proj.id, title: proj.title })}
                      title="Hapus Proyek"
                      className="size-8 flex items-center justify-center border border-hairline hover:bg-rose-50 text-rose-600"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TAB 2: Jalur Prestasi & Ulasan Member (Foto 2) ── */}
      {activeTab === 'prestasi' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-text-1">Daftar Member & Ulasan Berprestasi</h2>
              <p className="text-xs text-text-2">
                Member ini ditampilkan dalam tata letak kartu ulasan (sesuai Foto ke-2) pada Card Keuntungan #02.
              </p>
            </div>
            <button
              onClick={openAddMember}
              className="font-mono text-xs font-semibold uppercase px-4 h-9 bg-brand text-white hover:bg-brand/90 flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="size-3.5" />
              <span>Tambah Member Berprestasi</span>
            </button>
          </div>

          <div className="space-y-3">
            {config.prestasiMembers.map((m, idx) => {
              const isActive = m.active !== false;
              return (
                <div
                  key={m.id}
                  className={`bg-surface border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                    isActive ? 'border-hairline shadow-xs' : 'border-dashed border-hairline/80 opacity-60 bg-bg/40'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`size-11 ${m.avatarBg || 'bg-[#3D4537]'} text-white flex items-center justify-center font-mono text-xs font-bold border border-white/20 shrink-0 shadow-sm`}
                    >
                      {m.avatarInitial}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-base text-text-1">{m.name}</h3>
                        <span className="font-mono text-[11px] font-bold text-brand bg-brand-soft px-1.5 py-0.2">
                          {m.username}
                        </span>
                        <span className="font-mono text-[10px] uppercase text-text-3 bg-bg px-2 py-0.5 border border-hairline">
                          {m.role}
                        </span>
                        {!isActive && (
                          <span className="font-mono text-[10px] px-2 py-0.5 bg-neutral-200 text-neutral-600 font-bold">
                            DISEMBUNYIKAN
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-text-2 italic mt-1 line-clamp-2">
                        &ldquo;{m.quote}&rdquo;
                      </p>
                      <div className="flex items-center gap-2 font-mono text-[10px] text-text-3 mt-1.5 flex-wrap">
                        <Award className="size-3 text-amber-500" />
                        <span>{m.achievements.length} Prestasi LKS</span>
                        <span>• Keahlian: {m.skills.slice(0, 3).join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                    <button
                      onClick={() => moveMember(idx, -1)}
                      disabled={idx === 0}
                      title="Geser Naik"
                      className="size-8 flex items-center justify-center border border-hairline hover:bg-bg disabled:opacity-30"
                    >
                      <ArrowUp className="size-3.5" />
                    </button>
                    <button
                      onClick={() => moveMember(idx, 1)}
                      disabled={idx === config.prestasiMembers.length - 1}
                      title="Geser Turun"
                      className="size-8 flex items-center justify-center border border-hairline hover:bg-bg disabled:opacity-30"
                    >
                      <ArrowDown className="size-3.5" />
                    </button>
                    <button
                      onClick={() => toggleMemberActive(m.id)}
                      title={isActive ? 'Sembunyikan' : 'Tampilkan'}
                      className={`size-8 flex items-center justify-center border ${
                        isActive ? 'border-hairline text-emerald-600 hover:bg-bg' : 'border-hairline text-text-3 bg-bg'
                      }`}
                    >
                      {isActive ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                    </button>
                    <button
                      onClick={() => openEditMember(m)}
                      title="Edit Member"
                      className="size-8 flex items-center justify-center border border-hairline hover:bg-bg text-text-1"
                    >
                      <Edit2 className="size-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm({ type: 'member', id: m.id, title: m.name })}
                      title="Hapus Member"
                      className="size-8 flex items-center justify-center border border-hairline hover:bg-rose-50 text-rose-600"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TAB 3: Portofolio Siap Industri ── */}
      {activeTab === 'portfolio' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-text-1">Daftar Portofolio Siap Industri</h2>
              <p className="text-xs text-text-2">
                Portofolio ini muncul di galeri ketika pengunjung mengklik card Keuntungan #03.
              </p>
            </div>
            <button
              onClick={() => openAddProject('portfolio')}
              className="font-mono text-xs font-semibold uppercase px-4 h-9 bg-brand text-white hover:bg-brand/90 flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="size-3.5" />
              <span>Tambah Portofolio</span>
            </button>
          </div>

          <div className="space-y-3">
            {config.portfolioProjects.map((port, idx) => {
              const isActive = port.active !== false;
              return (
                <div
                  key={port.id}
                  className={`bg-surface border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                    isActive ? 'border-hairline shadow-xs' : 'border-dashed border-hairline/80 opacity-60 bg-bg/40'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="size-10 bg-bg border border-hairline flex items-center justify-center font-mono text-xs font-bold text-emerald-600 shrink-0">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-base text-text-1">{port.title}</h3>
                        <span className="font-mono text-[10px] px-2 py-0.5 bg-bg border border-hairline text-text-3">
                          {port.tag}
                        </span>
                        <span className="font-mono text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                          {port.badge || 'READY'}
                        </span>
                        {!isActive && (
                          <span className="font-mono text-[10px] px-2 py-0.5 bg-neutral-200 text-neutral-600 font-bold">
                            DISEMBUNYIKAN
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-text-2 mt-1 line-clamp-1">{port.description}</p>
                      <div className="flex items-center gap-2 font-mono text-[11px] text-text-3 mt-1.5">
                        <span className="text-text-1 font-semibold">{port.member.name}</span>
                        <span className="text-brand font-bold bg-brand-soft px-1.5 py-0.2">{port.member.username}</span>
                        <span>• {port.member.className}</span>
                        <span>• Stack: {port.techStack.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                    <button
                      onClick={() => moveProject('portfolio', idx, -1)}
                      disabled={idx === 0}
                      title="Geser Naik"
                      className="size-8 flex items-center justify-center border border-hairline hover:bg-bg disabled:opacity-30"
                    >
                      <ArrowUp className="size-3.5" />
                    </button>
                    <button
                      onClick={() => moveProject('portfolio', idx, 1)}
                      disabled={idx === config.portfolioProjects.length - 1}
                      title="Geser Turun"
                      className="size-8 flex items-center justify-center border border-hairline hover:bg-bg disabled:opacity-30"
                    >
                      <ArrowDown className="size-3.5" />
                    </button>
                    <button
                      onClick={() => toggleProjectActive('portfolio', port.id)}
                      title={isActive ? 'Sembunyikan' : 'Tampilkan'}
                      className={`size-8 flex items-center justify-center border ${
                        isActive ? 'border-hairline text-emerald-600 hover:bg-bg' : 'border-hairline text-text-3 bg-bg'
                      }`}
                    >
                      {isActive ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                    </button>
                    <button
                      onClick={() => openEditProject(port)}
                      title="Edit Portofolio"
                      className="size-8 flex items-center justify-center border border-hairline hover:bg-bg text-text-1"
                    >
                      <Edit2 className="size-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm({ type: 'project', id: port.id, title: port.title })}
                      title="Hapus Portofolio"
                      className="size-8 flex items-center justify-center border border-hairline hover:bg-rose-50 text-rose-600"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── MODAL: Tambah/Edit Proyek ── */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-surface border border-hairline p-6 shadow-2xl my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-hairline">
              <h3 className="text-lg font-bold text-text-1">
                {editingProject ? 'Edit Proyek Showcase' : 'Tambah Proyek Baru'}
              </h3>
              <button
                onClick={() => setIsProjectModalOpen(false)}
                className="size-8 flex items-center justify-center text-text-3 hover:text-text-1"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Sumber Penulis / Member */}
              <div className="p-3 bg-bg border border-hairline space-y-2">
                <span className="font-mono text-xs uppercase font-bold text-text-2 flex items-center gap-1.5">
                  <User className="size-3.5 text-brand" />
                  Hubungkan dengan Akun Siswa / Member
                </span>
                <select
                  value={projectForm.selectedUserId}
                  onChange={(e) => handleSelectUserForProject(e.target.value)}
                  className="w-full text-xs p-2 bg-surface border border-hairline font-mono"
                >
                  <option value="">-- Pilih dari Siswa Terdaftar (Otomatis Isi Data) --</option>
                  {registeredUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} (@{u.username}) • {u.className || 'Anggota'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Data Pembuat */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-mono text-[11px] uppercase text-text-3 block mb-1">
                    Nama Pembuat
                  </label>
                  <input
                    type="text"
                    value={projectForm.authorName}
                    onChange={(e) => setProjectForm({ ...projectForm, authorName: e.target.value })}
                    className="w-full text-xs p-2.5 bg-surface border border-hairline"
                    placeholder="Contoh: Dimas Prasetyo"
                  />
                </div>
                <div>
                  <label className="font-mono text-[11px] uppercase text-text-3 block mb-1">
                    Username Member (@username)
                  </label>
                  <input
                    type="text"
                    value={projectForm.authorUsername}
                    onChange={(e) => setProjectForm({ ...projectForm, authorUsername: e.target.value })}
                    className="w-full text-xs p-2.5 bg-surface border border-hairline font-mono"
                    placeholder="@dimasweb"
                  />
                </div>
                <div>
                  <label className="font-mono text-[11px] uppercase text-text-3 block mb-1">
                    Kelas / Status
                  </label>
                  <input
                    type="text"
                    value={projectForm.authorClass}
                    onChange={(e) => setProjectForm({ ...projectForm, authorClass: e.target.value })}
                    className="w-full text-xs p-2.5 bg-surface border border-hairline"
                    placeholder="XII RPL 2"
                  />
                </div>
                <div>
                  <label className="font-mono text-[11px] uppercase text-text-3 block mb-1">
                    Peran di IT Club
                  </label>
                  <input
                    type="text"
                    value={projectForm.authorRole}
                    onChange={(e) => setProjectForm({ ...projectForm, authorRole: e.target.value })}
                    className="w-full text-xs p-2.5 bg-surface border border-hairline"
                    placeholder="Lead Divisi Web"
                  />
                </div>
              </div>

              {/* Data Proyek */}
              <div>
                <label className="font-mono text-[11px] uppercase text-text-3 block mb-1">
                  Judul Proyek
                </label>
                <input
                  type="text"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  className="w-full text-xs p-2.5 bg-surface border border-hairline font-semibold"
                  placeholder="Contoh: Smart Lab IoT Attendance & AC Controller"
                />
              </div>

              <div>
                <label className="font-mono text-[11px] uppercase text-text-3 block mb-1">
                  Deskripsi Ringkas
                </label>
                <textarea
                  rows={2}
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="w-full text-xs p-2.5 bg-surface border border-hairline leading-relaxed"
                  placeholder="Penjelasan singkat proyek yang tampil pada kartu galeri"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-mono text-[11px] uppercase text-text-3 block mb-1">
                    Kategori Card
                  </label>
                  <select
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value as any })}
                    className="w-full text-xs p-2.5 bg-surface border border-hairline font-mono"
                  >
                    <option value="lab">Lab & Proyek Nyata (Card 01)</option>
                    <option value="portfolio">Portofolio Siap Industri (Card 03)</option>
                  </select>
                </div>
                <div>
                  <label className="font-mono text-[11px] uppercase text-text-3 block mb-1">
                    Tag Kategori
                  </label>
                  <input
                    type="text"
                    value={projectForm.tag}
                    onChange={(e) => setProjectForm({ ...projectForm, tag: e.target.value })}
                    className="w-full text-xs p-2.5 bg-surface border border-hairline font-mono"
                    placeholder="IOT & HARDWARE"
                  />
                </div>
                <div>
                  <label className="font-mono text-[11px] uppercase text-text-3 block mb-1">
                    Badge Status
                  </label>
                  <input
                    type="text"
                    value={projectForm.badge}
                    onChange={(e) => setProjectForm({ ...projectForm, badge: e.target.value })}
                    className="w-full text-xs p-2.5 bg-surface border border-hairline font-mono"
                    placeholder="REAL LAB PROJECT"
                  />
                </div>
              </div>

              <div>
                <label className="font-mono text-[11px] uppercase text-text-3 block mb-1">
                  Tech Stack (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={projectForm.techStackText}
                  onChange={(e) => setProjectForm({ ...projectForm, techStackText: e.target.value })}
                  className="w-full text-xs p-2.5 bg-surface border border-hairline font-mono"
                  placeholder="Next.js 14, TypeScript, TailwindCSS, ESP32"
                />
              </div>

              <div>
                <label className="font-mono text-[11px] uppercase text-text-3 block mb-1">
                  Fitur Unggulan / Highlights (Satu poin per baris)
                </label>
                <textarea
                  rows={3}
                  value={projectForm.highlightsText}
                  onChange={(e) => setProjectForm({ ...projectForm, highlightsText: e.target.value })}
                  className="w-full text-xs p-2.5 bg-surface border border-hairline font-mono leading-relaxed"
                  placeholder="Presensi RFID kilat < 300ms&#10;Kontrol suhu otomatis menghemat 35% listrik"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-mono text-[11px] uppercase text-text-3 block mb-1">
                    Link Live Demo
                  </label>
                  <input
                    type="text"
                    value={projectForm.demoUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, demoUrl: e.target.value })}
                    className="w-full text-xs p-2.5 bg-surface border border-hairline font-mono"
                    placeholder="https://smartlab.smkn1.sch.id"
                  />
                </div>
                <div>
                  <label className="font-mono text-[11px] uppercase text-text-3 block mb-1">
                    Link Repository GitHub
                  </label>
                  <input
                    type="text"
                    value={projectForm.githubUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                    className="w-full text-xs p-2.5 bg-surface border border-hairline font-mono"
                    placeholder="https://github.com/itclub-smkn1/smartlab"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="projectActive"
                  checked={projectForm.active}
                  onChange={(e) => setProjectForm({ ...projectForm, active: e.target.checked })}
                  className="size-4"
                />
                <label htmlFor="projectActive" className="text-xs font-mono text-text-1 cursor-pointer">
                  Tampilkan di Landing Page publik
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-5 mt-5 border-t border-hairline">
              <button
                onClick={() => setIsProjectModalOpen(false)}
                className="font-mono text-xs uppercase px-4 h-9 border border-hairline bg-surface hover:bg-bg text-text-1"
              >
                Batal
              </button>
              <button
                onClick={handleSaveProjectForm}
                className="font-mono text-xs font-semibold uppercase px-5 h-9 bg-brand text-white hover:bg-brand/90"
              >
                Simpan Proyek
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Tambah/Edit Member (Foto 2) ── */}
      {isMemberModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-surface border border-hairline p-6 shadow-2xl my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-hairline">
              <h3 className="text-lg font-bold text-text-1">
                {editingMember ? 'Edit Data Member Berprestasi' : 'Tambah Member Berprestasi'}
              </h3>
              <button
                onClick={() => setIsMemberModalOpen(false)}
                className="size-8 flex items-center justify-center text-text-3 hover:text-text-1"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Selector User Terdaftar */}
              <div className="p-3 bg-bg border border-hairline space-y-2">
                <span className="font-mono text-xs uppercase font-bold text-text-2 flex items-center gap-1.5">
                  <User className="size-3.5 text-brand" />
                  Hubungkan dengan Akun Siswa Terdaftar
                </span>
                <select
                  value={memberForm.selectedUserId}
                  onChange={(e) => handleSelectUserForMember(e.target.value)}
                  className="w-full text-xs p-2 bg-surface border border-hairline font-mono"
                >
                  <option value="">-- Pilih dari Siswa Terdaftar (Otomatis Isi Data) --</option>
                  {registeredUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} (@{u.username}) • {u.className || 'Anggota'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Data Siswa */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-mono text-[11px] uppercase text-text-3 block mb-1">
                    Nama Siswa / Alumni
                  </label>
                  <input
                    type="text"
                    value={memberForm.name}
                    onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                    className="w-full text-xs p-2.5 bg-surface border border-hairline font-semibold"
                    placeholder="Contoh: Rani Putri"
                  />
                </div>
                <div>
                  <label className="font-mono text-[11px] uppercase text-text-3 block mb-1">
                    Username Member (@username)
                  </label>
                  <input
                    type="text"
                    value={memberForm.username}
                    onChange={(e) => setMemberForm({ ...memberForm, username: e.target.value })}
                    className="w-full text-xs p-2.5 bg-surface border border-hairline font-mono"
                    placeholder="@raniputri"
                  />
                </div>
                <div>
                  <label className="font-mono text-[11px] uppercase text-text-3 block mb-1">
                    Role / Subtitle (Tampil di Foto 2)
                  </label>
                  <input
                    type="text"
                    value={memberForm.role}
                    onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                    className="w-full text-xs p-2.5 bg-surface border border-hairline font-mono"
                    placeholder="KETUA IT CLUB • XII RPL 1"
                  />
                </div>
                <div>
                  <label className="font-mono text-[11px] uppercase text-text-3 block mb-1">
                    Kelas / Status
                  </label>
                  <input
                    type="text"
                    value={memberForm.className}
                    onChange={(e) => setMemberForm({ ...memberForm, className: e.target.value })}
                    className="w-full text-xs p-2.5 bg-surface border border-hairline"
                    placeholder="XII RPL 1"
                  />
                </div>
              </div>

              {/* Avatar Initial & Color */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-mono text-[11px] uppercase text-text-3 block mb-1">
                    Inisial Avatar (Maksimal 2 Huruf)
                  </label>
                  <input
                    type="text"
                    maxLength={3}
                    value={memberForm.avatarInitial}
                    onChange={(e) => setMemberForm({ ...memberForm, avatarInitial: e.target.value.toUpperCase() })}
                    className="w-full text-xs p-2.5 bg-surface border border-hairline font-mono font-bold"
                    placeholder="RP"
                  />
                </div>
                <div>
                  <label className="font-mono text-[11px] uppercase text-text-3 block mb-1">
                    Warna Background Avatar
                  </label>
                  <select
                    value={memberForm.avatarBg}
                    onChange={(e) => setMemberForm({ ...memberForm, avatarBg: e.target.value })}
                    className="w-full text-xs p-2.5 bg-surface border border-hairline font-mono"
                  >
                    <option value="bg-[#3D4537]">Dark Olive (bg-[#3D4537])</option>
                    <option value="bg-[#5C6E52]">Sage Green (bg-[#5C6E52])</option>
                    <option value="bg-[#2E332A]">Deep Forest (bg-[#2E332A])</option>
                    <option value="bg-[#1E3A4C]">Midnight Teal (bg-[#1E3A4C])</option>
                  </select>
                </div>
              </div>

              {/* Quote Ulasan (Tampil di kartu Foto 2) */}
              <div>
                <label className="font-mono text-[11px] uppercase text-text-3 block mb-1">
                  Kutipan Ulasan (Tampil di Kartu Foto ke-2)
                </label>
                <textarea
                  rows={3}
                  value={memberForm.quote}
                  onChange={(e) => setMemberForm({ ...memberForm, quote: e.target.value })}
                  className="w-full text-xs p-2.5 bg-surface border border-hairline italic leading-relaxed"
                  placeholder="Tulis kutipan pengalaman member di sini..."
                />
              </div>

              {/* Cerita Lengkap (Tampil di Modal) */}
              <div>
                <label className="font-mono text-[11px] uppercase text-text-3 block mb-1">
                  Cerita Pengalaman Lengkap (Tampil saat Kartu Diklik)
                </label>
                <textarea
                  rows={3}
                  value={memberForm.fullStory}
                  onChange={(e) => setMemberForm({ ...memberForm, fullStory: e.target.value })}
                  className="w-full text-xs p-2.5 bg-surface border border-hairline leading-relaxed"
                  placeholder="Cerita mendalam tentang proses belajar, mentoring, dan pencapaian..."
                />
              </div>

              {/* Prestasi LKS */}
              <div>
                <label className="font-mono text-[11px] uppercase text-text-3 block mb-1">
                  Daftar Prestasi LKS & Lomba (Format: Judul | Tahun | Badge, satu per baris)
                </label>
                <textarea
                  rows={3}
                  value={memberForm.achievementsText}
                  onChange={(e) => setMemberForm({ ...memberForm, achievementsText: e.target.value })}
                  className="w-full text-xs p-2.5 bg-surface border border-hairline font-mono leading-relaxed"
                  placeholder="Juara 1 LKS Web Technologies Kota Surabaya|2025|MEDALI EMAS&#10;Medali Perak LKS Jatim|2025|MEDALI PERAK"
                />
              </div>

              {/* Keahlian & Link */}
              <div>
                <label className="font-mono text-[11px] uppercase text-text-3 block mb-1">
                  Keahlian Teknis (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={memberForm.skillsText}
                  onChange={(e) => setMemberForm({ ...memberForm, skillsText: e.target.value })}
                  className="w-full text-xs p-2.5 bg-surface border border-hairline font-mono"
                  placeholder="Next.js, TypeScript, PostgreSQL, TailwindCSS"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-mono text-[11px] uppercase text-text-3 block mb-1">
                    Link GitHub
                  </label>
                  <input
                    type="text"
                    value={memberForm.githubUrl}
                    onChange={(e) => setMemberForm({ ...memberForm, githubUrl: e.target.value })}
                    className="w-full text-xs p-2.5 bg-surface border border-hairline font-mono"
                    placeholder="https://github.com/raniputri"
                  />
                </div>
                <div>
                  <label className="font-mono text-[11px] uppercase text-text-3 block mb-1">
                    Link Website Portofolio
                  </label>
                  <input
                    type="text"
                    value={memberForm.portfolioUrl}
                    onChange={(e) => setMemberForm({ ...memberForm, portfolioUrl: e.target.value })}
                    className="w-full text-xs p-2.5 bg-surface border border-hairline font-mono"
                    placeholder="https://raniputri.dev"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="memberActive"
                  checked={memberForm.active}
                  onChange={(e) => setMemberForm({ ...memberForm, active: e.target.checked })}
                  className="size-4"
                />
                <label htmlFor="memberActive" className="text-xs font-mono text-text-1 cursor-pointer">
                  Tampilkan di Landing Page publik
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-5 mt-5 border-t border-hairline">
              <button
                onClick={() => setIsMemberModalOpen(false)}
                className="font-mono text-xs uppercase px-4 h-9 border border-hairline bg-surface hover:bg-bg text-text-1"
              >
                Batal
              </button>
              <button
                onClick={handleSaveMemberForm}
                className="font-mono text-xs font-semibold uppercase px-5 h-9 bg-brand text-white hover:bg-brand/90"
              >
                Simpan Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Konfirmasi Hapus ── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-surface border border-hairline p-6 shadow-2xl">
            <h3 className="text-base font-bold text-text-1">Hapus Item dari Showcase?</h3>
            <p className="text-xs text-text-2 mt-2 leading-relaxed">
              Apakah Anda yakin ingin menghapus <strong>&ldquo;{deleteConfirm.title}&rdquo;</strong> dari daftar showcase?
              Tindakan ini tidak dapat dibatalkan setelah Anda menekan tombol simpan.
            </p>
            <div className="flex items-center justify-end gap-3 mt-5 pt-4 border-t border-hairline">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="font-mono text-xs uppercase px-4 h-9 border border-hairline bg-surface hover:bg-bg text-text-1"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="font-mono text-xs font-semibold uppercase px-4 h-9 bg-rose-600 text-white hover:bg-rose-700"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
