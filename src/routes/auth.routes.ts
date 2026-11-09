import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { loginSchema, registerSchema } from '../validations/auth.validation.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { APP_ROLES } from '../config/constants.js';

const router = Router();

router.post('/login', validateRequest(loginSchema), AuthController.login);
router.get('/me', authenticate, AuthController.getCurrentUser);
router.post('/logout', AuthController.logout);
router.post(
  '/register',
  authenticate,
  authorize(APP_ROLES.ADMIN),
  validateRequest(registerSchema),
  AuthController.register
);

export const authRoutes = router;

