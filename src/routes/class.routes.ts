import { Router } from 'express';
import { ClassController } from '../controllers/class.controller.js';

const router = Router();

router.get('/', ClassController.getClasses);
router.get('/:id', ClassController.getClassById);
router.post('/', ClassController.createClass);
router.put('/:id', ClassController.updateClass);
router.delete('/:id', ClassController.deleteClass);

export const classRoutes = router;

