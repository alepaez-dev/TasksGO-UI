import { describe, it, expect } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { iconRegistry } from './iconRegistry';
import * as iconsBarrel from './index';
import * as packageRoot from '../index';

function toExportName(name: string): string {
  const pascal = name
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
  return `${pascal}Icon`;
}

const registryEntries = Object.entries(iconRegistry);

function findMisexported(barrel: Record<string, unknown>): string[] {
  return registryEntries
    .filter(([name, component]) => barrel[toExportName(name)] !== component)
    .map(([name]) => name);
}

describe('icon barrels', () => {
  it('re-exports every registered icon from the icons barrel', () => {
    expect(findMisexported(iconsBarrel)).toEqual([]);
  });

  it('re-exports every registered icon from the package root', () => {
    expect(findMisexported(packageRoot)).toEqual([]);
  });

  it('registers every icon the barrel exports', () => {
    const registered = new Set<unknown>(Object.values(iconRegistry));
    const unregistered = Object.entries(iconsBarrel)
      .filter(
        ([name, value]) => name.endsWith('Icon') && !registered.has(value),
      )
      .map(([name]) => name);
    expect(unregistered).toEqual([]);
  });

  it('registers no two icons drawing the same path', () => {
    const namesByPath = new Map<string, string[]>();
    for (const [name, IconComponent] of registryEntries) {
      const { container } = render(<IconComponent />);
      const path = container.querySelector('path')?.getAttribute('d') ?? '';
      // Without this, a path-less icon would fall back to '' and group with
      // every other path-less icon as a bogus duplicate.
      expect(path, `${name} renders no path`).not.toBe('');
      namesByPath.set(path, [...(namesByPath.get(path) ?? []), name]);
      cleanup();
    }
    const duplicates = [...namesByPath.values()].filter(
      (names) => names.length > 1,
    );
    expect(duplicates).toEqual([]);
  });
});
