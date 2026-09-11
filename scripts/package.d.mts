export interface PackageDetails {
  artifactPath: string;
  channel: 'dev' | 'beta' | 'rc' | 'release';
  deploymentVersion: string;
  overridesFile: string;
}

export function derivePackage(tag: string): PackageDetails;
export function packageExtension(tag: string): void;
