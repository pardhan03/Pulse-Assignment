import { Router } from 'express';
import {
    deleteVideoHandler,
    getVideoByIdHandler,
    getVideosHandler,
    streamVideoHandler,
    updateVideoHandler,
    uploadVideoHandler
} from '../../controller/videoController.js';
import upload from '../../config/multer.js';
import auth from '../../middlewares/secureRoute.js';
import checkRole from '../../middlewares/checkRole.js';

const router = Router();

// Stream video
router.get('/:id/stream', streamVideoHandler);

router.use(auth);

router.post(
    '/upload',
    upload.single('video'),
    uploadVideoHandler
);

router.get('/', getVideosHandler);

router.get('/:id', getVideoByIdHandler);

router.patch(
    '/:id',
    checkRole('editor', 'admin'),
    updateVideoHandler
);

router.delete(
    '/:id',
    checkRole('editor', 'admin'),
    deleteVideoHandler
);

export default router;