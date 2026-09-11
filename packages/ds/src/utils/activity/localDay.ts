export function toLocalDayNumber(iso: string): number {
  const date = new Date(iso);
  return Math.floor(
    (date.getTime() - date.getTimezoneOffset() * 60_000) / 86_400_000,
  );
}
