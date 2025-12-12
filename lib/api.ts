export function jsonError(message: string, status: number = 400) {
  return Response.json({ error: message }, { status });
}