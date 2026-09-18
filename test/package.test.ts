import { describe, expect, it } from 'vitest';
import { classifyVersionTag } from '../scripts/version.mjs';

describe('classifyVersionTag', () => {
  it.each([
    ['v0.1.5.1000', 'dev', '0.1.5.1000', 'configs/dev.json', 'artifacts/tempough-time-dev.vsix', false],
    ['v0.1.5.1999', 'dev', '0.1.5.1999', 'configs/dev.json', 'artifacts/tempough-time-dev.vsix', false],
    ['v0.1.5.5000', 'beta', '0.1.5.5000', 'configs/release.json', 'artifacts/tempough-time.vsix', false],
    ['v0.1.5.5999', 'beta', '0.1.5.5999', 'configs/release.json', 'artifacts/tempough-time.vsix', false],
    ['v0.1.5.8000', 'rc', '0.1.5.8000', 'configs/release.json', 'artifacts/tempough-time.vsix', false],
    ['v0.1.5.8999', 'rc', '0.1.5.8999', 'configs/release.json', 'artifacts/tempough-time.vsix', false],
    ['v0.1.5.9999', 'release', '0.1.5.9999', 'configs/release.json', 'artifacts/tempough-time.vsix', true],
  ])('maps %s to its Azure DevOps deployment version', (tag, channel, deploymentVersion, overridesFile, artifactPath, publicExtension) => {
    expect(classifyVersionTag(tag)).toMatchObject({
      artifactPath,
      channel,
      deploymentVersion,
      overridesFile,
      public: publicExtension,
      prerelease: channel !== 'release',
      tag,
    });
  });

  it.each([
    '0.1.5',
    'v01.1.5.1',
    'v0.1.5.0',
    'v0.1.5.999',
    'v0.1.5.2000',
    'v0.1.5.6000',
    'v0.1.5.9000',
    'v0.1.5.10000',
    'v0.1.5.01',
    'v0.1.5-rc.1',
  ])('rejects unsupported tag %s', (tag) => {
    expect(() => classifyVersionTag(tag)).toThrow();
  });
});
