# 🍃 MintTools

> **100% Free, Private & High-Speed Web Tools Suite**  
> Edit PDFs, compress documents, generate barcodes & QR codes, optimize images, and convert developer units — all directly inside your browser. **Zero file uploads. Zero tracking.**

[![Website](https://img.shields.io/badge/Live_Site-minttools.net-10b981?style=for-the-badge&logo=vercel)](https://minttools.net)
[![Next.js](https://img.shields.io/badge/Next.js-16.3-000000?style=for-the-badge&logo=nextdotjs)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2-61dafb?style=for-the-badge&logo=react)](https://react.dev)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![Privacy](https://img.shields.io/badge/Privacy-100%25_Client--Side-emerald?style=for-the-badge&logo=shield)](https://minttools.net/privacy)

---

## 🌟 Overview

**MintTools** is a modern, privacy-first web utility suite built with **Next.js 16 (App Router)** and **React 19**. Unlike traditional online converters that upload your confidential PDFs, sensitive photos, and contracts to remote cloud servers, **MintTools executes 100% of operations locally in browser memory** using WebAssembly, HTML5 Canvas, and modern Web APIs.

If you disconnect your internet connection after loading the page, **the tools continue to function offline on your device.**

---

## 🛠️ Included Tools (13 Core Utilities)

### 📄 PDF Suite
- **PDF Editor (`/pdf`)**: Visual text editing, annotation, freehand drawing, and whiteout/redaction with live canvas preview and instant vector export.
- **PDF Compressor (`/pdf-compress`)**: Client-side document compression with custom DPI/quality settings and real-time before/after size savings.
- **PDF Merge & Split (`/pdf-merge`)**: Drag-and-drop visual reordering to combine multiple PDF files into one, or extract custom page ranges (e.g. `1-3, 5, 8-10`).
- **Image & PDF Converter (`/image-pdf`)**: Batch convert JPG, PNG, and WebP images to vector PDF, or render PDF pages into high-resolution PNG/JPG files.

### 🖼️ Image & Media Tools
- **Image Studio (`/image`)**: Compress, resize, and convert images across WebP, PNG, and JPG formats with quality controls and live preview.
- **EXIF Cleaner (`/exif-cleaner`)**: Inspect hidden GPS coordinates, camera model, date taken, and scrub all metadata before sharing photos online.

### 📱 Codes & Recognition
- **Barcode Studio (`/barcode`)**: Generate industrial and retail barcodes (**Code 128**, **EAN-13**, **UPC-A**, **Code 39**) with live dimension/color adjustments and PNG download.
- **QR Studio (`/qr`)**: Create customizable high-resolution QR codes with custom foreground/background colors, error correction, and instant download.
- **QR Reader (`/qr-reader`)**: Scan and decode QR codes from image uploads, live webcam/camera streams, or clipboard paste.

### ✍️ Document & Security
- **Markdown Editor (`/markdown`)**: Distraction-free Markdown editor with live preview, syntax formatting, and 1-click vector PDF export.
- **Password Generator (`/password`)**: Cryptographically secure (CSPRNG) password and readable Diceware passphrase generator with real-time entropy calculation.

### ⚡ Developer Utilities
- **Dev Converter (`/converter`)**: Multi-format converter for Data sizes (Bytes to Terabytes), CSS units (`px` ↔ `rem` ↔ `em`), Color formats (HEX, RGB, HSL), and Unix epoch timestamps.
- **Dev Tools (`/dev`)**: Format and minify JSON, encode/decode Base64 strings, and calculate cryptographic MD5, SHA-1, and SHA-256 hashes.

---

## 🔒 Security & Hardening

MintTools is engineered with enterprise-grade security defenses:

- **Strict Content Security Policy (CSP)**: Enforces `connect-src 'self' blob: data:` to guarantee that JavaScript cannot exfiltrate or transmit user files to third-party endpoints.
- **Anti-Clickjacking**: `X-Frame-Options: DENY` and `frame-ancestors 'none'` prevent malicious websites from embedding MintTools in invisible iframes.
- **DDoS & Probe Blocker (`middleware.js`)**: Edge middleware automatically terminates exploit path scans (`.env`, `wp-login.php`, `.git`) and scanner tools (`sqlmap`, `nikto`, `censys`) with instant `403 Forbidden` / `405 Method Not Allowed`.
- **IP Rate Limiting**: In-memory sliding-window throttling (max 60 requests per 10s per IP) to mitigate automated scrapers and HTTP flooding.
- **XSS Sanitization**: Markdown editor outputs are automatically purged of malicious `<script>`, iframe, or inline event handlers before rendering.
- **Memory Safety**: File size caps (100MB PDF, 50MB Image) and automated `URL.revokeObjectURL()` cleanup prevent client-side memory leaks.

---

## 🚀 Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **PDF Engine**: [pdf-lib](https://pdf-lib.js.org/) & [pdfjs-dist](https://mozilla.github.io/pdf.js/)
- **Markdown**: [Marked](https://marked.js.org/)
- **Codes**: [jsbarcode](https://github.com/lindell/JsBarcode) & [jsqr](https://github.com/cozmo/jsQR) / [qrcode](https://github.com/soldair/node-qrcode)
- **Styling**: Vanilla CSS Design Tokens (Custom Dark/Light Mode, Glassmorphism, Zero CSS Bloat)

---

## 💻 Local Development

### Prerequisites
- [Node.js](https://nodejs.org/) v18+ (Node 20+ recommended)
- `npm` or `pnpm`

### Installation

```bash
# Clone the repository
git clone https://github.com/nawfs254/minttools.git
cd minttools

# Install dependencies
npm install

# Run the local development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to start using MintTools.

### Production Build

```bash
# Compile and optimize for production
npm run build

# Start the production server
npm run start
```

---

## ☁️ Deployment

MintTools is built for **1-click deployment on [Vercel](https://vercel.com)**:

1. Import your GitHub repository into Vercel.
2. Leave all build settings as default (Framework Preset: **Next.js**).
3. Click **Deploy**.
4. In your Vercel Project Settings &rarr; **Domains**, add `minttools.net` and point your DNS A & CNAME records.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with ❤️ for privacy, speed, and simplicity.
</p>
