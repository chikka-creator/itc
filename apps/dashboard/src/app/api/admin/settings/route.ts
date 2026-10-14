import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/permissions';
import { db, settings, eq } from '@itc/db';

export async function GET() {
  try {
    await requireAdmin();

    const allSettings = await db.select().from(settings).all();
    const configMap: Record<string, any> = {};

    for (const item of allSettings) {
      try {
        configMap[item.key] = JSON.parse(item.value);
      } catch {
        configMap[item.key] = item.value;
      }
    }

    return NextResponse.json({ settings: configMap });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || 'Gagal memuat pengaturan' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { site_title, contact_email, contact_wa, contact_ig, point_weights } = body;

    const upsertSetting = async (key: string, val: any) => {
      const stringValue = JSON.stringify(val);
      const existing = await db
        .select()
        .from(settings)
        .where(eq(settings.key, key))
        .get();

      if (existing) {
        await db
          .update(settings)
          .set({ value: stringValue, updatedAt: new Date() })
          .where(eq(settings.key, key));
      } else {
        await db.insert(settings).values({
          key,
          value: stringValue,
        });
      }
    };

    if (site_title !== undefined) await upsertSetting('site_title', site_title);
    if (contact_email !== undefined) await upsertSetting('contact_email', contact_email);
    if (contact_wa !== undefined) await upsertSetting('contact_wa', contact_wa);
    if (contact_ig !== undefined) await upsertSetting('contact_ig', contact_ig);
    if (point_weights !== undefined) await upsertSetting('point_weights', point_weights);

    return NextResponse.json({ success: true });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || 'Gagal menyimpan pengaturan' },
      { status: 500 }
    );
  }
}
