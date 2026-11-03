import { NextRequest, NextResponse } from "next/server";
import { addGuestWish } from "@/lib/data/events";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event_id, name, attendance_status, message } = body;

    if (!event_id || !name || !message) {
      return NextResponse.json(
        { error: "Event ID, nama, dan pesan wajib diisi." },
        { status: 400 }
      );
    }

    const wish = await addGuestWish({
      event_id,
      name,
      attendance_status: attendance_status || "attending",
      message,
    });

    return NextResponse.json({ success: true, data: wish });
  } catch (err: any) {
    console.error("API Wishes POST error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

