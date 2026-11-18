export const CATEGORIES = [
  { name: "Smartphone", slug: "smartphone", blurb: "Screens, batteries, charging ports" },
  { name: "Laptop & PC", slug: "laptop", blurb: "Servicing, upgrades, data recovery" },
  { name: "AC", slug: "ac", blurb: "Gas refill, cleaning, installation" },
  { name: "Refrigerator", slug: "refrigerator", blurb: "Cooling faults and compressor care" },
  { name: "TV", slug: "tv", blurb: "Panels, backlights, smart TV software" },
  { name: "Washing Machine", slug: "washing", blurb: "Drum, drain and motor repairs" },
  { name: "Electrical", slug: "electrical", blurb: "Wiring, switches, fittings" },
];

export const MODES = ["Home Visit", "Shop Drop-off"];

export const categoryImage = (name) =>
  `/images/services/${CATEGORIES.find((c) => c.name === name)?.slug || "electrical"}.svg`;

export const JOB_STATUSES = ["requested", "accepted", "in-progress", "completed", "rejected", "cancelled"];

export const STATUS_LABEL = {
  requested: "Requested",
  accepted: "Accepted",
  "in-progress": "In Progress",
  completed: "Completed",
  rejected: "Rejected",
  cancelled: "Cancelled",
  paid: "Paid",
  unpaid: "Unpaid",
  pending: "Pending",
  approved: "Approved",
};

// one colour language for every dashboard
export const STATUS_STYLE = {
  requested: "bg-blue-50 text-blue-700 ring-blue-200",
  accepted: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  "in-progress": "bg-amber-50 text-amber-800 ring-amber-200",
  completed: "bg-green-50 text-green-700 ring-green-200",
  rejected: "bg-red-50 text-red-700 ring-red-200",
  cancelled: "bg-slate-100 text-slate-600 ring-slate-300",
  paid: "bg-green-50 text-green-700 ring-green-200",
  unpaid: "bg-orange-50 text-orange-700 ring-orange-200",
  pending: "bg-amber-50 text-amber-800 ring-amber-200",
  approved: "bg-green-50 text-green-700 ring-green-200",
};

export const STATUS_CHART_COLOR = {
  requested: "#3b82f6",
  accepted: "#6366f1",
  "in-progress": "#f59e0b",
  completed: "#16a34a",
  rejected: "#dc2626",
  cancelled: "#94a3b8",
};
