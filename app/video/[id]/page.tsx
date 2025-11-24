export const revalidate = 3600;

import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabaseServer";
import { headers } from "next/headers";
import { getIp } from "@/lib/get-ip";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function VideoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!UUID_REGEX.test(id)) notFound();

  const supabase = supabaseServer();

  const hdrs = await headers();

  await supabase.from("analytics_page_views").insert({
    path: `/video/${id}`,
    ip: getIp(hdrs),
    ua: hdrs.get("user-agent") || ""
  });

  const { data: row } = await supabase
    .from("videos")
    .select("video_url, status, expires_at")
    .eq("id", id)
    .single();

  if (!row) notFound();
  if (row.status !== "finished") notFound();
  if (!row.video_url.endsWith(".mp4")) notFound();

  const now = Date.now();
  const expiry = row.expires_at ? new Date(row.expires_at).getTime() : 0;

  if (expiry && expiry > now) {
    const remaining = Math.floor((expiry - now) / 1000);

    const { data: signedValid } = await supabase.storage
      .from("videos")
      .createSignedUrl(row.video_url, remaining);

    if (!signedValid?.signedUrl) notFound();

    return (
      <>
        <video controls src={signedValid.signedUrl} />
        <a href={signedValid.signedUrl} download>Download</a>
      </>
    );
  }

  const newTtl = 60 * 60 * 24 * 7;

  const { data: signedNew } = await supabase.storage
    .from("videos")
    .createSignedUrl(row.video_url, newTtl);

  if (!signedNew?.signedUrl) notFound();

  await supabase
    .from("videos")
    .update({
      expires_at: new Date(Date.now() + newTtl * 1000)
    })
    .eq("id", id);

  return (
    <>
      <video controls src={signedNew.signedUrl} />
      <a href={signedNew.signedUrl} download>Download</a>
    </>
  );
}