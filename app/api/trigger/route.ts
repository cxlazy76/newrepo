import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { message = null, character = null } = body;

    const N8N_WEBHOOK = process.env.N8N_WEBHOOK_URL;
    if (!N8N_WEBHOOK) {
      return NextResponse.json({ error: "N8N webhook missing" }, { status: 500 });
    }

    const webhookRes = await fetch(N8N_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, character }),
    });

    const isJson = (webhookRes.headers.get("content-type") || "").includes("application/json");
    const data = isJson ? await webhookRes.json() : { text: await webhookRes.text() };
    const videoUrl = data?.videoUrl ?? null;

    if (!videoUrl) {
      return NextResponse.json({ ready: false, videoUrl: null, detail: data });
    }

    return NextResponse.json({ ready: true, videoUrl });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}
