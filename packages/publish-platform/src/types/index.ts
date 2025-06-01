// 离线包元信息
export interface PackageMeta {
  id: string;
  name: string;
  version: string;
  description: string;
  size: number;
  url: string;
  hash: string;
  createTime: string;
  updateTime: string;
}

// App版本信息
export interface AppVersion {
  id: string;
  platform: 'ios' | 'android';
  version: string;
  minVersion: string;
  maxVersion: string;
}

// 版本映射关系
export interface VersionMapping {
  id: string;
  appVersionId: string;
  packageId: string;
  isActive: boolean;
  createTime: string;
}

// API响应类型
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
} 