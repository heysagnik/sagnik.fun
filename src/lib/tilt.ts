import type { PointerEvent } from "react";

const MAX_TURN = 9; // degrees a collectible leans toward the pointer

/** Lean toward the pointer and move the sheen with it. Mouse only; touch keeps the resting tilt. */
export function trackPointer(e: PointerEvent<HTMLElement>) {
  if (e.pointerType !== "mouse") return;
  const rect = e.currentTarget.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width;
  const y = (e.clientY - rect.top) / rect.height;
  const style = e.currentTarget.style;
  style.setProperty("--mx", `${x * 100}%`);
  style.setProperty("--my", `${y * 100}%`);
  style.setProperty("--rx", `${(0.5 - y) * MAX_TURN}deg`);
  style.setProperty("--ry", `${(x - 0.5) * MAX_TURN}deg`);
}

export function resetPointer(e: PointerEvent<HTMLElement>) {
  for (const name of ["--mx", "--my", "--rx", "--ry"]) e.currentTarget.style.removeProperty(name);
}
