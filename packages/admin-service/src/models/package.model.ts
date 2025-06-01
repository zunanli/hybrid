import mongoose from 'mongoose';
import type { PackageMeta } from '../types';

const packageSchema = new mongoose.Schema<PackageMeta>(
  {
    name: { type: String, required: true },
    version: { type: String, required: true },
    description: { type: String, required: true },
    size: { type: Number, required: true },
    url: { type: String, required: true },
    hash: { type: String, required: true },
    createTime: { type: Date, default: Date.now },
    updateTime: { type: Date, default: Date.now },
  },
  {
    timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' },
  },
);

// 创建联合唯一索引
packageSchema.index({ name: 1, version: 1 }, { unique: true });

export const Package = mongoose.model<PackageMeta>('Package', packageSchema);
