// src/lib/imageProcessing.ts
"use client";

import { getHuman } from "./human";

// convert a File -> HTMLImageElement
export async function fileToImage(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  await new Promise((r) => setTimeout(r, 0)); // let browser attach url
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

type AutoCropOptions = {
  outSize?: number;    // final square size
  faceScale?: number;  // how much around face to include
  eyeLevel?: number;   // push crop up so eyes sit ~40% from top
};

// main function: auto-crop around the face & return a square canvas
export async function autoCropToSquare(
  src: HTMLImageElement | File,
  options: AutoCropOptions = {}
): Promise<HTMLCanvasElement> {
  const { outSize = 1024, faceScale = 2.4, eyeLevel = 0.4 } = options;

  const img = src instanceof File ? await fileToImage(src) : src;

  const W = img.naturalWidth || img.width;
  const H = img.naturalHeight || img.height;

  // run face detection
  const human = await getHuman();
  const result = await human.detect(img);

  // choose the largest detected face (if any)
  let box = null as null | { x: number; y: number; width: number; height: number };
  if (Array.isArray(result.face) && result.face.length > 0) {
    box = result.face
      .slice()
      .sort((a: any, b: any) => b.box.width * b.box.height - a.box.width * a.box.height)[0].box;
  }

  // compute square crop rect
  let cx = W / 2;
  let cy = H / 2;
  let size = Math.min(W, H);

  if (box) {
    const fw = box.width;
    const fh = box.height;
    size = Math.min(Math.max(fw, fh) * faceScale, Math.min(W, H));

    // set center X to face center
    cx = box.x + fw / 2;

    // push crop up so eyes land around the top 40% of the square
    const faceTop = box.y;
    const faceBottom = box.y + fh;
    const eyesY = faceTop + fh * 0.35; // approx eye line
    const desiredEyesY = (H * (eyeLevel * size)) / size; // relative position
    cy = eyesY + (size * eyeLevel - (eyesY - (faceTop + fh * 0.35)));
    // fallback if that math went wild
    if (!Number.isFinite(cy)) cy = box.y + fh * 0.55;
  }

  let left = Math.round(cx - size / 2);
  let top = Math.round(cy - size / 2);

  // clamp crop to image bounds
  if (left < 0) left = 0;
  if (top < 0) top = 0;
  if (left + size > W) left = Math.max(0, W - size);
  if (top + size > H) top = Math.max(0, H - size);

  // draw crop
  const crop = document.createElement("canvas");
  crop.width = size;
  crop.height = size;
  const g1 = crop.getContext("2d")!;
  g1.imageSmoothingQuality = "high";
  g1.drawImage(img, left, top, size, size, 0, 0, size, size);

  // resize to outSize on a clean white background (fits your ID frame)
  const out = document.createElement("canvas");
  out.width = outSize;
  out.height = outSize;
  const g2 = out.getContext("2d")!;
  g2.fillStyle = "#ffffff";
  g2.fillRect(0, 0, outSize, outSize);
  g2.imageSmoothingQuality = "high";
  g2.drawImage(crop, 0, 0, outSize, outSize);

  return out;
}

// convenience: canvas -> File (PNG)
export async function canvasToFile(canvas: HTMLCanvasElement, name = "portrait.png") {
  return new Promise<File>((resolve) =>
    canvas.toBlob((blob) => resolve(new File([blob!], name, { type: "image/png" })), "image/png", 1)
  );
}
