import { appendFileSync, mkdirSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { classifyVersionTag } from './version.mjs';

export function packageExtension(tag) {
  const packageDetails = classifyVersionTag(tag);

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
      JSON.stringify({
        version: packageDetails.deploymentVersion,
        public: packageDetails.public,
      }),
      '--output-path',
      packageDetails.artifactPath,
    ],
    { stdio: 'inherit' },
  );

  writeGithubOutputs(packageDetails);

  console.log(`Tag: ${tag}`);
  console.log(`Channel: ${packageDetails.channel}`);
  console.log(`Deployment version: ${packageDetails.deploymentVersion}`);
  console.log(`Artifact: ${packageDetails.artifactPath}`);
}

function writeGithubOutputs(packageDetails) {
  if (!process.env.GITHUB_OUTPUT) {
    return;
  }

  appendFileSync(
    process.env.GITHUB_OUTPUT,
    [
      `tag=${packageDetails.tag}`,
      `channel=${packageDetails.channel}`,
      `prerelease=${packageDetails.prerelease}`,
      `deployment_version=${packageDetails.deploymentVersion}`,
      `artifact_path=${packageDetails.artifactPath}`,
      '',
    ].join('\n'),
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const tag = process.argv[2];

  if (!tag) {
    throw new Error('VERSION is required, for example: make package VERSION=v0.1.5.5001');
  }

  packageExtension(tag);
}
