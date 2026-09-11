import { mkdirSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const TAG_PATTERN = /^v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)\.([1-9]\d*)$/;

export function derivePackage(tag) {
  const match = TAG_PATTERN.exec(tag);

  if (!match) {
    throw new Error(
      'VERSION must be vMAJOR.MINOR.PATCH.REVISION.',
    );
  }

  const [, major, minor, patch, revisionText] = match;
  const revision = Number(revisionText);
  const deploymentVersion = `${major}.${minor}.${patch}.${revision}`;
  let channel;
  let artifactPath;
  let overridesFile;

  if (revision <= 999) {
    channel = 'dev';
    artifactPath = 'artifacts/tempough-time-dev.vsix';
    overridesFile = 'configs/dev.json';
  } else if (revision <= 4999) {
    channel = 'beta';
    artifactPath = 'artifacts/tempough-time.vsix';
    overridesFile = 'configs/release.json';
  } else if (revision <= 9998) {
    channel = 'rc';
    artifactPath = 'artifacts/tempough-time.vsix';
    overridesFile = 'configs/release.json';
  } else if (revision === 9999) {
    channel = 'release';
    artifactPath = 'artifacts/tempough-time.vsix';
    overridesFile = 'configs/release.json';
  } else {
    throw new Error('REVISION must be between 1 and 9999.');
  }

  return {
    artifactPath,
    channel,
    deploymentVersion,
    overridesFile,
  };
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
    throw new Error('VERSION is required, for example: make package VERSION=v0.1.5.5001');
  }

  packageExtension(tag);
}
