import { NextRequest, NextResponse } from "next/server";
import { getAllEvents } from "@/lib/data/events";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export async function GET() {
  try {
    const events = await getAllEvents();
    return NextResponse.json({ success: true, data: events });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, slug, event_type, event_date, theme_config, is_published } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: "Title dan Slug wajib diisi." }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      const supabase = createSupabaseAdminClient();
      const { data, error } = await supabase
        .from("events")
        .insert({
          title,
          slug,
          event_type: event_type || "wedding",
          event_date: event_date || new Date().toISOString(),
          theme_config: theme_config || {},
          is_published: is_published ?? true,
        })
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, data });
    }

    // Demo fallback response
    return NextResponse.json({
      success: true,
      data: {
        id: `ev-${Date.now()}`,
        title,
        slug,
        event_type,
        event_date,
        theme_config,
        is_published,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

