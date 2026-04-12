// ============================================================
// Scheduling helpers — format scheduling options for display/SMS
// ============================================================

import { SchedulingType, SchedulingOption } from "@/lib/types";

const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function formatTime(t: string): string {
  // t = "HH:MM" (24h) → "9:30 AM"
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
}

function formatDate(d: string): string {
  // d = "YYYY-MM-DD"
  const [y, mo, day] = d.split("-").map(Number);
  const date = new Date(y, mo - 1, day);
  return `${DAYS[date.getDay()]} ${MONTHS[mo - 1]} ${day}`;
}

export function formatSchedulingSummary(
  type: SchedulingType,
  options: SchedulingOption[]
): string {
  if (!options || options.length === 0) return "Flexible";

  switch (type) {
    case "exact": {
      const o = options[0];
      return `${formatDate(o.date!)} at ${formatTime(o.time!)}`;
    }
    case "window": {
      const o = options[0];
      return `${formatDate(o.date!)} ${formatTime(o.start!)}–${formatTime(o.end!)}`;
    }
    case "multiple": {
      return options
        .slice(0, 3)
        .map(o => `${formatDate(o.date!)} ${formatTime(o.start!)}–${formatTime(o.end!)}`)
        .join(" OR ");
    }
    case "any_weekday": {
      const o = options[0];
      return `Any weekday ${formatTime(o.start!)}–${formatTime(o.end!)}`;
    }
    case "any_weekend": {
      const o = options[0];
      return `Any weekend day ${formatTime(o.start!)}–${formatTime(o.end!)}`;
    }
    default:
      return "Flexible";
  }
}
