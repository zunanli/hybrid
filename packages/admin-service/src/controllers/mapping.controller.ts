import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Mapping } from '../entities/mapping.entity';
import { logger } from '../utils/logger';
import { DeepPartial } from 'typeorm';
import { Platform } from '../entities/version.entity';

const mappingRepository = AppDataSource.getRepository(Mapping);

export class MappingController {
  // 创建新的映射关系
  async create(req: Request, res: Response) {
    try {
      const mappingData = req.body as DeepPartial<Mapping>;
      const newMapping = mappingRepository.create(mappingData);
      const result = await mappingRepository.save(newMapping);
      logger.info(`Created new mapping with ID: ${result.id}`);
      res.status(201).json({
        code: 0,
        message: 'success',
        data: result,
      });
    } catch (error) {
      logger.error('Failed to create mapping:', error);
      res.status(500).json({
        code: 500,
        message: 'Failed to create mapping',
        data: null,
      });
    }
  }

  // 获取所有映射关系
  async findAll(_req: Request, res: Response) {
    try {
      const mappings = await mappingRepository.find({
        relations: ['appVersion', 'package'],
      });
      res.json({
        code: 0,
        message: 'success',
        data: mappings,
      });
    } catch (error) {
      logger.error('Failed to fetch mappings:', error);
      res.status(500).json({
        code: 500,
        message: 'Failed to fetch mappings',
        data: null,
      });
    }
  }

  // 根据ID获取映射关系
  async findOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const mapping = await mappingRepository.findOne({
        where: { id: Number(id) },
        relations: ['appVersion', 'package'],
      });

      if (!mapping) {
        return res.status(404).json({
          code: 404,
          message: 'Mapping not found',
          data: null,
        });
      }

      res.json({
        code: 0,
        message: 'success',
        data: mapping,
      });
    } catch (error) {
      logger.error(`Failed to fetch mapping ${req.params.id}:`, error);
      res.status(500).json({
        code: 500,
        message: 'Failed to fetch mapping',
        data: null,
      });
    }
  }

  // 更新映射关系
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const mappingData = req.body as DeepPartial<Mapping>;
      const result = await mappingRepository.update(id, mappingData);

      if (result.affected === 0) {
        return res.status(404).json({
          code: 404,
          message: 'Mapping not found',
          data: null,
        });
      }

      const updated = await mappingRepository.findOne({
        where: { id: Number(id) },
        relations: ['appVersion', 'package'],
      });
      logger.info(`Updated mapping: ${id}`);
      res.json({
        code: 0,
        message: 'success',
        data: updated,
      });
    } catch (error) {
      logger.error(`Failed to update mapping ${req.params.id}:`, error);
      res.status(500).json({
        code: 500,
        message: 'Failed to update mapping',
        data: null,
      });
    }
  }

  // 删除映射关系
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await mappingRepository.delete(id);

      if (result.affected === 0) {
        return res.status(404).json({
          code: 404,
          message: 'Mapping not found',
          data: null,
        });
      }

      logger.info(`Deleted mapping: ${id}`);
      res.status(204).json({
        code: 0,
        message: 'success',
        data: null,
      });
    } catch (error) {
      logger.error(`Failed to delete mapping ${req.params.id}:`, error);
      res.status(500).json({
        code: 500,
        message: 'Failed to delete mapping',
        data: null,
      });
    }
  }

  // 根据平台和版本获取离线包
  async findByPlatformAndVersion(req: Request, res: Response) {
    try {
      const { platform, version } = req.query;

      if (!platform || !version) {
        return res.status(400).json({
          code: 400,
          message: 'Platform and version are required',
          data: null,
        });
      }

      if (!Object.values(Platform).includes(platform as Platform)) {
        return res.status(400).json({
          code: 400,
          message: 'Invalid platform',
          data: null,
        });
      }

      const mapping = await mappingRepository
        .createQueryBuilder('mapping')
        .leftJoinAndSelect('mapping.appVersion', 'appVersion')
        .leftJoinAndSelect('mapping.package', 'package')
        .where('appVersion.platform = :platform', { platform })
        .andWhere('appVersion.version = :version', { version })
        .getOne();

      if (!mapping) {
        return res.status(404).json({
          code: 404,
          message: 'No package found for the specified platform and version',
          data: null,
        });
      }

      res.json({
        code: 0,
        message: 'success',
        data: {
          packageId: mapping.package.id,
          packageName: mapping.package.name,
          packageVersion: mapping.package.version,
          packageUrl: mapping.package.url,
          packageHash: mapping.package.hash,
          packageSize: mapping.package.size,
        },
      });
    } catch (error) {
      logger.error('Failed to fetch package by platform and version:', error);
      res.status(500).json({
        code: 500,
        message: 'Failed to fetch package',
        data: null,
      });
    }
  }
}
