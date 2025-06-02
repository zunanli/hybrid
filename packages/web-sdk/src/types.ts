export interface PackageInfo {
  packageId: number;
  packageName: string;
  packageVersion: string;
  packageUrl: string;
  packageHash: string;
  packageSize: number;
}

export interface SDKConfig {
  apiKey?: string;
  apiUrl: string;
  platform: 'IOS' | 'ANDROID';
  version: string;
}

export interface QueryParams {
  [key: string]: string | undefined;
  apiKey?: string;
  reload?: string;
}
