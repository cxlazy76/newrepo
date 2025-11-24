export function sanitize(input: string): string {
  if (typeof input !== "string") return "";
  let x = input.replace(/<[^>]*>/g, "");
  x = x.replace(/\s+/g, " ").trim();
  if (x.length > 100) x = x.slice(0, 100);
  return x;
}

function looksNonsense(word: string): boolean {
  if (!/[aeiou]/i.test(word)) return true;
  if (/^(.)\1{2,}$/i.test(word)) return true;
  if (word.length > 12) return true;
  if (/[^a-z]/i.test(word)) return true;
  return false;
}

export function isInvalidMessage(msg: string): boolean {
  const m = msg.replace(/\s+/g, " ").trim();
  if (m.length < 40) return true;

  const letters = (m.match(/[a-zA-Z]/g) || []).length;
  if (letters < 10) return true;

  const digits = (m.match(/[0-9]/g) || []).length;
  if (digits / m.length > 0.2) return true;

  const freq: Record<string, number> = {};
  for (const ch of m) freq[ch] = (freq[ch] || 0) + 1;
  const max = Math.max(...Object.values(freq));
  if (max / m.length > 0.25) return true;

  if (!m.includes(" ")) return true;

  const words = m.split(" ").filter(Boolean);
  if (words.length < 6) return true;

  const nonsenseCount = words.filter(w => looksNonsense(w.toLowerCase())).length;
  if (nonsenseCount / words.length > 0.4) return true;

  const punctuation = m.match(/[.!?,]/g) || [];
  if (punctuation.length === 0) {
    if (words.length < 12) return true;
  }

  return false;
}
