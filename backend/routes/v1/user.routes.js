import { Router } from 'express';
import auth from '../../middlewares/secureRoute.js';
import checkRole from '../../middlewares/checkRole.js';

import {
    getAllUsers,
    getUserStats,
    updateUserRole,
} from '../../controller/userController.js';

const router = Router();
router.use(auth);

router.get('/stats', getUserStats);

router.get('/', checkRole('admin'), getAllUsers);

router.patch('/:id/role', checkRole('admin'), updateUserRole);

export default router;