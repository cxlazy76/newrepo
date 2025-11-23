declare const gtag: any;

export function gaEvent(name: string, params: any = {}) {
  if (typeof window === "undefined") return;
  if (!gtag) return;

  gtag("event", name, params);
}