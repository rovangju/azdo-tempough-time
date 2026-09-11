import { describe, expect, it } from 'vitest';
import { derivePackage } from '../scripts/package.mjs';

describe('derivePackage', () => {
  it.each([
    ['v0.1.5.1', 'dev', '0.1.5.1', 'configs/dev.json', 'artifacts/tempough-time-dev.vsix'],
    ['v0.1.5.999', 'dev', '0.1.5.999', 'configs/dev.json', 'artifacts/tempough-time-dev.vsix'],
    ['v0.1.5.1000', 'beta', '0.1.5.1000', 'configs/release.json', 'artifacts/tempough-time.vsix'],
    ['v0.1.5.4999', 'beta', '0.1.5.4999', 'configs/release.json', 'artifacts/tempough-time.vsix'],
    ['v0.1.5.5000', 'rc', '0.1.5.5000', 'configs/release.json', 'artifacts/tempough-time.vsix'],
    ['v0.1.5.9998', 'rc', '0.1.5.9998', 'configs/release.json', 'artifacts/tempough-time.vsix'],
    ['v0.1.5.9999', 'release', '0.1.5.9999', 'configs/release.json', 'artifacts/tempough-time.vsix'],
  ])('maps %s to its Azure DevOps deployment version', (tag, channel, deploymentVersion, overridesFile, artifactPath) => {
    expect(derivePackage(tag)).toEqual({ artifactPath, channel, deploymentVersion, overridesFile });
  });

  it.each([
    '0.1.5',
    'v01.1.5.1',
    'v0.1.5.0',
    'v0.1.5.10000',
    'v0.1.5.01',
    'v0.1.5-rc.1',
  ])('rejects unsupported tag %s', (tag) => {
    expect(() => derivePackage(tag)).toThrow();
  });
});
