import { NextRequest, NextResponse } from "next/server";
import {
  submitCreationRequest,
  getAllRequests,
  updateRequestStatus,
} from "@/lib/data/events";

export async function GET() {
  try {
    const requests = await getAllRequests();
    return NextResponse.json({ success: true, data: requests });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { client_name, client_email, client_phone, event_type, payload_data } = body;

    if (!client_name || !client_email || !client_phone) {
      return NextResponse.json(
        { error: "Nama, email, dan nomor WhatsApp wajib diisi." },
        { status: 400 }
      );
    }

    const newRequest = await submitCreationRequest({
      client_name,
      client_email,
      client_phone,
      event_type: event_type || "wedding",
      payload_data: payload_data || {},
    });

    return NextResponse.json({ success: true, data: newRequest });
  } catch (err: any) {
    console.error("API Requests POST error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "ID dan status wajib disertakan." },
        { status: 400 }
      );
    }

    const updated = await updateRequestStatus(id, status);
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

