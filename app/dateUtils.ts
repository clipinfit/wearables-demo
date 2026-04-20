export function formatLocalDateKey(value: Date | number | string): string {
  const date = value instanceof Date ? value : new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addLocalDays(
  value: Date | number | string,
  days: number,
): Date {
  const date = value instanceof Date ? new Date(value) : new Date(value);
  date.setDate(date.getDate() + days);
  return date;
}

export function localDateKeyToDate(dateKey: string): Date {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
}
