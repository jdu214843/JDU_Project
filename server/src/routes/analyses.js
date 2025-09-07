import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { authRequired } from '../middleware/auth.js';
import { uploadsDir } from '../util/uploads.js';
import { createAnalysis, listAnalyses, getAnalysisById, getAnalysisHistory } from '../controllers/analysis.controller.js';

const router = Router();

// Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `${Date.now()}-${uuidv4()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype && file.mimetype.startsWith('image/')) return cb(null, true)
  cb(new Error('Only image uploads are allowed'))
}

const upload = multer({ storage, fileFilter, limits: { files: 5, fileSize: 8 * 1024 * 1024 } });

router.post('/', authRequired, upload.array('images', 5), createAnalysis);
router.get('/', authRequired, listAnalyses);
router.get('/:id', authRequired, getAnalysisById);
router.get('/:id/history', authRequired, getAnalysisHistory);

export default router;
