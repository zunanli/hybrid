import { Router, RequestHandler } from 'express';
import { PackageController } from '../controllers/package.controller';
import { VersionController } from '../controllers/version.controller';
import { MappingController } from '../controllers/mapping.controller';
import { upload } from '../middleware/upload';

const router = Router();
const packageController = new PackageController();
const versionController = new VersionController();
const mappingController = new MappingController();

// Package routes
router.post(
  '/packages/upload',
  upload.single('file'),
  packageController.upload.bind(packageController) as RequestHandler,
);
router.post('/packages', packageController.create.bind(packageController) as RequestHandler);
router.get('/packages', packageController.findAll.bind(packageController) as RequestHandler);
router.get('/packages/:id', packageController.findOne.bind(packageController) as RequestHandler);
router.put('/packages/:id', packageController.update.bind(packageController) as RequestHandler);
router.delete('/packages/:id', packageController.delete.bind(packageController) as RequestHandler);

// Version routes
router.post('/versions', versionController.create.bind(versionController) as RequestHandler);
router.get('/versions', versionController.findAll.bind(versionController) as RequestHandler);
router.get('/versions/:id', versionController.findOne.bind(versionController) as RequestHandler);
router.put('/versions/:id', versionController.update.bind(versionController) as RequestHandler);
router.delete('/versions/:id', versionController.delete.bind(versionController) as RequestHandler);

// Mapping routes
router.post('/mappings', mappingController.create.bind(mappingController) as RequestHandler);
router.get('/mappings', mappingController.findAll.bind(mappingController) as RequestHandler);
router.get('/mappings/:id', mappingController.findOne.bind(mappingController) as RequestHandler);
router.put('/mappings/:id', mappingController.update.bind(mappingController) as RequestHandler);
router.delete('/mappings/:id', mappingController.delete.bind(mappingController) as RequestHandler);

// Native API routes
router.get('/native/packages', mappingController.findByPlatformAndVersion.bind(mappingController) as RequestHandler);

export default router;
