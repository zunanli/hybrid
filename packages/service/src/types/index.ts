import { Document } from 'mongoose';

export interface PackageMeta extends Document {
  name: string;
  version: string;
  description: string;
  size: number;
  url: string;
  hash: string;
  createTime: Date;
  updateTime: Date;
}

export interface AppVersion extends Document {
  platform: 'ios' | 'android';
  version: string;
  minVersion: string;
  maxVersion: string;
  createTime: Date;
}

export interface VersionMapping extends Document {
  appVersionId: string;
  packageId: string;
  isActive: boolean;
  createTime: Date;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
