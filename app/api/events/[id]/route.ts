import { NextRequest, NextResponse } from "next/server";
import { getEventById, saveEventSections } from "@/lib/data/events";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const event = await getEventById(id);
    if (!event) {
      return NextResponse.json({ error: "Event tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: event });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await req.json();
    const { event, sections } = body;

    if (sections) {
      await saveEventSections(id, sections);
    }

    if (event && isSupabaseConfigured()) {
      const supabase = createSupabaseAdminClient();
      await supabase
        .from("events")
        .update({
          title: event.title,
          slug: event.slug,
          event_type: event.event_type,
          event_date: event.event_date,
          theme_config: event.theme_config,
          is_published: event.is_published,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);
    }

    return NextResponse.json({ success: true, message: "Berhasil diperbarui" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

