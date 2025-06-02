import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Version } from '../entities/version.entity';
import { logger } from '../utils/logger';
import { DeepPartial } from 'typeorm';

const versionRepository = AppDataSource.getRepository(Version);

export class VersionController {
  // 创建新的应用版本
  async create(req: Request, res: Response) {
    try {
      const versionData = req.body as DeepPartial<Version>;
      const newVersion = versionRepository.create(versionData);
      const result = await versionRepository.save(newVersion);
      logger.info(`Created new version: ${result.platform}@${result.version}`);
      res.status(201).json({
        code: 0,
        message: 'success',
        data: result,
      });
    } catch (error) {
      logger.error('Failed to create version:', error);
      res.status(500).json({
        code: 500,
        message: 'Failed to create version',
        data: null,
      });
    }
  }

  // 获取所有应用版本
  async findAll(_req: Request, res: Response) {
    try {
      const versions = await versionRepository.find();
      res.json({
        code: 0,
        message: 'success',
        data: versions,
      });
    } catch (error) {
      logger.error('Failed to fetch versions:', error);
      res.status(500).json({
        code: 500,
        message: 'Failed to fetch versions',
        data: null,
      });
    }
  }

  // 根据ID获取应用版本
  async findOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const version = await versionRepository.findOne({
        where: { id: Number(id) },
        relations: ['mappings'],
      });

      if (!version) {
        return res.status(404).json({
          code: 404,
          message: 'Version not found',
          data: null,
        });
      }

      res.json({
        code: 0,
        message: 'success',
        data: version,
      });
    } catch (error) {
      logger.error(`Failed to fetch version ${req.params.id}:`, error);
      res.status(500).json({
        code: 500,
        message: 'Failed to fetch version',
        data: null,
      });
    }
  }

  // 更新应用版本
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const versionData = req.body as DeepPartial<Version>;
      const result = await versionRepository.update(id, versionData);

      if (result.affected === 0) {
        return res.status(404).json({
          code: 404,
          message: 'Version not found',
          data: null,
        });
      }

      const updated = await versionRepository.findOne({ where: { id: Number(id) } });
      logger.info(`Updated version: ${id}`);
      res.json({
        code: 0,
        message: 'success',
        data: updated,
      });
    } catch (error) {
      logger.error(`Failed to update version ${req.params.id}:`, error);
      res.status(500).json({
        code: 500,
        message: 'Failed to update version',
        data: null,
      });
    }
  }

  // 删除应用版本
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await versionRepository.delete(id);

      if (result.affected === 0) {
        return res.status(404).json({
          code: 404,
          message: 'Version not found',
          data: null,
        });
      }

      logger.info(`Deleted version: ${id}`);
      res.status(204).json({
        code: 0,
        message: 'success',
        data: null,
      });
    } catch (error) {
      logger.error(`Failed to delete version ${req.params.id}:`, error);
      res.status(500).json({
        code: 500,
        message: 'Failed to delete version',
        data: null,
      });
    }
  }
}
