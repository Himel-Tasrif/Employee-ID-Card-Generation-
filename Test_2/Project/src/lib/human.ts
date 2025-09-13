// src/lib/human.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Human from "@vladmandic/human";

let humanInstance: any | null = null;

const humanConfig: any = {
  // use official CDN for models (no server needed)
  modelBasePath: "https://cdn.jsdelivr.net/npm/@vladmandic/human/models",
  debug: false,
  // detectors we actually use
  face: {
    detector: { enabled: true, rotation: true, maxDetected: 1 },
    mesh: { enabled: false },
    attention: { enabled: false },
  },
  body: { enabled: false },
  hand: { enabled: false },
  gesture: { enabled: false },
  object: { enabled: false },
};

export async function getHuman() {
  if (!humanInstance) {
    humanInstance = new Human(humanConfig);
    await humanInstance.load();
    await humanInstance.warmup(); // quick GPU warmup for snappy first run
  }
  return humanInstance;
}
