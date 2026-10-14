import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/permissions';
import { db, settings, users, eq, asc } from '@itc/db';

const DEFAULT_CONFIG = {
  labProjects: [
    {
      id: 'lab-1',
      title: 'Smart Lab IoT Attendance & AC Controller',
      description:
        'Sistem presensi IoT berbasis RFID & ESP32 yang terintegrasi dengan relay pendingin ruangan otomatis dan Next.js web dashboard pengawas lab.',
      category: 'lab',
      tag: 'IOT & HARDWARE',
      techStack: ['ESP32', 'Next.js 14', 'MQTT', 'TailwindCSS', 'SQLite'],
      member: {
        username: '@fauzanpratama',
        name: 'Ahmad Fauzan Pratama',
        className: 'XII RPL 1',
        role: 'Hardware & IoT Specialist',
        avatarInitial: 'FP',
        avatarBg: 'bg-[#1E3A4C]',
      },
      demoUrl: 'https://smartlab.smkn1.sch.id',
      githubUrl: 'https://github.com/itclub-smkn1/iot-smartlab',
      accentColor: '#28BBEA',
      badge: 'LAB HARDWARE',
      highlights: [
        'Presensi RFID kilat < 300ms dengan buzzer konfirmasi',
        'Kontrol suhu otomatis menghemat 35% konsumsi listrik lab',
        'Sinkronisasi data presensi langsung ke dashboard sekolah',
      ],
      year: '2026',
      active: true,
    },
    {
      id: 'lab-2',
      title: 'SMKN 1 Event Hub & QR Ticketing Engine',
      description:
        'Platform registrasi dan verifikasi tiket digital open-house sekolah menggunakan dynamic QR code anti-screenshot dan scanner kamera web.',
      category: 'lab',
      tag: 'WEB ARCHITECTURE',
      techStack: ['Next.js App Router', 'TypeScript', 'Drizzle ORM', 'Zxing Scanner'],
      member: {
        username: '@dimasweb',
        name: 'Dimas Prasetyo',
        className: 'XII RPL 2',
        role: 'Lead Divisi Web',
        avatarInitial: 'DP',
        avatarBg: 'bg-[#5C6E52]',
      },
      demoUrl: 'https://event.smkn1.sch.id',
      githubUrl: 'https://github.com/itclub-smkn1/event-hub',
      accentColor: '#10B981',
      badge: 'REAL LAB PROJECT',
      highlights: [
        'Menampung 1.200+ pengunjung serentak saat Dies Natalis SMKN 1',
        'Validasi tiket real-time dengan latency sub-50ms',
        'Export laporan analitik kehadiran ke format CSV & PDF otomatis',
      ],
      year: '2025',
      active: true,
    },
    {
      id: 'lab-3',
      title: 'Computer Vision Face Recognition Presensi',
      description:
        'Model deep learning pengenalan wajah multi-kandidat untuk absensi otomatis saat siswa memasuki pintu Lab Komputer RPL.',
      category: 'lab',
      tag: 'AI & VISION',
      techStack: ['Python', 'OpenCV', 'FaceNet', 'FastAPI', 'WebSocket'],
      member: {
        username: '@budi_tkj',
        name: 'Budi Santoso',
        className: 'XII TKJ 1',
        role: 'Cloud & AI Engineer',
        avatarInitial: 'BS',
        avatarBg: 'bg-[#2E332A]',
      },
      demoUrl: 'https://vision.smkn1.sch.id',
      githubUrl: 'https://github.com/itclub-smkn1/face-attendance',
      accentColor: '#8B5CF6',
      badge: 'RESEARCH & AI',
      highlights: [
        'Akurasi deteksi wajah 98.4% pada variasi pencahayaan lab',
        'Pipeline live video stream 30 FPS pada single edge-device',
        'Notifikasi webhook instan ke bot Telegram wali kelas',
      ],
      year: '2026',
      active: true,
    },
    {
      id: 'lab-4',
      title: 'CloudOps Server Daemon & Proxmox Monitor',
      description:
        'Daemon pemantau utilitas node Proxmox VE dan server bare-metal lab komputer sekolah, dilengkapi alarm CPU overload dan visualisasi memory leak.',
      category: 'lab',
      tag: 'SYSTEMS & CLOUD',
      techStack: ['Go (Golang)', 'Proxmox API', 'InfluxDB', 'Grafana', 'Docker'],
      member: {
        username: '@rizky_dev',
        name: 'Rizky Pratama',
        className: 'XII TKJ 2',
        role: 'Infra & System Admin',
        avatarInitial: 'RP',
        avatarBg: 'bg-[#3D4537]',
      },
      demoUrl: 'https://infra.smkn1.sch.id',
      githubUrl: 'https://github.com/itclub-smkn1/server-monitor',
      accentColor: '#F59E0B',
      badge: 'INFRASTRUCTURE',
      highlights: [
        'Monitoring 8 node server fisik Lab SMKN 1 secara terpusat',
        'Zero-overhead background daemon dengan footprint RAM < 18MB',
        'Deteksi anomali jaringan lokal dan auto-restart container yang crash',
      ],
      year: '2025',
      active: true,
    },
  ],
  portfolioProjects: [
    {
      id: 'port-1',
      title: 'DevFolio 2026: Modern Interactive Portfolio',
      description:
        'Portofolio web interaktif bergaya Swiss Editorial Luxury dengan dark mode, interactive canvas physics, dan integrasi GitHub API v4.',
      category: 'portfolio',
      tag: 'PRODUCTION APPS',
      techStack: ['Next.js 14', 'Framer Motion', 'TailwindCSS', 'GitHub GraphQL'],
      member: {
        username: '@ayulestari',
        name: 'Ayu Lestari',
        className: 'Alumni (Software Engineer)',
        role: 'Fullstack Software Engineer',
        avatarInitial: 'AL',
        avatarBg: 'bg-[#2E332A]',
      },
      demoUrl: 'https://ayulestari.dev',
      githubUrl: 'https://github.com/ayulestari/devfolio-v2',
      accentColor: '#28BBEA',
      badge: 'INDUSTRY READY',
      highlights: [
        'Skor Google Lighthouse sempurna 100/100/100/100',
        'Mendapatkan tawaran kerja Software Engineer sebelum wisuda SMK',
        'Telah di-star 140+ kali oleh komunitas web developer global',
      ],
      year: '2026',
      active: true,
    },
    {
      id: 'port-2',
      title: 'Nexus POS: Point of Sale & Inventory Engine',
      description:
        'Aplikasi kasir multi-cabang berbasis PWA offline-first dengan sinkronisasi background, cetak struk Bluetooth termal, dan analitik omzet.',
      category: 'portfolio',
      tag: 'SAAS PRODUCT',
      techStack: ['React', 'TypeScript', 'IndexedDB', 'Node.js', 'PostgreSQL'],
      member: {
        username: '@raniputri',
        name: 'Rani Putri',
        className: 'XII RPL 1',
        role: 'Ketua IT Club • Product Lead',
        avatarInitial: 'RP',
        avatarBg: 'bg-[#3D4537]',
      },
      demoUrl: 'https://nexuspos.smkn1.sch.id',
      githubUrl: 'https://github.com/raniputri/nexus-pos',
      accentColor: '#10B981',
      badge: 'CLIENT DEPLOYED',
      highlights: [
        'Digunakan langsung oleh Koperasi Siswa dan Unit Produksi SMKN 1',
        'Tetap bekerja 100% normal saat koneksi internet sekolah terputus',
        'Mendukung scan barcode kamera dan barcode scanner USB',
      ],
      year: '2025',
      active: true,
    },
    {
      id: 'port-3',
      title: 'Lumina: Micro-SaaS AI Markdown Docs Generator',
      description:
        'Platform generator dokumentasi teknis berbasis AI yang secara otomatis merangkum commit log repository GitHub menjadi buku panduan interaktif.',
      category: 'portfolio',
      tag: 'AI PLATFORM',
      techStack: ['Next.js 14', 'OpenAI API', 'Supabase', 'Stripe Mock', 'Tailwind'],
      member: {
        username: '@dimasweb',
        name: 'Dimas Prasetyo',
        className: 'XII RPL 2',
        role: 'Lead Divisi Web',
        avatarInitial: 'DP',
        avatarBg: 'bg-[#5C6E52]',
      },
      demoUrl: 'https://lumina-docs.smkn1.sch.id',
      githubUrl: 'https://github.com/dimasweb/lumina-docs',
      accentColor: '#8B5CF6',
      badge: 'FULLSTACK SAAS',
      highlights: [
        'Dipamerkan pada sesi final interview magang di Software House Surabaya',
        'Arsitektur edge-functions dengan streaming token AI ultra responsif',
        'Export multi-format: Docusaurus, Mintlify, dan PDF resmi',
      ],
      year: '2026',
      active: true,
    },
    {
      id: 'port-4',
      title: 'Pulse: Cross-Platform Student Schedule Mobile',
      description:
        'Aplikasi mobile jadwal pelajaran dinamis, pengingat deadline tugas, dan forum diskusi antar kelas dengan sinkronisasi push notification.',
      category: 'portfolio',
      tag: 'MOBILE APPS',
      techStack: ['Flutter', 'Dart', 'Firebase Cloud Messaging', 'Riverpod'],
      member: {
        username: '@nabilaputri',
        name: 'Nabila Putri',
        className: 'XI RPL 1',
        role: 'Mobile UI/UX Developer',
        avatarInitial: 'NP',
        avatarBg: 'bg-[#1E3A4C]',
      },
      demoUrl: 'https://pulse.smkn1.sch.id',
      githubUrl: 'https://github.com/nabilaputri/pulse-mobile',
      accentColor: '#EC4899',
      badge: 'APP STORE READY',
      highlights: [
        'Telah diuji oleh 400+ siswa SMKN 1 Surabaya aktif',
        'Dukungan widget homescreen Android & iOS real-time',
        'Animasi 60 FPS mulus di semua spesifikasi smartphone',
      ],
      year: '2026',
      active: true,
    },
  ],
  prestasiMembers: [
    {
      id: 'prestasi-1',
      name: 'Rani Putri',
      username: '@raniputri',
      role: 'KETUA IT CLUB • XII RPL 1',
      className: 'XII RPL 1',
      avatarInitial: 'RP',
      avatarBg: 'bg-[#3D4537]',
      quote:
        'Satu portal untuk semua urusan ekskul. Pengumpulan tugas tidak lagi tercecer di grup chat, dan absensi tiap sesi tercatat rapi serta transparan bagi seluruh anggota.',
      fullStory:
        'Bergabung sejak kelas X dengan bekal dasar HTML, pembinaan intensif di IT Club SMKN 1 Surabaya melatih saya menguasai arsitektur fullstack modern, kepemimpinan tim, serta kedisiplinan eksekusi. Melalui bimbingan mentor lomba, saya berhasil menembus podium LKS tingkat provinsi dan memimpin puluhan anggota membangun aplikasi nyata.',
      achievements: [
        {
          title: 'Juara 1 LKS Web Technologies Kota Surabaya',
          year: '2025',
          badge: 'MEDALI EMAS',
        },
        {
          title: 'Medali Perak (Juara 2) LKS Web Technologies Tingkat Provinsi Jawa Timur',
          year: '2025',
          badge: 'MEDALI PERAK',
        },
        {
          title: 'Finalis Nasional UI/UX Competition IT FEST',
          year: '2024',
          badge: 'TOP 5 NASIONAL',
        },
      ],
      skills: ['Next.js', 'TypeScript', 'TailwindCSS', 'PostgreSQL', 'Project Leadership'],
      githubUrl: 'https://github.com/raniputri',
      portfolioUrl: 'https://raniputri.dev',
      verified: true,
      active: true,
    },
    {
      id: 'prestasi-2',
      name: 'Dimas Prasetyo',
      username: '@dimasweb',
      role: 'LEAD DIVISI WEB • XII RPL 2',
      className: 'XII RPL 2',
      avatarInitial: 'DP',
      avatarBg: 'bg-[#5C6E52]',
      quote:
        'Deadline dan feedback mentor terlihat jelas sejak awal. Anggota tim kami jadi jauh lebih termotivasi menyelesaikan proyek coding mingguan dan memantau peringkat di leaderboard.',
      fullStory:
        'Di IT Club, kurikulum pembelajarannya tidak sekadar teori buku, melainkan studi kasus riil industri. Kami diajari cara review code, pull request di GitHub, hingga handling performa aplikasi skala besar. Prestasi juara hackathon yang saya raih adalah buah dari konsistensi latihan mingguan di Lab Komputer SMKN 1 Surabaya.',
      achievements: [
        {
          title: 'Juara 1 Hackathon Pelajar Jawa Timur (Kategori Inovasi Publik)',
          year: '2025',
          badge: 'JUARA 1',
        },
        {
          title: 'Juara 2 LKS IT Software Solutions for Business Surabaya',
          year: '2025',
          badge: 'RUNNER UP',
        },
        {
          title: 'Sertifikasi Internasional Oracle Java Foundations Certified',
          year: '2024',
          badge: 'CERTIFIED',
        },
      ],
      skills: ['React', 'Next.js', 'Node.js', 'GraphQL', 'Docker', 'System Design'],
      githubUrl: 'https://github.com/dimasweb',
      portfolioUrl: 'https://dimasweb.dev',
      verified: true,
      active: true,
    },
    {
      id: 'prestasi-3',
      name: 'Ayu Lestari',
      username: '@ayulestari',
      role: 'ALUMNI IT CLUB • SOFTWARE ENGINEER',
      className: 'Alumni 2024',
      avatarInitial: 'AL',
      avatarBg: 'bg-[#2E332A]',
      quote:
        'Portofolio proyek nyata yang saya bangun di IT Club SMKN 1 Surabaya menjadi modal utama saat uji kompetensi kejuruan dan wawancara kerja di industri teknologi.',
      fullStory:
        'Banyak alumni SMK kesulitan saat wawancara kerja karena hanya punya sertifikat tanpa portofolio hidup. Berkat portofolio proyek yang di-host online saat aktif di IT Club, tim rekruter di tech company langsung tertarik melihat live demo dan clean code saya. Kini saya bekerja penuh sebagai Software Engineer profesional.',
      achievements: [
        {
          title: 'Alumni Sukses: Bekerja sebagai Software Engineer di Perusahaan Teknologi',
          year: '2024 - Sekarang',
          badge: 'CAREER SUCCESS',
        },
        {
          title: 'Juara 2 LKS Nasional IT Network System Administration',
          year: '2024',
          badge: 'NASIONAL',
        },
        {
          title: 'Penerima Beasiswa Talenta Digital Prestasi Kejuruan',
          year: '2023',
          badge: 'TALENTA',
        },
      ],
      skills: ['TypeScript', 'Go', 'Kubernetes', 'Microservices', 'PostgreSQL', 'AWS'],
      githubUrl: 'https://github.com/ayulestari',
      portfolioUrl: 'https://ayulestari.dev',
      verified: true,
      active: true,
    },
    {
      id: 'prestasi-4',
      name: 'Budi Santoso',
      username: '@budi_tkj',
      role: 'TIM LKS CLOUD COMPUTING • XII TKJ 1',
      className: 'XII TKJ 1',
      avatarInitial: 'BS',
      avatarBg: 'bg-[#1E3A4C]',
      quote:
        'Dukungan fasilitas lab komputer bertenaga tinggi dan instruktur di IT Club membukakan jalan bagi saya memahami arsitektur cloud server sejak masih berseragam putih abu-abu.',
      fullStory:
        'Sebelum bergabung, saya hanya mengenal jaringan kabel dasar. Pembinaan di IT Club mengenalkan saya pada dunia virtualisasi, kontainerisasi, dan otomatisasi deployment modern. Hal ini menjadi keunggulan kompetitif saat bersaing di ajang LKS Cloud Computing se-Jawa Timur.',
      achievements: [
        {
          title: 'Juara Harapan 1 LKS Cloud Computing Tingkat Provinsi Jawa Timur',
          year: '2025',
          badge: 'PROVINSI',
        },
        {
          title: 'AWS Certified Cloud Practitioner (Accredited)',
          year: '2025',
          badge: 'CERTIFIED',
        },
        {
          title: 'Juara 2 Olimpiade Jaringan & Keamanan Komputer Surabaya',
          year: '2024',
          badge: 'JUARA 2',
        },
      ],
      skills: ['AWS', 'Proxmox', 'Linux', 'Docker', 'Networking', 'Python'],
      githubUrl: 'https://github.com/buditkj',
      portfolioUrl: 'https://budi-infra.dev',
      verified: true,
      active: true,
    },
  ],
};

export async function GET() {
  try {
    await requireAdmin();

    const record = await db
      .select()
      .from(settings)
      .where(eq(settings.key, 'showcase_config'))
      .get();

    let config = DEFAULT_CONFIG;
    if (record && record.value) {
      try {
        const parsed = JSON.parse(record.value);
        config = {
          labProjects: Array.isArray(parsed.labProjects) ? parsed.labProjects : DEFAULT_CONFIG.labProjects,
          portfolioProjects: Array.isArray(parsed.portfolioProjects) ? parsed.portfolioProjects : DEFAULT_CONFIG.portfolioProjects,
          prestasiMembers: Array.isArray(parsed.prestasiMembers) ? parsed.prestasiMembers : DEFAULT_CONFIG.prestasiMembers,
        };
      } catch (err) {
        console.warn('Failed parsing showcase_config setting, using default:', err);
      }
    }

    // Get registered members from database for user selection
    const registeredUsers = await db
      .select({
        id: users.id,
        name: users.name,
        username: users.username,
        role: users.role,
        className: users.className,
        avatarUrl: users.avatarUrl,
        bio: users.bio,
      })
      .from(users)
      .orderBy(asc(users.name))
      .all();

    return NextResponse.json({
      config,
      users: registeredUsers,
    });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || 'Gagal memuat konfigurasi showcase' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { config } = body;

    if (!config) {
      return NextResponse.json(
        { error: 'Data konfigurasi wajib disertakan' },
        { status: 400 }
      );
    }

    const stringValue = JSON.stringify(config);
    const existing = await db
      .select()
      .from(settings)
      .where(eq(settings.key, 'showcase_config'))
      .get();

    if (existing) {
      await db
        .update(settings)
        .set({ value: stringValue, updatedAt: new Date() })
        .where(eq(settings.key, 'showcase_config'));
    } else {
      await db.insert(settings).values({
        key: 'showcase_config',
        value: stringValue,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Pengaturan showcase karya & member berhasil disimpan',
    });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || 'Gagal menyimpan konfigurasi showcase' },
      { status: 500 }
    );
  }
}
