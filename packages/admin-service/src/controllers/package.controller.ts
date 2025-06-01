import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Package } from '../entities/package.entity';
import { logger } from '../utils/logger';
import { createHash } from 'crypto';
import { DeepPartial } from 'typeorm';
import path from 'path';
import fs from 'fs';

const packageRepository = AppDataSource.getRepository(Package);

export class PackageController {
  // 上传离线包
  async upload(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({
          code: 400,
          message: 'No file uploaded',
          data: null,
        });
      }

      const { name, version, description } = req.body;
      const { file } = req;

      // 计算文件哈希
      const hash = createHash('sha256').update(file.buffer).digest('hex');

      // 保存文件到本地
      const fileName = `${name}-${version}-${hash}.zip`;
      const filePath = path.join(process.env.UPLOAD_DIR || 'uploads', fileName);
      await fs.promises.writeFile(filePath, file.buffer);

      // 创建包记录
      const newPackage: DeepPartial<Package> = {
        name,
        version,
        description,
        size: file.size,
        url: `/uploads/${fileName}`,
        hash,
      };

      const result = await packageRepository.save(packageRepository.create(newPackage));
      logger.info(`Created new package: ${result.name}@${result.version}`);
      res.status(201).json({
        code: 0,
        message: 'success',
        data: result,
      });
    } catch (error) {
      logger.error('Failed to upload package:', error);
      res.status(500).json({
        code: 500,
        message: 'Failed to upload package',
        data: null,
      });
    }
  }

  // 创建新的离线包
  async create(req: Request, res: Response) {
    try {
      const packageData = req.body as DeepPartial<Package>;
      const newPackage = packageRepository.create(packageData);
      const result = await packageRepository.save(newPackage);
      logger.info(`Created new package: ${result.name}@${result.version}`);
      res.status(201).json({
        code: 0,
        message: 'success',
        data: result,
      });
    } catch (error) {
      logger.error('Failed to create package:', error);
      res.status(500).json({
        code: 500,
        message: 'Failed to create package',
        data: null,
      });
    }
  }

  // 获取所有离线包
  async findAll(_req: Request, res: Response) {
    try {
      const packages = await packageRepository.find({
        order: {
          createTime: 'DESC',
        },
      });
      res.json({
        code: 0,
        message: 'success',
        data: packages,
      });
    } catch (error) {
      logger.error('Failed to fetch packages:', error);
      res.status(500).json({
        code: 500,
        message: 'Failed to fetch packages',
        data: null,
      });
    }
  }

  // 根据ID获取离线包
  async findOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const foundPackage = await packageRepository.findOne({
        where: { id: Number(id) },
        relations: ['mappings'],
      });

      if (!foundPackage) {
        return res.status(404).json({
          code: 404,
          message: 'Package not found',
          data: null,
        });
      }

      res.json({
        code: 0,
        message: 'success',
        data: foundPackage,
      });
    } catch (error) {
      logger.error(`Failed to fetch package ${req.params.id}:`, error);
      res.status(500).json({
        code: 500,
        message: 'Failed to fetch package',
        data: null,
      });
    }
  }

  // 更新离线包
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const packageData = req.body as DeepPartial<Package>;
      const result = await packageRepository.update(id, packageData);

      if (result.affected === 0) {
        return res.status(404).json({
          code: 404,
          message: 'Package not found',
          data: null,
        });
      }

      const updated = await packageRepository.findOne({ where: { id: Number(id) } });
      logger.info(`Updated package: ${id}`);
      res.json({
        code: 0,
        message: 'success',
        data: updated,
      });
    } catch (error) {
      logger.error(`Failed to update package ${req.params.id}:`, error);
      res.status(500).json({
        code: 500,
        message: 'Failed to update package',
        data: null,
      });
    }
  }

  // 删除离线包
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // 先获取包信息
      const pkg = await packageRepository.findOne({ where: { id: Number(id) } });
      if (!pkg) {
        return res.status(404).json({
          code: 404,
          message: 'Package not found',
          data: null,
        });
      }

      // 删除文件
      const filePath = path.join(process.env.UPLOAD_DIR || 'uploads', path.basename(pkg.url));
      await fs.promises.unlink(filePath).catch((err) => {
        logger.warn(`Failed to delete file ${filePath}:`, err);
      });

      // 删除数据库记录
      const result = await packageRepository.delete(id);
      if (result.affected === 0) {
        return res.status(404).json({
          code: 404,
          message: 'Package not found',
          data: null,
        });
      }

      logger.info(`Deleted package: ${id}`);
      res.status(204).json({
        code: 0,
        message: 'success',
        data: null,
      });
    } catch (error) {
      logger.error(`Failed to delete package ${req.params.id}:`, error);
      res.status(500).json({
        code: 500,
        message: 'Failed to delete package',
        data: null,
      });
    }
  }
}
