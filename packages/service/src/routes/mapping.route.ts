import { Router } from 'express';
import { createMapping, getMappings, updateMapping } from '../controllers/mapping.controller';

const router = Router();

router.post('/', createMapping);
router.get('/', getMappings);
router.put('/:id', updateMapping);

export default router;
