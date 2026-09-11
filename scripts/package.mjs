import { mkdirSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const TAG_PATTERN = /^v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-(dev|beta|rc)\.(0|[1-9]\d*))?$/;

export function derivePackage(tag) {
  const match = TAG_PATTERN.exec(tag);

  if (!match) {
    throw new Error(
      'VERSION must be vMAJOR.MINOR.PATCH or vMAJOR.MINOR.PATCH-(dev|beta|rc).N.',
    );
  }

  const [, major, minor, patch, channel = 'release', sequence] = match;
  const coreVersion = `${major}.${minor}.${patch}`;
  let revision;
  let artifactPath;
  let overridesFile;

  if (channel === 'dev') {
    validateSequence(channel, sequence, 999);
    revision = Number(sequence);
    artifactPath = 'artifacts/tempough-time-dev.vsix';
    overridesFile = 'configs/dev.json';
  } else if (channel === 'beta') {
    validateSequence(channel, sequence, 3999);
    revision = 1000 + Number(sequence);
    artifactPath = 'artifacts/tempough-time.vsix';
    overridesFile = 'configs/release.json';
  } else if (channel === 'rc') {
    validateSequence(channel, sequence, 4998);
    revision = 5000 + Number(sequence);
    artifactPath = 'artifacts/tempough-time.vsix';
    overridesFile = 'configs/release.json';
  } else {
    revision = 9999;
    artifactPath = 'artifacts/tempough-time.vsix';
    overridesFile = 'configs/release.json';
  }

  return {
    artifactPath,
    channel,
    deploymentVersion: `${coreVersion}.${revision}`,
    overridesFile,
  };
}

function validateSequence(channel, sequence, maximum) {
  if (Number(sequence) < 1 || Number(sequence) > maximum) {
    throw new Error(`${channel} sequence must be between 1 and ${maximum}.`);
  }
}

export function packageExtension(tag) {
  const packageDetails = derivePackage(tag);

  rmSync('artifacts', { force: true, recursive: true });
  mkdirSync('artifacts', { recursive: true });

  execFileSync(
    'npx',
    [
      'tfx-cli',
      'extension',
      'create',
      '--manifest-globs',
      'vss-extension.json',
      '--overrides-file',
      packageDetails.overridesFile,
      '--override',
      JSON.stringify({ version: packageDetails.deploymentVersion }),
      '--output-path',
      packageDetails.artifactPath,
    ],
    { stdio: 'inherit' },
  );

  console.log(`Tag: ${tag}`);
  console.log(`Channel: ${packageDetails.channel}`);
  console.log(`Deployment version: ${packageDetails.deploymentVersion}`);
  console.log(`Artifact: ${packageDetails.artifactPath}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const tag = process.argv[2];

  if (!tag) {
    throw new Error('VERSION is required, for example: make package VERSION=v0.1.5-rc.1');
  }

  packageExtension(tag);
}
