import { describe, expect, it } from 'vitest';
import { derivePackage } from '../scripts/package.mjs';

describe('derivePackage', () => {
  it.each([
    ['v0.1.5-dev.1', 'dev', '0.1.5.1', 'configs/dev.json', 'artifacts/tempough-time-dev.vsix'],
    ['v0.1.5-dev.999', 'dev', '0.1.5.999', 'configs/dev.json', 'artifacts/tempough-time-dev.vsix'],
    ['v0.1.5-beta.1', 'beta', '0.1.5.1001', 'configs/release.json', 'artifacts/tempough-time.vsix'],
    ['v0.1.5-beta.3999', 'beta', '0.1.5.4999', 'configs/release.json', 'artifacts/tempough-time.vsix'],
    ['v0.1.5-rc.1', 'rc', '0.1.5.5001', 'configs/release.json', 'artifacts/tempough-time.vsix'],
    ['v0.1.5-rc.4998', 'rc', '0.1.5.9998', 'configs/release.json', 'artifacts/tempough-time.vsix'],
    ['v0.1.5', 'release', '0.1.5.9999', 'configs/release.json', 'artifacts/tempough-time.vsix'],
  ])('maps %s to its Azure DevOps deployment version', (tag, channel, deploymentVersion, overridesFile, artifactPath) => {
    expect(derivePackage(tag)).toEqual({ artifactPath, channel, deploymentVersion, overridesFile });
  });

  it.each([
    '0.1.5',
    'v01.1.5',
    'v0.1.5-dev.0',
    'v0.1.5-beta.4000',
    'v0.1.5-rc.4999',
    'v0.1.5-alpha.1',
    'v0.1.5+build.1',
  ])('rejects unsupported tag %s', (tag) => {
    expect(() => derivePackage(tag)).toThrow();
  });
});
