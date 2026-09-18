import { describe, expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';

const script = 'scripts/validate-final-release.mjs';

describe('validate-final-release', () => {
  it('accepts a final release tag', () => {
    expect(() => execFileSync('node', [script, 'v0.1.6.9999'])).not.toThrow();
  });

  it.each(['v0.1.6.1000', 'v0.1.6.5000', 'v0.1.6.8000', 'v0.1.6.9000'])('rejects %s', (tag) => {
    expect(() => execFileSync('node', [script, tag], { stdio: 'ignore' })).toThrow();
  });
});
