export const dashboardPath = (role) =>
  role === "admin" ? "/dashboard/admin" : role === "technician" ? "/dashboard/technician" : "/dashboard/customer";

export const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-";

export const formatDateTime = (d) =>
  d
    ? new Date(d).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })
    : "-";

export const formatMoney = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(Number(n) || 0);

export const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("") || "U";

/** only allow same-site redirects (no open redirect) */
export const safeRedirect = (value) => (value && value.startsWith("/") && !value.startsWith("//") ? value : null);

export const monthLabel = (ym) => {
  const [y, m] = ym.split("-");
  return new Date(Date.UTC(+y, +m - 1, 1)).toLocaleString("en-US", { month: "short", timeZone: "UTC" });
};

export const cn = (...c) => c.filter(Boolean).join(" ");

export const todayString = () => {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
};

export const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(",")[1]);
    r.onerror = () => reject(new Error("Could not read the image"));
    r.readAsDataURL(file);
  });
