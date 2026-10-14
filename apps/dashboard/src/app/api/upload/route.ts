import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

// Dangerous executable extensions blocklist
const BLOCKED_EXTENSIONS = [
  '.exe',
  '.bat',
  '.cmd',
  '.sh',
  '.php',
  '.phtml',
  '.msi',
  '.scr',
  '.vbs',
  '.ps1',
];

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Tidak ada berkas yang diunggah' }, { status: 400 });
    }

    // Validate size: 100MB max as required by PLAN.md
    const MAX_SIZE = 100 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'Ukuran file melebihi batas maksimal 100MB' },
        { status: 400 }
      );
    }

    // Security: Check extension against blocked extensions
    const lowerName = file.name.toLowerCase();
    const isBlocked = BLOCKED_EXTENSIONS.some((ext) => lowerName.endsWith(ext));
    if (isBlocked) {
      return NextResponse.json(
        { error: 'Tipe file ini tidak diperbolehkan demi keamanan sistem.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir, { recursive: true });
    }

    // Sanitize and create unique filename
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueFileName = `${Date.now()}-${safeName}`;
    const filePath = join(uploadsDir, uniqueFileName);

    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/${uniqueFileName}`;

    return NextResponse.json({
      success: true,
      url: fileUrl,
      fileUrl,
      fileName: file.name,
      fileSize: file.size,
    });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: 'Gagal mengunggah berkas' },
      { status: 500 }
    );
  }
}
