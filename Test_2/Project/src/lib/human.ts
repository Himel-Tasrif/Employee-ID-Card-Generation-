/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

let humanInstance: any | null = null;

const humanConfig: any = {
  modelBasePath: "https://cdn.jsdelivr.net/npm/@vladmandic/human/models",
  debug: false,

  // We do NOT need face/mesh/etc. for this step:
  face: { enabled: false },
  body: { enabled: false },
  hand: { enabled: false },
  gesture: { enabled: false },
  object: { enabled: false },

  // >>> IMPORTANT: enable RVM segmentation
  segmentation: {
    enabled: true,
    modelPath: "rvm.json",
    ratio: 0.5,      // 0.5 is fast, 0.75~1.0 is higher quality
    mode: "default",
  },

  filter: { enabled: true, return: true, autoBrightness: true },
};

export async function getHuman() {
  if (humanInstance) return humanInstance;
  if (typeof window === "undefined") throw new Error("Human must run in the browser");

  let HumanCtor: any;
  try {
    ({ default: HumanCtor } = await import(
      "https://cdn.jsdelivr.net/npm/@vladmandic/human/dist/human.esm.js"
    ));
  } catch {
    ({ default: HumanCtor } = await import(
      "https://cdn.jsdelivr.net/npm/@vladmandic/human/dist/human.esm-nobundle.js"
    ));
  }

  const human = new HumanCtor(humanConfig);
  await human.load();
  await human.warmup();
  humanInstance = human;
  return humanInstance;
}
