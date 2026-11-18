// Used by Server Components (home page, service details) for public data.
const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

export async function serverFetch(path) {
  try {
    const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
    if (!res.ok) return { ok: false, status: res.status, data: null };
    return { ok: true, status: res.status, data: await res.json() };
  } catch {
    return { ok: false, status: 0, data: null };
  }
}
