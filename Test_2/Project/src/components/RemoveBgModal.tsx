"use client";

import { useEffect, useState } from "react";
import { X, ExternalLink } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  /** Override URL if needed, otherwise uses env or localhost */
  url?: string;
};

export default function RemoveBGModal({ open, onClose, url }: Props) {
  const [loaded, setLoaded] = useState(false);

  // Your Flask URL (change if you picked a different host/port)
  const src =
    url ||
    process.env.NEXT_PUBLIC_REMOVE_BG_URL ||
    "http://127.0.0.1:5001/";

  useEffect(() => {
    if (!open) setLoaded(false);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200]">
      {/* overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* modal & header */}
      <div className="absolute inset-0 md:inset-10 bg-white rounded-none md:rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-4 h-12 border-b bg-white">
          <div className="text-sm text-gray-600">
            Remove Background (Python · Flask)
          </div>
          <div className="flex items-center gap-2">
            <a
              href={src}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
              Open in new tab
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100"
              title="Back to ID Maker"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* loader */}
        {!loaded && (
          <div className="absolute inset-12 grid place-items-center pointer-events-none">
            <div className="animate-pulse text-sm text-gray-500">
              Loading remover…
            </div>
          </div>
        )}

        {/* the actual Flask UI */}
        <iframe
          src={src}
          className="w-full h-full"
          onLoad={() => setLoaded(true)}
        />
      </div>
    </div>
  );
}
