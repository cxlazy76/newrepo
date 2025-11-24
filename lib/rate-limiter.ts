import { supabaseServer } from "@/lib/supabaseServer";

export async function rateLimit(ip: string, prefix: string, limit: number, windowSeconds: number) {
  const key = `${prefix}:${ip}`;
  const now = Math.floor(Date.now() / 1000);
  const supabase = supabaseServer();

  const { data } = await supabase
    .from("rate_limits")
    .select("count, reset")
    .eq("key", key)
    .maybeSingle();

  if (!data) {
    await supabase.from("rate_limits").insert({
      key,
      count: 1,
      reset: now + windowSeconds
    });
    return true;
  }

  if (now > data.reset) {
    await supabase
      .from("rate_limits")
      .update({ count: 1, reset: now + windowSeconds })
      .eq("key", key);
    return true;
  }

  if (data.count >= limit) {
    return false;
  }

  await supabase
    .from("rate_limits")
    .update({ count: data.count + 1 })
    .eq("key", key);

  return true;
}