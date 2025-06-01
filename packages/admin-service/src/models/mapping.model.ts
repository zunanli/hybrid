import mongoose from 'mongoose';
import type { VersionMapping } from '../types';

const mappingSchema = new mongoose.Schema<VersionMapping>(
  {
    appVersionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Version', required: true },
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true },
    isActive: { type: Boolean, default: true },
    createTime: { type: Date, default: Date.now },
  },
  {
    timestamps: { createdAt: 'createTime', updatedAt: false },
  },
);

// 创建联合唯一索引
mappingSchema.index({ appVersionId: 1, packageId: 1 }, { unique: true });

export const Mapping = mongoose.model<VersionMapping>('Mapping', mappingSchema);
