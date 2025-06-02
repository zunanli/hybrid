import mongoose from 'mongoose';
import type { AppVersion } from '../types';

const versionSchema = new mongoose.Schema<AppVersion>(
  {
    platform: { type: String, enum: ['ios', 'android'], required: true },
    version: { type: String, required: true },
    minVersion: { type: String, required: true },
    maxVersion: { type: String, required: true },
    createTime: { type: Date, default: Date.now },
  },
  {
    timestamps: { createdAt: 'createTime', updatedAt: false },
  },
);

// 创建联合唯一索引
versionSchema.index({ platform: 1, version: 1 }, { unique: true });

export const Version = mongoose.model<AppVersion>('Version', versionSchema);
