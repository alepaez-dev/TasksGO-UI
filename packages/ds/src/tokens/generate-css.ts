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

import { colors } from './colors';
import { fontFamilies, fontWeights, typographyScale } from './typography';
import { spacing } from './spacing';
import { radius } from './radius';
import { elevation } from './elevation';
import { iconography } from './iconography';
import { interaction } from './interaction';

type VarMap = Map<string, string>;

function normalize(value: string): string {
  return value.startsWith('#') ? value.toLowerCase() : value;
}

const SKIP_CSS_KEYWORDS = new Set(['transparent', 'none']);

function buildBaseColorMap(): VarMap {
  const map: VarMap = new Map();

  const baseGroups: Record<string, Record<string, string>> = {
    accent: colors.accent,
    surface: colors.surface,
    text: colors.text,
    border: colors.border,
    scrollbar: colors.scrollbar,
  };

  for (const [group, values] of Object.entries(baseGroups)) {
    for (const [name, value] of Object.entries(values)) {
      if (!SKIP_CSS_KEYWORDS.has(value)) {
        map.set(normalize(value), `var(--ds-color-${group}-${name})`);
      }
    }
  }

  return map;
}

function buildFontFamilyMap(): VarMap {
  const map: VarMap = new Map();
  for (const [name, value] of Object.entries(fontFamilies)) {
    map.set(value, `var(--ds-font-family-${name})`);
  }
  return map;
}

function buildFontWeightMap(): VarMap {
  const map: VarMap = new Map();
  for (const [name, value] of Object.entries(fontWeights)) {
    map.set(String(value), `var(--ds-font-weight-${name})`);
  }
  return map;
}

function resolve(value: string, map: VarMap): string {
  return map.get(normalize(value)) ?? value;
}

const BASE_COLOR_GROUPS = new Set([
  'accent',
  'surface',
  'text',
  'border',
  'scrollbar',
]);

function flattenColors(
  obj: Record<string, unknown>,
  prefix: string,
  colorMap: VarMap,
  isBase: boolean,
): string[] {
  const lines: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const varName = `${prefix}-${key}`;
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
    const isBase = BASE_COLOR_GROUPS.has(group);
    lines.push(
      ...flattenColors(
        values as Record<string, unknown>,
        `--ds-color-${group}`,
        colorMap,
        isBase,
      ),
    );
    lines.push('');
  }

  for (const [name, value] of Object.entries(fontFamilies)) {
    lines.push(`  --ds-font-family-${name}: ${value};`);
  }
  lines.push('');

  for (const [name, value] of Object.entries(fontWeights)) {
    lines.push(`  --ds-font-weight-${name}: ${value};`);
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
      lines.push(`  --ds-text-${scaleName}-${prop}: ${cssValue};`);
    }
    lines.push('');
  }

  for (const [group, values] of Object.entries(spacing)) {
    const prefix =
      group === 'columnWidths' ? '--ds-column' : `--ds-space-${group}`;
    for (const [name, value] of Object.entries(
      values as Record<string, string>,
    )) {
      lines.push(`  ${prefix}-${name}: ${value};`);
    }
  }
  lines.push('');

  for (const [name, value] of Object.entries(radius)) {
    lines.push(`  --ds-radius-${name}: ${value};`);
  }
  lines.push('');

  for (const [name, value] of Object.entries(elevation)) {
    lines.push(`  --ds-elevation-${name}: ${value};`);
  }
  lines.push('');

  lines.push(`  --ds-icon-family: '${iconography.family}';`);
  for (const [name, value] of Object.entries(iconography.sizes)) {
    lines.push(`  --ds-icon-size-${name}: ${value};`);
  }
  lines.push('');

  lines.push(`  --ds-transition-duration: ${interaction.transition.duration};`);
  lines.push(`  --ds-transition-property: ${interaction.transition.property};`);
  lines.push('');

  lines.push(`  --ds-scrollbar-width: ${interaction.scrollbar.width};`);
  lines.push('  --ds-scrollbar-track: var(--ds-color-scrollbar-track);');
  lines.push('  --ds-scrollbar-thumb: var(--ds-color-scrollbar-thumb);');
  lines.push('');

  lines.push(`  --ds-focus-ring-width: ${interaction.focusRing.width};`);
  lines.push(
    `  --ds-focus-ring: 0 0 0 var(--ds-focus-ring-width)\n    var(--ds-color-checkbox-focusRing);`,
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

    lines.push(`.ds-text-${scaleName} {`);
    for (const prop of TYPOGRAPHY_PROPS) {
      if (prop in scale) {
        const cssProp = CSS_PROP_MAP[prop] ?? prop;
        lines.push(`  ${cssProp}: var(--ds-text-${scaleName}-${prop});`);
      }
    }
    lines.push('}');
    lines.push('');
  }

  return lines.join('\n');
}
