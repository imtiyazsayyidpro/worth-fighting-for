import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const dayFormatter = new Intl.DateTimeFormat("en", {
  weekday: "long",
  month: "long",
  day: "numeric",
})

const timeFormatter = new Intl.DateTimeFormat("en", {
  hour: "numeric",
  minute: "2-digit",
})

/** A warm, human relative label like "Today", "Yesterday", or "Tuesday, June 3". */
export function formatRelativeDay(value: Date | string): string {
  const date = typeof value === "string" ? new Date(value) : value
  const now = new Date()

  const startOf = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  const dayMs = 24 * 60 * 60 * 1000
  const diffDays = Math.round((startOf(now) - startOf(date)) / dayMs)

  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  return dayFormatter.format(date)
}

/** Short time-of-day label like "9:41 PM". */
export function formatTime(value: Date | string): string {
  const date = typeof value === "string" ? new Date(value) : value
  return timeFormatter.format(date)
}
