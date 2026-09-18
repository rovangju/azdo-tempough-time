import { classifyVersionTag } from './version.mjs';

const tag = process.argv[2];

if (!tag) {
  throw new Error('VERSION is required, for example: v0.1.6.9999');
}

const packageDetails = classifyVersionTag(tag);

if (packageDetails.channel !== 'release') {
  throw new Error('VERSION must use the final release revision 9999.');
}
