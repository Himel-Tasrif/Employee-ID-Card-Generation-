# ID Card Maker – Features

A minimal, production-friendly ID card generator built with Next.js and Tailwind CSS.

## Core Features

- Single Axzons-branded template
  - Uses your provided logo image (Axzons + HomeCare)
  - Clean, professional layout with refined spacing and shadows
- Live preview while editing
  - Instant updates for name, staff type, and photo
  - Accurate print preview scale
- Photo upload
  - Drag-and-drop or click to upload (PNG/JPG)
  - On-canvas preview with easy remove/reset
- Custom fields
  - Full name
  - Staff type (e.g., PCA) – fully editable
- Professional export
  - Download PNG
  - Download PDF (portrait 54mm × 86mm, 300 DPI-friendly)
- Visual polish
  - Gradient divider with soft edges
  - Lowercased website style
  - Stronger depth using shadow and subtle ring
- Simplified UX
  - No template selector
  - No ID-number generator

## Tech Stack

- Next.js App Router
- Tailwind CSS
- html2canvas
- jsPDF

## Notes

- The PDF export uses ISO ID-1 dimensions (54×86mm) in portrait.
- The logo is loaded from `public/image.png` for crisp rendering.
