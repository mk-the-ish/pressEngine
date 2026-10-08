import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs";

// Converts RGB object to Hex string
function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
}

export async function GET() {
  return NextResponse.json({ status: "API route is alive and reachable" });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    const originalSize = file.size;
    const originalName = file.name.replace(/\.[^/.]+$/, ""); // extension stripping
    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    const image = sharp(inputBuffer);
    const metadata = await image.metadata();

    if (!metadata.width || !metadata.height) {
      return NextResponse.json(
        { error: "Invalid image format or corrupt file" },
        { status: 422 }
      );
    }

    // Run conversions and placeholder generations concurrently
    const [
      dominantColorResult,
      lqipBuffer,
      webpBuffer,
      avifBuffer,
      jpegBuffer
    ] = await Promise.all([
      // 1. Dominant Color calculation
      image.stats().then((stats) => {
        const { r, g, b } = stats.dominant;
        return rgbToHex(r, g, b);
      }),

      // 2. Base64 LQIP (16px wide, blurry placeholder)
      image
        .clone()
        .resize(16, null, { withoutEnlargement: true })
        .webp({ quality: 20 })
        .toBuffer(),

      // 3. WebP variant (quality 80, fast & ubiquitous)
      image
        .clone()
        .rotate() // auto-orient based on EXIF before stripping
        .webp({ quality: 80, effort: 4 })
        .toBuffer(),

      // 4. AVIF variant (quality 65, max compression for modern browsers)
      image
        .clone()
        .rotate()
        .avif({ quality: 65, effort: 4 })
        .toBuffer(),

      // 5. Optimized JPEG fallback (stripped EXIF)
      image
        .clone()
        .rotate()
        .jpeg({ quality: 80, mozjpeg: true })
        .toBuffer(),
    ]);

    // Format Base64 Data URL for zero-CLS next/image blurDataURL
    const blurDataUrl = `data:image/webp;base64,${lqipBuffer.toString("base64")}`;

    const variants = {
      webp: {
        buffer: webpBuffer.toString("base64"),
        size: webpBuffer.length,
        mimeType: "image/webp",
        savingsPercentage: Number(
          (((originalSize - webpBuffer.length) / originalSize) * 100).toFixed(1)
        ),
      },
      avif: {
        buffer: avifBuffer.toString("base64"),
        size: avifBuffer.length,
        mimeType: "image/avif",
        savingsPercentage: Number(
          (((originalSize - avifBuffer.length) / originalSize) * 100).toFixed(1)
        ),
      },
      jpeg: {
        buffer: jpegBuffer.toString("base64"),
        size: jpegBuffer.length,
        mimeType: "image/jpeg",
        savingsPercentage: Number(
          (((originalSize - jpegBuffer.length) / originalSize) * 100).toFixed(1)
        ),
      },
    };
    

    return NextResponse.json({
      success: true,
      original: {
        name: file.name,
        slug: originalName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        size: originalSize,
        width: metadata.width,
        height: metadata.height,
        aspectRatio: Number((metadata.width / metadata.height).toFixed(3)),
        format: metadata.format,
      },
      placeholders: {
        dominantColor: dominantColorResult,
        blurDataUrl,
      },
      variants,
    });
  } catch (error: any) {
    console.error("Optimization failed:", error);
    return NextResponse.json(
      { error: "Image processing pipeline failed", details: error.message },
      { status: 500 }
    );
  }
}