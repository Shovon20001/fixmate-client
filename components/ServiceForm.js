"use client";
import { useState } from "react";
import { CATEGORIES, MODES } from "@/lib/constants";
import ImageUploader from "./ImageUploader";

const empty = { title: "", category: "", description: "", basePrice: "", estimatedDuration: "", serviceMode: "", serviceArea: "", image: "" };

/** Shared by "Add a Service" and the edit modal in "My Services". */
export default function ServiceForm({ initial, user, onSubmit, submitLabel = "Save service", onCancel }) {
  const [form, setForm] = useState({ ...empty, ...(initial || {}), basePrice: initial?.basePrice ?? "" });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function validate() {
    const e = {};
    if (form.title.trim().length < 3) e.title = "Title must be at least 3 characters";
    if (!form.category) e.category = "Choose a category";
    if (form.description.trim().length < 20) e.description = "Describe the service in at least 20 characters";
    if (!(Number(form.basePrice) > 0)) e.basePrice = "Enter a price greater than 0";
    if (!form.estimatedDuration.trim()) e.estimatedDuration = "Enter the estimated duration, e.g. 2-3 hours";
    if (!form.serviceMode) e.serviceMode = "Choose a service mode";
    if (!form.serviceArea.trim()) e.serviceArea = "Enter the area you cover";
    if (!form.image) e.image = "Upload a service image";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    setBusy(true);
    try {
      await onSubmit({ ...form, basePrice: Number(form.basePrice) });
    } finally {
      setBusy(false);
    }
  }

  const Err = ({ k }) => (errors[k] ? <p className="field-error">{errors[k]}</p> : null);

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label" htmlFor="title">Title</label>
          <input id="title" className="input" value={form.title} onChange={set("title")} placeholder="e.g. iPhone Screen Replacement" />
          <Err k="title" />
        </div>
        <div>
          <label className="label" htmlFor="category">Category</label>
          <select id="category" className="input" value={form.category} onChange={set("category")}>
            <option value="">Select a category</option>
            {CATEGORIES.map((c) => <option key={c.slug} value={c.name}>{c.name}</option>)}
          </select>
          <Err k="category" />
        </div>
        <div>
          <label className="label" htmlFor="basePrice">Base price (USD)</label>
          <input id="basePrice" type="number" min="1" step="0.01" className="input" value={form.basePrice} onChange={set("basePrice")} placeholder="25" />
          <Err k="basePrice" />
        </div>
        <div>
          <label className="label" htmlFor="estimatedDuration">Estimated duration</label>
          <input id="estimatedDuration" className="input" value={form.estimatedDuration} onChange={set("estimatedDuration")} placeholder="2-3 hours" />
          <Err k="estimatedDuration" />
        </div>
        <div>
          <label className="label" htmlFor="serviceMode">Service mode</label>
          <select id="serviceMode" className="input" value={form.serviceMode} onChange={set("serviceMode")}>
            <option value="">Select a mode</option>
            {MODES.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <Err k="serviceMode" />
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="serviceArea">Service area</label>
          <input id="serviceArea" className="input" value={form.serviceArea} onChange={set("serviceArea")} placeholder="Dhanmondi, Dhaka" />
          <Err k="serviceArea" />
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="description">Description</label>
          <textarea id="description" rows={4} className="input" value={form.description} onChange={set("description")} placeholder="What does this service include?" />
          <Err k="description" />
        </div>
        <div className="sm:col-span-2">
          <ImageUploader label="Service image" value={form.image} onChange={(url) => setForm((f) => ({ ...f, image: url }))} />
          <Err k="image" />
        </div>
        <div>
          <label className="label">Technician name</label>
          <input className="input" value={user?.name || ""} readOnly disabled />
        </div>
        <div>
          <label className="label">Technician email</label>
          <input className="input" value={user?.email || ""} readOnly disabled />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        {onCancel && <button type="button" className="btn-outline" onClick={onCancel}>Cancel</button>}
        <button className="btn-primary" disabled={busy}>{busy ? "Saving..." : submitLabel}</button>
      </div>
    </form>
  );
}
