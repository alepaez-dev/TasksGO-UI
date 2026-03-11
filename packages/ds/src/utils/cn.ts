export function cn(...args: (string | undefined | false)[]): string {
  return args.filter(Boolean).join(' ');
}
