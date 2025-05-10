import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  const absValue = Math.abs(value)
  let formatted

  if (absValue >= 1000000000) {
    formatted = `${(absValue / 1000000000).toFixed(2)} δις €`
  } else if (absValue >= 1000000) {
    formatted = `${(absValue / 1000000).toFixed(2)} εκ €`
  } else {
    formatted = new Intl.NumberFormat("el-GR", { style: "currency", currency: "EUR" }).format(absValue)
  }

  return value < 0 ? `-${formatted}` : formatted
}
