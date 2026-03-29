/**
 * Generates tokens.css and typography.css from the TypeScript token constants.
 *
 * This is the single-source-of-truth pipeline: TS constants → CSS custom properties.
 * Called by the Vite plugin (vite-plugin-ds-tokens.ts) on every build and dev start,
 * so the CSS files are always in sync with the TS values.
 *
 * For derived tokens (button, checkbox, etc.) the generator emits var() references
 * instead of raw values, so CSS-level theming (overriding a base variable) still
 * cascades to all tokens that depnd on it.
 */

import { colors } from './colors.ts';
import { fontFamilies, fontWeights, typographyScale } from './typography.ts';
import { spacing } from './spacing.ts';
import { radius } from './radius.ts';
import { elevation } from './elevation.ts';
import { effects } from './effects.ts';
import { iconography } from './iconography.ts';
import { interaction } from './interaction.ts';
import { zIndex } from './zIndex.ts';

type VarMap = Map<string, string>;

function normalize(value: string): string {
  return value.startsWith('#') ? value.toLowerCase() : value;
}

function camelToKebab(str: string): string {
  return str.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
}

const SKIP_CSS_KEYWORDS = new Set(['transparent', 'none']);

const BASE_COLOR_GROUPS: Record<string, Record<string, string>> = {
  accent: colors.accent,
  surface: colors.surface,
  text: colors.text,
  border: colors.border,
  focus: colors.focus,
  scrollbar: colors.scrollbar,
};

function buildBaseColorMap(): VarMap {
  const map: VarMap = new Map();

  for (const [group, values] of Object.entries(BASE_COLOR_GROUPS)) {
    for (const [name, value] of Object.entries(values)) {
      if (!SKIP_CSS_KEYWORDS.has(value)) {
        map.set(
          normalize(value),
          `var(--ds-color-${camelToKebab(group)}-${camelToKebab(name)})`,
        );
      }
    }
  }

  return map;
}

function buildFontFamilyMap(): VarMap {
  const map: VarMap = new Map();
  for (const [name, value] of Object.entries(fontFamilies)) {
    map.set(value, `var(--ds-font-family-${camelToKebab(name)})`);
  }
  return map;
}

function buildFontWeightMap(): VarMap {
  const map: VarMap = new Map();
  for (const [name, value] of Object.entries(fontWeights)) {
    map.set(String(value), `var(--ds-font-weight-${camelToKebab(name)})`);
  }
  return map;
}

function resolve(value: string, map: VarMap): string {
  return map.get(normalize(value)) ?? value;
}

function flattenColors(
  obj: Record<string, unknown>,
  prefix: string,
  colorMap: VarMap,
  isBase: boolean,
): string[] {
  const lines: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const varName = `${prefix}-${camelToKebab(key)}`;
    if (typeof value === 'object' && value !== null) {
      lines.push(
        ...flattenColors(
          value as Record<string, unknown>,
          varName,
          colorMap,
          isBase,
        ),
      );
    } else {
      const raw = normalize(String(value));
      let cssValue: string;
      if (isBase) {
        cssValue = raw;
      } else {
        const resolved = colorMap.get(raw);
        if (resolved !== undefined) {
          cssValue = resolved;
        } else {
          cssValue = raw;
          if (!SKIP_CSS_KEYWORDS.has(raw)) {
            colorMap.set(raw, `var(${varName})`);
          }
        }
      }
      lines.push(`  ${varName}: ${cssValue};`);
    }
  }
  return lines;
}

const CSS_PROP_MAP: Record<string, string> = {
  fontSize: 'font-size',
  fontFamily: 'font-family',
  fontWeight: 'font-weight',
  letterSpacing: 'letter-spacing',
  textTransform: 'text-transform',
  lineHeight: 'line-height',
  textDecoration: 'text-decoration',
};

const TYPOGRAPHY_PROPS = [
  'fontSize',
  'fontFamily',
  'fontWeight',
  'letterSpacing',
  'textTransform',
  'lineHeight',
  'textDecoration',
] as const;

export function generateTokensCSS(): string {
  const colorMap = buildBaseColorMap();
  const fontFamilyMap = buildFontFamilyMap();
  const fontWeightMap = buildFontWeightMap();

  const lines: string[] = [
    '/* AUTO-GENERATED from token .ts files — do not edit manually */',
    "@import './fonts.css';",
    '',
    ':root {',
  ];

  for (const [group, values] of Object.entries(colors)) {
    const isBase = group in BASE_COLOR_GROUPS;
    lines.push(
      ...flattenColors(
        values as Record<string, unknown>,
        `--ds-color-${camelToKebab(group)}`,
        colorMap,
        isBase,
      ),
    );
    lines.push('');
  }

  for (const [name, value] of Object.entries(fontFamilies)) {
    lines.push(`  --ds-font-family-${camelToKebab(name)}: ${value};`);
  }
  lines.push('');

  for (const [name, value] of Object.entries(fontWeights)) {
    lines.push(`  --ds-font-weight-${camelToKebab(name)}: ${value};`);
  }
  lines.push('');

  for (const [scaleName, scale] of Object.entries(typographyScale)) {
    for (const [prop, value] of Object.entries(scale)) {
      let cssValue = String(value);
      if (prop === 'fontFamily') {
        cssValue = resolve(cssValue, fontFamilyMap);
      } else if (prop === 'fontWeight') {
        cssValue = resolve(cssValue, fontWeightMap);
      }
      lines.push(
        `  --ds-text-${camelToKebab(scaleName)}-${camelToKebab(prop)}: ${cssValue};`,
      );
    }
    lines.push('');
  }

  for (const [group, values] of Object.entries(spacing)) {
    const prefix =
      group === 'columnWidths'
        ? '--ds-column'
        : `--ds-space-${camelToKebab(group)}`;
    for (const [name, value] of Object.entries(
      values as Record<string, string>,
    )) {
      lines.push(`  ${prefix}-${camelToKebab(name)}: ${value};`);
    }
  }
  lines.push('');

  for (const [name, value] of Object.entries(radius)) {
    lines.push(`  --ds-radius-${camelToKebab(name)}: ${value};`);
  }
  lines.push('');

  for (const [name, value] of Object.entries(elevation)) {
    lines.push(`  --ds-elevation-${camelToKebab(name)}: ${value};`);
  }
  lines.push('');

  for (const [name, value] of Object.entries(effects)) {
    lines.push(`  --ds-effect-${camelToKebab(name)}: ${value};`);
  }
  lines.push('');

  for (const [name, value] of Object.entries(iconography.sizes)) {
    lines.push(`  --ds-icon-size-${camelToKebab(name)}: ${value};`);
  }
  lines.push('');

  lines.push(`  --ds-transition-duration: ${interaction.transition.duration};`);
  for (const [name, value] of Object.entries(
    interaction.transition.durations,
  )) {
    lines.push(`  --ds-transition-duration-${name}: ${value};`);
  }
  lines.push(`  --ds-transition-property: ${interaction.transition.property};`);
  lines.push(
    `  --ds-transition-timing-function: ${interaction.transition.timingFunction};`,
  );
  lines.push('');

  lines.push(`  --ds-scrollbar-width: ${interaction.scrollbar.width};`);
  lines.push('  --ds-scrollbar-track: var(--ds-color-scrollbar-track);');
  lines.push('  --ds-scrollbar-thumb: var(--ds-color-scrollbar-thumb);');
  lines.push('');

  for (const [name, value] of Object.entries(zIndex)) {
    lines.push(`  --ds-z-${camelToKebab(name)}: ${value};`);
  }
  lines.push('');

  lines.push(`  --ds-focus-ring-width: ${interaction.focusRing.width};`);
  lines.push(
    `  --ds-focus-ring: 0 0 0 var(--ds-focus-ring-width) var(--ds-color-focus-ring);`,
  );

  lines.push('}');
  lines.push('');

  return lines.join('\n');
}

export function generateTypographyCSS(): string {
  const lines: string[] = [
    '/* AUTO-GENERATED from token .ts files — do not edit manually */',
    '',
  ];

  for (const scaleName of Object.keys(typographyScale)) {
    const scale = typographyScale[scaleName as keyof typeof typographyScale];

    lines.push(`.ds-text-${camelToKebab(scaleName)} {`);
    for (const prop of TYPOGRAPHY_PROPS) {
      if (prop in scale) {
        const cssProp = CSS_PROP_MAP[prop] ?? prop;
        lines.push(
          `  ${cssProp}: var(--ds-text-${camelToKebab(scaleName)}-${camelToKebab(prop)});`,
        );
      }
    }
    lines.push('}');
    lines.push('');
  }

  return lines.join('\n');
}
