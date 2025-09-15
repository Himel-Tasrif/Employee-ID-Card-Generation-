"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import Cropper from "cropperjs";
import { removeBackgroundCanvas, canvasToFile } from "@/lib/imageProcessing";
import { Upload, Check, X, RefreshCw, Download } from "lucide-react";

/** Quick probe to check if a canvas is "mostly white" */
function isCanvasMostlyWhite(canvas: HTMLCanvasElement, samples = 1000): boolean {
  try {
    const ctx = canvas.getContext("2d")!;
    const { width: W, height: H } = canvas;
    const data = ctx.getImageData(0, 0, W, H).data;
    let whiteish = 0;
    for (let i = 0; i < samples; i++) {
      const x = ((Math.random() * W) | 0) * 4;
      const y = ((Math.random() * H) | 0) * 4;
      const p = (y * W + x) * 1;
      const r = data[p], g = data[p + 1], b = data[p + 2];
      if (r > 245 && g > 245 && b > 245) whiteish++;
    }
    return whiteish / samples > 0.95;
  } catch {
    return false;
  }
}

type Props = {
  open: boolean;
  onClose: () => void;
  onApply: (file: File) => void;
  initialFile?: File | null;
};

export default function PhotoProcessor({ open, onClose, onApply, initialFile }: Props) {
  const [file, setFile] = useState<File | null>(initialFile || null);
  const [processing, setProcessing] = useState(false);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [origURL, setOrigURL] = useState<string | null>(null);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const cropperRef = useRef<any>(null);
  const processedCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // reset on close
  useEffect(() => {
    if (!open) {
      try { cropperRef.current?.destroy?.(); } catch {}
      cropperRef.current = null;
      setPreviewURL(null);
      setFile(initialFile || null);
      processedCanvasRef.current = null;

      if (origURL) {
        URL.revokeObjectURL(origURL);
        setOrigURL(null);
      }
    }
  }, [open, initialFile]); // eslint-disable-line react-hooks/exhaustive-deps

  // init cropper after <img> loads
  useEffect(() => {
    if (!previewURL || !imgRef.current) return;
    const el = imgRef.current;

    const init = () => {
      try {
        cropperRef.current?.destroy?.();
        const options: any = {
          viewMode: 1,
          dragMode: "move",
          aspectRatio: 1,
          autoCrop: true,
          autoCropArea: 1,
          responsive: true,
          background: false,
        };
        cropperRef.current = new (Cropper as any)(el, options);
      } catch (err) {
        console.error("Cropper init failed", err);
      }
    };

    if (el.complete && el.naturalWidth > 0) init();
    else {
      const onLoad = () => { el.removeEventListener("load", onLoad); init(); };
      el.addEventListener("load", onLoad);
      return () => el.removeEventListener("load", onLoad);
    }
  }, [previewURL]);

  const handlePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    if (origURL) URL.revokeObjectURL(origURL);
    setOrigURL(f ? URL.createObjectURL(f) : null);
  };

  // Auto Process = background removal only (no face detect, no auto-crop)
  const runAutoCrop = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const canvas = await removeBackgroundCanvas(file);

      if (!canvas || canvas.width < 8 || canvas.height < 8) {
        alert("Could not decode this image. Try a different photo (JPG/JPEG/PNG).");
        setProcessing(false);
        return;
      }

      if (isCanvasMostlyWhite(canvas)) {
        console.warn("Processed canvas appears blank. Falling back to original for manual crop.");
        processedCanvasRef.current = null;
        setPreviewURL(origURL ?? URL.createObjectURL(file));
        return;
      }

      processedCanvasRef.current = canvas;
      setPreviewURL(canvas.toDataURL("image/png"));
    } catch (e) {
      console.error(e);
      alert("Failed to process image. Please try a different photo.");
    } finally {
      setProcessing(false);
    }
  };

  const handleApply = async () => {
    let c: HTMLCanvasElement | null = null;

    if (cropperRef.current && imgRef.current) {
      c = cropperRef.current.getCroppedCanvas?.({
        width: 1024,
        height: 1024,
        imageSmoothingEnabled: true,
      }) as HTMLCanvasElement;
    } else if (processedCanvasRef.current) {
      c = processedCanvasRef.current;
    }
    if (!c) return;

    const f = await canvasToFile(c, "portrait.png");
    onApply(f);
    onClose();
  };

  const handleDownload = async () => {
    if (!previewURL) return;
    let c: HTMLCanvasElement | null = null;

    if (cropperRef.current && imgRef.current) {
      c = cropperRef.current.getCroppedCanvas?.({
        width: 1024,
        height: 1024,
        imageSmoothingEnabled: true,
      }) as HTMLCanvasElement;
    } else if (processedCanvasRef.current) {
      c = processedCanvasRef.current;
    }
    if (!c) return;

    const a = document.createElement("a");
    a.href = c.toDataURL("image/png");
    a.download = "processed_portrait.png";
    a.click();
  };

  if (!open) return null;

  // high-contrast disabled styles
  const disabledBtn =
    "bg-gray-100 text-gray-700 border border-gray-300 cursor-not-allowed";
  const useBtn =
    previewURL
      ? "bg-green-600 text-white hover:bg-green-700"
      : disabledBtn;
  const downloadBtn =
    previewURL
      ? "bg-gray-900 text-white hover:bg-black"
      : disabledBtn;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* modal */}
      <div className="absolute inset-x-0 top-10 mx-auto w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-6 relative z-[101]">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Process Photo</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-700"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* uploader */}
        {!file && (
          <label className="mt-4 block border-2 border-dashed border-gray-500/70 rounded-xl p-10 text-center cursor-pointer bg-white hover:border-blue-600 hover:bg-blue-50/60 shadow-sm transition">
            <input type="file" accept="image/*" onChange={handlePick} className="hidden" />
            <Upload className="w-9 h-9 text-gray-600 mx-auto mb-3" />
            <div className="text-sm text-gray-800 font-medium">Click to upload or drag &amp; drop</div>
            <div className="text-xs text-gray-700 mt-1">PNG, JPG up to 10MB</div>
          </label>
        )}

        {/* actions */}
        {file && (
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={runAutoCrop}
              disabled={processing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 flex items-center gap-2"
            >
              {processing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              Auto Process
            </button>

            <button
              onClick={handleDownload}
              disabled={!previewURL}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${downloadBtn}`}
            >
              <Download className="w-4 h-4" />
              Download Processed
            </button>

            <div className="text-xs text-gray-600">
              Tip: After auto process, you can drag/zoom the image to adjust.
            </div>
          </div>
        )}

        {/* preview/cropper */}
        {previewURL && (
          <div className="mt-6 grid place-items-center">
            <img
              ref={imgRef}
              src={previewURL}
              alt="Processed preview"
              className="max-h-[420px] rounded-xl border"
            />
          </div>
        )}

        {/* footer */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-800 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={!previewURL}
            className={`px-4 py-2 rounded-lg font-medium ${useBtn}`}
          >
            <span className="inline-flex items-center gap-2">
              <Check className="w-4 h-4" />
              Use This Photo
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
