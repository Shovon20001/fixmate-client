"use client";

export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

let cache = { token: null, expires: 0 };
export const resetToken = () => (cache = { token: null, expires: 0 });

async function getToken() {
  if (cache.token && Date.now() < cache.expires) return cache.token;
  const res = await fetch("/api/token", { cache: "no-store" });
  if (!res.ok) throw new ApiError("Please sign in again", 401);
  const { token } = await res.json();
  cache = { token, expires: Date.now() + 50 * 60 * 1000 };
  return token;
}

const toQuery = (query) => {
  const p = new URLSearchParams();
  Object.entries(query || {}).forEach(([k, v]) => v !== "" && v != null && p.set(k, v));
  const s = p.toString();
  return s ? `?${s}` : "";
};

/** Browser helper: api("/api/bookings/my") - adds the JWT automatically for private routes. */
export async function api(path, { method = "GET", body, auth = true, query } = {}) {
  const run = async () => {
    const headers = { "Content-Type": "application/json" };
    if (auth) headers.Authorization = `Bearer ${await getToken()}`;
    return fetch(`${API_URL}${path}${toQuery(query)}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
  };

  let res = await run();
  if (res.status === 401 && auth) {
    resetToken(); // token may have expired - fetch a fresh one once
    res = await run();
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data.message || "Something went wrong", res.status);
  return data;
}
