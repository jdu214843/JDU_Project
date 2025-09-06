import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { getCurrentUserProfile, updateCurrentUserProfile, updateUserSettings, downloadMyData, deleteMe } from '../controllers/user.controller.js';

const router = Router();

router.get('/me', authRequired, getCurrentUserProfile);
router.put('/me', authRequired, updateCurrentUserProfile);
router.put('/me/settings', authRequired, updateUserSettings);
router.post('/me/download-data', authRequired, downloadMyData);
router.delete('/me', authRequired, deleteMe);

export default router;
