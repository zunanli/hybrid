import multer from 'multer';

// 配置multer
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '52428800'), // 默认50MB
  },
});
