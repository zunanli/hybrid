import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import routes from './routes';
import { logger } from './utils/logger';

const app = express();

// 配置multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '52428800'), // 默认50MB
  },
});

// CORS 配置
const corsOptions = {
  origin: ['http://localhost:3001', 'http://localhost:3008'], // 允许的前端域名
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // 允许的 HTTP 方法
  allowedHeaders: ['Content-Type', 'Authorization'], // 允许的请求头
  credentials: true, // 允许发送认证信息（cookies）
  maxAge: 86400, // CORS 预检请求缓存时间（秒）
};

// 中间件
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads')));

// 错误处理中间件
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    message: 'Internal server error',
  });
});

// 路由
app.use('/api', routes);

// 健康检查
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

export { app, upload };
