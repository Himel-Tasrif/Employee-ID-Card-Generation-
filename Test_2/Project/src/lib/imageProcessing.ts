/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { getHuman } from "./human";

/** Robustly load any image File into an <img> */
async function fileToImage(file: File): Promise<HTMLImageElement> {
  const dataUrl = await new Promise<string>((res, rej) => {
    const fr = new FileReader();
    fr.onerror = () => rej(new Error("FileReader failed"));
    fr.onload = () => res(String(fr.result));
    fr.readAsDataURL(file);
  });

  return await new Promise<HTMLImageElement>((res, rej) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => res(img);
    img.onerror = () => rej(new Error("Image decode failed"));
    img.src = dataUrl;
  });
}

/** Draw <img> on a canvas (optionally downscale huge sources) */
function imageToCanvas(img: HTMLImageElement, maxSide = 2200): HTMLCanvasElement {
  const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
  const W = Math.max(1, Math.round(img.naturalWidth * scale));
  const H = Math.max(1, Math.round(img.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, W, H);
  return canvas;
}

/** Create a white background canvas of the same size */
function makeWhiteBg(width: number, height: number): HTMLCanvasElement {
  const bg = document.createElement("canvas");
  bg.width = width;
  bg.height = height;
  const g = bg.getContext("2d")!;
  g.fillStyle = "#fff";
  g.fillRect(0, 0, width, height);
  return bg;
}

/** canvas -> File (PNG) */
export async function canvasToFile(canvas: HTMLCanvasElement, name = "portrait.png"): Promise<File> {
  return await new Promise<File>((resolve) => {
    canvas.toBlob((blob) => resolve(new File([blob!], name, { type: "image/png" })), "image/png");
  });
}

/**
 * Remove background using Human's RVM segmentation, composited over white.
 * No face detection, no auto-cropping. We return a processed canvas
 * with the **same aspect** as the source so your Cropper can do the rest.
 */
export async function removeBackgroundCanvas(file: File): Promise<HTMLCanvasElement> {
  const img = await fileToImage(file);
  const src = imageToCanvas(img, 2200);

  // If Human fails for any reason, we fall back to original.
  try {
    const human = await getHuman();

    // Prepare white background canvas
    const whiteBg = makeWhiteBg(src.width, src.height);

    // Human’s simple segmentation API: input + replacement background → canvas
    // (If the API isn’t available in the current version, we catch and fallback.)
    const seg = (await (human as any).segmentation?.(src, whiteBg)) as HTMLCanvasElement | undefined;
    if (seg && seg.width && seg.height) return seg;
  } catch (err) {
    console.warn("Segmentation failed; using original image.", err);
  }

  return src;
}
