// src/types/cdn-imports.d.ts
// Let TypeScript know that CDN ESM modules exist and can be treated as `any`.
declare module "https://cdn.jsdelivr.net/*" {
  const mod: any;
  export default mod;
}
