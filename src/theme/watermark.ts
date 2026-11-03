import type { WatermarkTimeFormat } from '@/typings/theme';

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

/**
 * Format a date using the watermark placeholder tokens
 * (`YYYY`, `MM`, `DD`, `HH`, `mm`, `ss`).
 */
export function formatWatermarkTime(date: Date, format: WatermarkTimeFormat): string {
  return format
    .replace('YYYY', String(date.getFullYear()))
    .replace('MM', pad(date.getMonth() + 1))
    .replace('DD', pad(date.getDate()))
    .replace('HH', pad(date.getHours()))
    .replace('mm', pad(date.getMinutes()))
    .replace('ss', pad(date.getSeconds()));
}
