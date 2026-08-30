"use client";

import { useEffect, useState } from "react";

const LOCATION = "Bhopal, India";
const TIME_ZONE = "Asia/Kolkata";
const NBSP = "\u00A0";

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(date);
}

interface CharProps {
  value: string;
}

function Char({ value }: CharProps) {
  if (!/[0-9]/.test(value)) {
    return <span className="inline-block leading-6">{value === " " ? NBSP : value}</span>;
  }
  return (
    <span className="relative inline-block w-[0.6em] overflow-hidden leading-6 align-top">
      <span key={value} aria-hidden className="digit-roll block text-center tabular-nums">
        {value}
      </span>
    </span>
  );
}

export default function Clock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    setTime(formatTime(new Date()));
    const intervalId = setInterval(() => setTime(formatTime(new Date())), 1_000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <span className="inline-flex items-baseline gap-1.5">
      {LOCATION}
      {time && (
        <>
          <span aria-hidden>·</span>
          <span aria-label={time}>
            {time.split("").map((ch, i) => (
              <Char key={`${i}-${ch}`} value={ch} />
            ))}
          </span>
        </>
      )}
    </span>
  );
}
