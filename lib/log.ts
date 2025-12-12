export async function logView(path: string) {
  try {
    await fetch("/api/log/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path })
    });
  } catch {}
}