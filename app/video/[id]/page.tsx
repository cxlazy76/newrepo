export const revalidate = 3600;

import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabaseServer";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function VideoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!UUID_REGEX.test(id)) notFound();

  const supabase = supabaseServer();

  const { data: row } = await supabase
    .from("videos")
    .select("video_url, status")
    .eq("id", id)
    .single();

  if (!row) notFound();
  if (row.status !== "finished") notFound();
  if (!row.video_url.endsWith(".mp4")) notFound();

  const { data: signed } = await supabase.storage
    .from("videos")
    .createSignedUrl(row.video_url, 60 * 60 * 24 * 7);

  if (!signed?.signedUrl) notFound();

  return (
    <>
      <video controls src={signed.signedUrl} />
      <a href={signed.signedUrl} download>Download</a>
    </>
  );
}
