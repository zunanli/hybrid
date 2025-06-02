import { Router } from 'express';
import { createVersion, getVersions } from '../controllers/version.controller';

const router = Router();

router.post('/', createVersion);
router.get('/', getVersions);

export default router;
