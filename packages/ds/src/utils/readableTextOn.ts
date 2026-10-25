export type ReadableText = 'light' | 'dark';

const LUMINANCE_THRESHOLD = 0.179;

function parseChannels(
  color: string,
): readonly [number, number, number] | null {
  const value = color.trim();

  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(value);
  if (hex) {
    const digits = hex[1];
    const pairs =
      digits.length === 3
        ? [digits[0] + digits[0], digits[1] + digits[1], digits[2] + digits[2]]
        : [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 6)];
    return [
      Number.parseInt(pairs[0], 16),
      Number.parseInt(pairs[1], 16),
      Number.parseInt(pairs[2], 16),
    ];
  }

  const rgb = /^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/i.exec(value);
  if (rgb) {
    return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])];
  }

  return null;
}

function channelLuminance(channel: number): number {
  const ratio = channel / 255;
  return ratio <= 0.03928
    ? ratio / 12.92
    : Math.pow((ratio + 0.055) / 1.055, 2.4);
}

export function readableTextOn(background: string): ReadableText | null {
  const channels = parseChannels(background);
  if (channels === null) return null;

  const [red, green, blue] = channels;
  const luminance =
    0.2126 * channelLuminance(red) +
    0.7152 * channelLuminance(green) +
    0.0722 * channelLuminance(blue);

  return luminance > LUMINANCE_THRESHOLD ? 'dark' : 'light';
}
