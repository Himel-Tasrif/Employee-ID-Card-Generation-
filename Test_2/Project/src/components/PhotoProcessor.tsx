"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import Cropper from "cropperjs";
import { autoCropToSquare, canvasToFile } from "@/lib/imageProcessing";
import { Upload, Check, X, RefreshCw, Download } from "lucide-react";

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

  const imgRef = useRef<HTMLImageElement | null>(null);

  // NOTE: cast to `any` to avoid TS friction from mismatched cropper typings
  const cropperRef = useRef<any>(null);
  const processedCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // reset on close
  useEffect(() => {
    if (!open) {
      try {
        cropperRef.current?.destroy?.(); // typed as any
      } catch {}
      cropperRef.current = null;
      setPreviewURL(null);
      setFile(initialFile || null);
    }
  }, [open, initialFile]);

  const handlePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const runAutoCrop = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const canvas = await autoCropToSquare(file, { outSize: 1024 });
      processedCanvasRef.current = canvas;
      setPreviewURL(canvas.toDataURL("image/png"));

      // init cropper after img is in the DOM
      setTimeout(() => {
        if (!imgRef.current) return;
        try {
          // destroy previous instance if any
          cropperRef.current?.destroy?.();

          // options casted as any to avoid TS errors about option names
          const options: any = {
            viewMode: 1,
            dragMode: "move",
            aspectRatio: 1,
            autoCrop: true,
            autoCropArea: 1,
            responsive: true,
            background: false,
          };

          cropperRef.current = new (Cropper as any)(imgRef.current, options);
        } catch (err) {
          console.error("Cropper init failed", err);
        }
      }, 0);
    } catch (e) {
      alert("Failed to process image. Please try a different photo.");
      console.error(e);
    } finally {
      setProcessing(false);
    }
  };

  const handleApply = async () => {
    if (cropperRef.current && imgRef.current) {
      // use cropper’s current view to build the final 1024x1024 canvas
      const c: HTMLCanvasElement = cropperRef.current.getCroppedCanvas?.({
        width: 1024,
        height: 1024,
        imageSmoothingEnabled: true,
      }) as HTMLCanvasElement;

      if (c) processedCanvasRef.current = c;
    }

    if (!processedCanvasRef.current) return;

    const f = await canvasToFile(processedCanvasRef.current, "portrait.png");
    onApply(f);
    onClose();
  };

  const handleDownload = async () => {
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

  return (
    <div className="fixed inset-0 z-[100]">
      {/* overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* modal */}
      <div className="absolute inset-x-0 top-10 mx-auto w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Process Photo</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* uploader */}
        {!file && (
          <label className="mt-4 block border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
            <input type="file" accept="image/*" onChange={handlePick} className="hidden" />
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <div className="text-sm text-gray-600">Click to upload or drag & drop</div>
            <div className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</div>
          </label>
        )}

        {/* actions */}
        {file && (
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={runAutoCrop}
              disabled={processing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 flex items-center gap-2"
            >
              {processing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              Auto Process
            </button>

            <button
              onClick={handleDownload}
              disabled={!previewURL}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black disabled:bg-gray-300 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Processed
            </button>

            <div className="text-xs text-gray-500">Tip: After auto process, you can drag/zoom the image to adjust.</div>
          </div>
        )}

        {/* preview/cropper */}
        {previewURL && (
          <div className="mt-6 grid place-items-center">
            <img ref={imgRef} src={previewURL} alt="Processed preview" className="max-h-[420px] rounded-xl border" />
          </div>
        )}

        {/* footer */}
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={!previewURL}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Use This Photo
          </button>
        </div>
      </div>
    </div>
  );
}
