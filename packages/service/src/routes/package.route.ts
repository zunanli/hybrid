import { Router } from 'express';
import multer from 'multer';
import { uploadPackage, getPackages } from '../controllers/package.controller';

const router = Router();
const upload = multer({
  storage: multer.diskStorage({
    destination: process.env.UPLOAD_DIR || 'uploads',
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '52428800'), // 默认50MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/zip' || file.originalname.endsWith('.zip')) {
      cb(null, true);
    } else {
      cb(new Error('只支持上传zip文件'));
    }
  },
});

router.post('/upload', upload.single('file'), uploadPackage);
router.get('/', getPackages);

export default router;
