"use client";
import { useRef, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { fileToBase64 } from "@/lib/utils";

/** File input -> Express /api/upload -> ImgBB. onChange receives the hosted image URL. */
export default function ImageUploader({ value, onChange, label = "Image", round = false }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please choose an image file");
    if (file.size > 5 * 1024 * 1024) return toast.error("Image must be smaller than 5 MB");
    setBusy(true);
    try {
      const image = await fileToBase64(file);
      const { url } = await api("/api/upload", { method: "POST", body: { image } });
      onChange(url);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <span className="label">{label}</span>
      <div className="flex items-center gap-4">
        <div className={`flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden border border-dashed border-ink-200 bg-ink-50 ${round ? "rounded-full" : "rounded-xl"}`}>
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="Preview" className="h-full w-full object-cover" />
          ) : (
            <ImagePlus className="h-7 w-7 text-ink-300" />
          )}
        </div>
        <div>
          <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
          <button type="button" className="btn-outline" onClick={() => inputRef.current?.click()} disabled={busy}>
            {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Uploading...</> : value ? "Change image" : "Choose image"}
          </button>
          <p className="mt-1.5 text-xs text-ink-500">JPG or PNG, up to 5 MB. Hosted on ImgBB.</p>
        </div>
      </div>
    </div>
  );
}
