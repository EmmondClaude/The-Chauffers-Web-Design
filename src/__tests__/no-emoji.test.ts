import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Guardrail: no emojis / decorative pictographs anywhere in the source.
 * Covers emoji blocks + Miscellaneous Symbols & Dingbats + Geometric Shapes
 * (plane, diamond, crown, sparkle, clock, fleur-de-lis, arrowhead, play-triangle,
 * regional-indicator flags, etc. are all rejected). Legitimate typography — em
 * dash, middot, plain arrows, guillemets — is intentionally allowed.
 */
const EMOJI =
  /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{25A0}-\u{25FF}\u{FE0F}\u{1F1E6}-\u{1F1FF}]/u;

const SRC = join(process.cwd(), 'src');

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (/\.(ts|tsx|css)$/.test(name)) out.push(p);
  }
  return out;
}

describe('no emojis in source', () => {
  const files = walk(SRC);

  it('finds source files to scan', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  for (const file of files) {
    const rel = file.slice(SRC.length + 1);
    it(`is emoji-free: src/${rel}`, () => {
      const text = readFileSync(file, 'utf8');
      const lines = text.split('\n');
      const offenders = lines
        .map((line, i) => ({ line, n: i + 1 }))
        .filter(({ line }) => EMOJI.test(line))
        .map(({ n, line }) => `  L${n}: ${line.trim().slice(0, 80)}`);
      expect(offenders, `Emoji found in src/${rel}:\n${offenders.join('\n')}`).toEqual([]);
    });
  }
});
