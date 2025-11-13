import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const u = new URL(req.url);
    const videoUrl = u.searchParams.get("videoUrl");

    if (!videoUrl) {
      return NextResponse.json({ error: "videoUrl is required" }, { status: 400 });
    }

    const ready = await checkAccessible(videoUrl);
    return NextResponse.json({ ready, videoUrl });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}

async function checkAccessible(url: string) {
  try {
    const head = await fetch(url, { method: "HEAD", cache: "no-store" });
    if (head.ok) return true;
  } catch {}

  try {
    const get = await fetch(url, {
      method: "GET",
      headers: { Range: "bytes=0-0" },
      cache: "no-store",
    });
    if (get.ok) return true;
  } catch {}

  return false;
}
