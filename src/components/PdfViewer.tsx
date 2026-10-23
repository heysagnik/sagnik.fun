"use client";

import { useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy, PDFDocumentLoadingTask } from "pdfjs-dist";

const MAX_WIDTH = 900;

// Paints each PDF page onto a canvas, so the browser's own PDF viewer (and its toolbar) never appears.
export default function PdfViewer({ file }: { file: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let doc: PDFDocumentProxy | null = null;
    let task: PDFDocumentLoadingTask | null = null;
    let renderId = 0;

    async function render() {
      if (!doc || !container) return;
      const id = ++renderId;
      const width = Math.min(container.clientWidth, MAX_WIDTH);
      // Phones fit a full page into ~380px, so people pinch-zoom to read it: render extra pixels for that.
      const dpr = (window.devicePixelRatio || 1) * (width < 640 ? 2 : 1);
      const canvases: HTMLCanvasElement[] = [];

      for (let n = 1; n <= doc.numPages; n++) {
        const page = await doc.getPage(n);
        if (cancelled || id !== renderId) return;
        const base = page.getViewport({ scale: 1 });
        const viewport = page.getViewport({ scale: (width / base.width) * dpr });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${viewport.height / dpr}px`;
        canvas.className = "rounded-[6px] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_10px_28px_-16px_rgba(31,30,27,0.3)]";
        await page.render({ canvas, viewport }).promise;
        if (cancelled || id !== renderId) return;
        canvases.push(canvas);
      }
      container.replaceChildren(...canvases);
    }

    (async () => {
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url
      ).toString();
      task = pdfjs.getDocument({ url: file });
      doc = await task.promise;
      if (cancelled) return;
      await render();
      if (!cancelled) setStatus("ready");
    })().catch(() => {
      if (!cancelled) setStatus("error");
    });

    let lastWidth = container.clientWidth;
    const observer = new ResizeObserver(() => {
      if (container.clientWidth === lastWidth) return;
      lastWidth = container.clientWidth;
      void render();
    });
    observer.observe(container);

    return () => {
      cancelled = true;
      observer.disconnect();
      void task?.destroy();
    };
  }, [file]);

  return (
    <div className="h-dvh w-full overflow-y-auto bg-surface px-2 pb-28 pt-2 sm:px-6 sm:pb-32 sm:pt-8">
      <div className="mx-auto w-full max-w-[900px]">
        {status === "loading" && (
          <div
            aria-hidden
            className="aspect-[8.5/11] w-full animate-pulse rounded-[6px] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_10px_28px_-16px_rgba(31,30,27,0.3)] motion-reduce:animate-none"
          />
        )}
        {status === "error" && (
          <p className="py-24 text-center text-[15px] text-ink/70">
            Couldn&apos;t load the preview. Use Download below to open the PDF.
          </p>
        )}
        <div
          ref={containerRef}
          className={`flex w-full flex-col items-center gap-4 transition-opacity duration-300 ease-out motion-reduce:transition-none ${
            status === "ready" ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
    </div>
  );
}
