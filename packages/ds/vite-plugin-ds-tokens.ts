/**
 * Vite plugin that generates tokens.css and typography.css from the TS token constants.
 *
 * - On build: generates once before compilation (buildStart).
 * - On dev: generates on server start, then re-generates live whenever a token
 *   .ts file changes. Uses Vite's ssrLoadModule for fresh imports so the CSS
 *   always reflects the latest TS values without restarting the dev server.
 *
 * Used in both vite.config.ts (library build) and .storybook/main.ts (storybook dev).
 */

import type { Plugin, ViteDevServer } from 'vite';
import { writeFileSync } from 'fs';
import { resolve } from 'path';
import * as prettier from 'prettier';
import {
  generateTokensCSS,
  generateTypographyCSS,
} from './src/tokens/generate-css';

const GENERATE_MODULE = '/src/tokens/generate-css.ts';

const TOKEN_FILES = [
  '/src/tokens/colors.ts',
  '/src/tokens/typography.ts',
  '/src/tokens/spacing.ts',
  '/src/tokens/radius.ts',
  '/src/tokens/elevation.ts',
  '/src/tokens/effects.ts',
  '/src/tokens/iconography.ts',
  '/src/tokens/interaction.ts',
];

async function formatCSS(css: string, root: string): Promise<string> {
  const options = await prettier.resolveConfig(resolve(root, 'src/tokens'));
  return prettier.format(css, { ...options, parser: 'css' });
}

async function writeCSS(
  root: string,
  tokensCss: string,
  typographyCss: string,
) {
  const tokensDir = resolve(root, 'src/tokens');
  writeFileSync(
    resolve(tokensDir, 'tokens.css'),
    await formatCSS(tokensCss, root),
  );
  writeFileSync(
    resolve(tokensDir, 'typography.css'),
    await formatCSS(typographyCss, root),
  );
}

export function dsTokensPlugin(): Plugin {
  let root: string;
  let server: ViteDevServer | undefined;

  return {
    name: 'ds-tokens',
    configResolved(config) {
      root = config.root;
    },
    configureServer(_server) {
      server = _server;
    },
    async buildStart() {
      await writeCSS(root, generateTokensCSS(), generateTypographyCSS());
    },
    async handleHotUpdate({ file }) {
      if (!server) return;

      const relative = file.replace(root, '');
      const isTokenFile =
        TOKEN_FILES.includes(relative) || relative === GENERATE_MODULE;
      if (!isTokenFile) return;

      const allModules = [...TOKEN_FILES, GENERATE_MODULE];
      for (const id of allModules) {
        const mods = server.moduleGraph.getModulesByFile(resolve(root, id.slice(1)));
        if (mods) {
          for (const mod of mods) {
            server.moduleGraph.invalidateModule(mod);
          }
        }
      }

      try {
        const mod = await server.ssrLoadModule(GENERATE_MODULE);
        await writeCSS(root, mod.generateTokensCSS(), mod.generateTypographyCSS());
      } catch (err) {
        console.error('[ds-tokens] Failed to regenerate CSS:', err);
      }
    },
  };
}
