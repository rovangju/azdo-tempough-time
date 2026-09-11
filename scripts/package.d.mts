export interface PackageDetails {
  artifactPath: string;
  channel: 'dev' | 'beta' | 'rc' | 'release';
  deploymentVersion: string;
  overridesFile: string;
  prerelease: boolean;
  revision: number;
  tag: string;
}

export function packageExtension(tag: string): void;
