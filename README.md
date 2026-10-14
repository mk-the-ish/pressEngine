# AssetPulse (`pressEngine`)

> High-throughput, local-first media ingestion & optimization pipeline with real-time format transformation, automated EXIF scrubbing, zero-CLS placeholder extraction, and offline asset bundling.

---

## ⚡ The Problem

Modern web performance budgets demand aggressive media optimization: serving modern formats (`AVIF`, `WebP`), preventing Cumulative Layout Shift (CLS) via Low-Quality Image Placeholders (LQIP), and scrubbing bloated EXIF camera metadata. 

Most developer workflows either rely on heavy third-party SaaS APIs (Cloudinary, Imgix) with recurring egress costs or manually execute disjointed CLI commands. 

**AssetPulse** provides a localized, high-performance developer micro-tool: drop raw high-resolution media into an interactive ingestion UI, process them concurrently via native C++ threads (`libvips`), inspect real-time byte reductions, and export production-ready `.zip` bundles containing multi-format assets, metadata, and copy-paste JSX snippets.

---

## 🚀 Key Features

* **Parallel C++ Image Transformations:** Powered by Node.js and `sharp` (`libvips`), running AVIF, WebP, and MozJPEG conversions concurrently via `Promise.all` across thread pools.
* **Automated EXIF Scrubbing & Auto-Orientation:** Sanitizes location, hardware data, and camera profiles while preserving physical orientation.
* **Zero-CLS Low-Quality Image Placeholders (LQIP):** Extracts a 16px ultra-lightweight Base64 Data URI (<180 bytes) paired with dominant hex palette extraction for seamless `next/image` blur integration.
* **Interactive Basketball Dunk Dropzone:** Dynamic SVG net-ripple physics, celebratory particles, and procedural Web Audio API net-swish synthesis on upload.
* **Offline Bundling (`JSZip`):** Automatically packages converted images, an immutable `metadata.json` ledger, and a ready-to-import `snippets.tsx` file for direct drop-in to codebases without requiring active cloud buckets.
* **Copy-Ready Developer Drawer:** Instant JSX/HTML snippets configured with exact extracted dimensions and blur data URIs.

---

## 📊 Compression & Performance Benchmarks

Below is a representative sample benchmark across standard digital asset profiles:

| Asset Type | Source Format | Raw Size | WebP (Q80) | AVIF (Q65) | Max Savings | CLS Placeholder |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **High-Res Landscape** | JPEG (4000×2667) | 4.82 MB | 612 KB | 318 KB | **-93.4%** | `16×11` WebP (142 B) |
| **App UI Screenshot** | PNG (2560×1600) | 2.14 MB | 240 KB | 165 KB | **-92.3%** | `16×10` WebP (128 B) |
| **Editorial Portrait** | JPEG (3200×2400) | 3.40 MB | 485 KB | 280 KB | **-91.7%** | `16×12` WebP (156 B) |
| **Vector-Rich Graphic** | PNG (1920×1080) | 1.15 MB | 130 KB | 92 KB | **-92.0%** | `16×9` WebP (110 B) |

*Average pipeline execution latency: ~110ms–240ms on standard multicore developer workstations.*

---

## 🛠️ Architecture & Data Flow

```text
  [ Raw Asset Drop ]
          │
          ▼
  Next.js App Router (/api/optimize)
          │
          ├── Multi-threaded Libvips (sharp)
          │     ├── .webp({ quality: 80 })
          │     ├── .avif({ quality: 65 })
          │     └── .jpeg({ mozjpeg: true, quality: 80 })
          │
          ├── Metadata & Layout Extractor
          │     ├── Native dimensions (width, height, aspect ratio)
          │     ├── Dominant hex calculation (stats.dominant)
          │     └── 16px LQIP WebP string (base64)
          │
          ▼
  JSON Stream Response
          │
          ├── Interactive Quality Inspector & Metrics
          ├── Snippet Drawer (next/image & <picture>)
          └── Client-Side JSZip Compiler ──> Downloadable Asset Bundle (.zip)

```

---

## 📦 Tech Stack

* **Framework:** Next.js (App Router, Turbopack, React 19)
* **Styling:** Tailwind CSS (Dark-mode data-dense UI)
* **Image Processing Engine:** Sharp (`libvips` C++ bindings)
* **Client Archive Engine:** `JSZip` + `file-saver`
* **Icons & Audio:** `lucide-react`, Web Audio API (Bandpass-filtered synthetic noise)

---

## 🚦 Getting Started

### Prerequisites

* Node.js 18.17+ or Node.js 20+
* Windows 11 / macOS / Linux

### Installation

1. **Clone the repository:**

cd pressEngine

```


2. **Install dependencies:**
```bash
npm install

```


*Note for Windows users:* Ensure native binaries are compiled properly:
```bash
npm install --include=optional @img/sharp-win32-x64

```


3. **Run local development server:**
```bash
npm run dev

```


4. **Access the application:**
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📋 Generated Output Structure

When triggering **"Download Bundle (.zip)"**, the output folder contains:

```text
my-asset-slug/
├── my-asset-slug.avif        # Ultra-compressed modern format
├── my-asset-slug.webp        # Universal web-standard format
├── my-asset-slug.jpg         # Cleaned fallback without EXIF
├── metadata.json             # Parsed dimensions, colors, and blur hash
└── snippets.tsx              # Ready-to-use Next.js component snippet

```

### Sample `metadata.json`

```json
{
  "name": "hero-graphic.png",
  "dimensions": { "width": 1920, "height": 1080 },
  "aspectRatio": 1.778,
  "dominantColor": "#1e293b",
  "blurDataUrl": "data:image/webp;base64,UklGRmYAAABXRUJQVlA4IFoAAAA...",
  "savings": {
    "webp": "-88.7%",
    "avif": "-92.0%"
  }
}

---

## 📄 License

MIT License. Free for open-source development and commercial use.
