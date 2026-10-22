declare global {
  interface Window {
    liquidGlass?: (el: Element, opts?: { scale?: number }) => { supported: boolean; destroy: () => void };
  }
}

/**
 * Optional refraction (Chromium only), skipped when the visitor asks for less transparency. Elsewhere
 * the library applies a plain frosted blur and `.glass` keeps its own styling.
 * Returns a cleanup function, or undefined when nothing was applied.
 */
export function applyLiquidGlass(el: HTMLElement, scale = -70): (() => void) | undefined {
  if (!window.liquidGlass) return;
  if (window.matchMedia("(prefers-reduced-transparency: reduce), (prefers-contrast: more)").matches) return;
  const glass = window.liquidGlass(el, { scale });
  if (glass.supported) el.classList.add("glass-liquid");
  return glass.destroy;
}
