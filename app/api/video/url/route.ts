import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { headers } from "next/headers";
import { rateLimit } from "@/lib/rate-limiter";
import { getIp } from "@/lib/get-ip";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(req: Request) {
  const hdrs = await headers();
  const ip = getIp(hdrs);

  const allowed = await rateLimit(ip, "video_url", 20, 60);
  if (!allowed) {
    await new Promise(res => setTimeout(res, 50));
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const id = new URL(req.url).searchParams.get("id");

  if (!id || !UUID_REGEX.test(id)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const supabase = supabaseServer();

  const { data: row } = await supabase
    .from("videos")
    .select("video_url, status, expires_at")
    .eq("id", id)
    .single();

  if (!row || row.status !== "finished" || !row.video_url) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const allowedExt = [".mp4", ".mov", ".webm", ".m4v"];
  const lower = row.video_url.toLowerCase();
  const hasExt = allowedExt.some(ext => lower.endsWith(ext));

  if (!hasExt) {
    await supabase
      .from("videos")
      .update({ status: "error", error_details: "invalid_upload" })
      .eq("id", id);

    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const pathParts = row.video_url.split("/");
  const fileName = pathParts[pathParts.length - 1];

  const { data: files, error: listErr } = await supabase.storage
    .from("videos")
    .list("", {
      search: fileName
    });

  if (listErr || !files || files.length === 0) {
    await supabase
      .from("videos")
      .update({ status: "error", error_details: "invalid_upload" })
      .eq("id", id);

    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const file = files[0];
  const size = file?.metadata?.size ?? 0;

  if (!size || size <= 0) {
    await supabase
      .from("videos")
      .update({ status: "error", error_details: "invalid_upload" })
      .eq("id", id);

    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const now = Date.now();
  const expiry = row.expires_at ? new Date(row.expires_at).getTime() : 0;

  if (expiry && expiry > now) {
    const remaining = Math.floor((expiry - now) / 1000);

    const { data: signedValid } = await supabase.storage
      .from("videos")
      .createSignedUrl(row.video_url, remaining);

    if (!signedValid?.signedUrl) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ signedUrl: signedValid.signedUrl });
  }

  const newTtl = 60 * 60 * 24 * 7;

  const { data: signedNew } = await supabase.storage
    .from("videos")
    .createSignedUrl(row.video_url, newTtl);

  if (!signedNew?.signedUrl) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await supabase
    .from("videos")
    .update({
      expires_at: new Date(Date.now() + newTtl * 1000)
    })
    .eq("id", id);

  return NextResponse.json({
    signedUrl: signedNew.signedUrl
  });
}