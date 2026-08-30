"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const GITHUB_USER = "heysagnik";

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface ContributionsResponse {
  total: Record<string, number>;
  contributions: ContributionDay[];
}

interface HoverState {
  day: ContributionDay;
  x: number;
  y: number;
}

const LEVEL_COLORS = [
  "var(--color-heat-0)",
  "var(--color-heat-1)",
  "var(--color-heat-2)",
  "var(--color-heat-3)",
  "var(--color-heat-4)",
];

const MONTH_FORMATTER = new Intl.DateTimeFormat("en-US", { month: "short" });
const TOOLTIP_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function toUTCDate(dateStr: string): Date {
  return new Date(`${dateStr}T00:00:00Z`);
}

function buildWeeks(days: ContributionDay[]): (ContributionDay | null)[][] {
  if (days.length === 0) return [];
  const weeks: (ContributionDay | null)[][] = [];
  const leadingGap = toUTCDate(days[0].date).getUTCDay();
  let week: (ContributionDay | null)[] = new Array(leadingGap).fill(null);

  for (const day of days) {
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }
  return weeks;
}

function buildMonthLabels(weeks: (ContributionDay | null)[][]): { index: number; label: string }[] {
  const labels: { index: number; label: string }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, i) => {
    const firstDay = week.find((d) => d !== null);
    if (!firstDay) return;
    const month = toUTCDate(firstDay.date).getUTCMonth();
    if (month !== lastMonth) {
      labels.push({ index: i, label: MONTH_FORMATTER.format(toUTCDate(firstDay.date)) });
      lastMonth = month;
    }
  });
  return labels;
}

export default function Github() {
  const [days, setDays] = useState<ContributionDay[] | null>(null);
  const [hovered, setHovered] = useState<HoverState | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USER}?y=last`, {
      signal: controller.signal,
    })
      .then((res) => (res.ok ? (res.json() as Promise<ContributionsResponse>) : null))
      .then((data) => {
        if (data) setDays(data.contributions);
      })
      .catch(() => {});

    return () => {
      controller.abort();
    };
  }, []);

  if (!days) return null;

  const weeks = buildWeeks(days);
  const monthLabels = buildMonthLabels(weeks);

  return (
    <div className="relative w-full overflow-x-auto">
      <div
        className="grid text-[10px] leading-none text-muted"
        style={{
          gridTemplateColumns: `repeat(${weeks.length}, 11px)`,
          gap: "3px",
          marginBottom: 4,
        }}
      >
        {monthLabels.map(({ index, label }) => (
          <span key={index} style={{ gridColumnStart: index + 1 }}>
            {label}
          </span>
        ))}
      </div>

      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${weeks.length}, 11px)`,
          gridTemplateRows: "repeat(7, 11px)",
          gridAutoFlow: "column",
          gap: "3px",
        }}
      >
        {weeks.map((week, wi) =>
          week.map((day, di) => {
            if (!day) return <div key={`${wi}-${di}`} />;
            return (
              <div
                key={day.date}
                role="img"
                aria-label={`${day.count} contributions on ${TOOLTIP_DATE_FORMATTER.format(toUTCDate(day.date))}`}
                className="cursor-default rounded-[2px] transition-[filter] duration-100 ease-out hover:brightness-90"
                style={{ backgroundColor: LEVEL_COLORS[day.level] }}
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = Math.min(
                    Math.max(rect.left + rect.width / 2, 60),
                    window.innerWidth - 60
                  );
                  setHovered({ day, x, y: rect.top });
                }}
                onMouseLeave={() => setHovered(null)}
              />
            );
          })
        )}
      </div>

      {hovered &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-full rounded-md bg-ink px-2 py-1 text-[12px] whitespace-nowrap text-bg shadow-md"
            style={{ left: hovered.x, top: hovered.y - 6 }}
          >
            <span className="tabular-nums">{hovered.day.count}</span>{" "}
            {hovered.day.count === 1 ? "contribution" : "contributions"} on{" "}
            {TOOLTIP_DATE_FORMATTER.format(toUTCDate(hovered.day.date))}
          </div>,
          document.body
        )}
    </div>
  );
}
