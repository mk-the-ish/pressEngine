import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AssetPulse | High-Throughput Media Engine",
  description: "Next-gen asset optimization pipeline with WebP, AVIF, and LQIP placeholder generation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-neutral-950 text-neutral-100 selection:bg-amber-500/20 selection:text-amber-300">
        <header className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-amber-500 flex items-center justify-center font-black text-neutral-950 text-base shadow-lg shadow-amber-500/20">
              P
            </div>
            <div>
              <span className="font-bold tracking-tight text-neutral-100 text-lg">Press-Engine</span>
              <span className="ml-2 text-xs font-mono uppercase bg-neutral-800 px-2 py-0.5 rounded text-neutral-400">v 1.1</span>
            </div>
          </div>
          <div className="text-xs font-mono text-neutral-500">
            OCT 15 PIPELINE SPRINT
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}