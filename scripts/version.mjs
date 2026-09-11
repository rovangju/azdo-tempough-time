const TAG_PATTERN = /^v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)\.([1-9]\d*)$/;

export function classifyVersionTag(tag) {
  const match = TAG_PATTERN.exec(tag);

  if (!match) {
    throw new Error('VERSION must be vMAJOR.MINOR.PATCH.REVISION.');
  }

  const [, major, minor, patch, revisionText] = match;
  const revision = Number(revisionText);
  const version = `${major}.${minor}.${patch}.${revision}`;
  const classification = classifyRevision(revision);
  const development = classification.channel === 'dev';

  return {
    artifactPath: development ? 'artifacts/tempough-time-dev.vsix' : 'artifacts/tempough-time.vsix',
    channel: classification.channel,
    deploymentVersion: version,
    overridesFile: development ? 'configs/dev.json' : 'configs/release.json',
    prerelease: classification.prerelease,
    revision,
    tag,
  };
}

function classifyRevision(revision) {
  if (revision >= 1000 && revision <= 1999) {
    return { channel: 'dev', prerelease: true };
  }

  if (revision >= 5000 && revision <= 5999) {
    return { channel: 'beta', prerelease: true };
  }

  if (revision >= 8000 && revision <= 8999) {
    return { channel: 'rc', prerelease: true };
  }

  if (revision === 9999) {
    return { channel: 'release', prerelease: false };
  }

  throw new Error('REVISION must be 1000-1999, 5000-5999, 8000-8999, or 9999.');
}
