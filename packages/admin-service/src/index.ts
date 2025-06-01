import 'reflect-metadata';
import dotenv from 'dotenv';
import { mkdirSync } from 'fs';
import path from 'path';
import { app } from './app';
import { logger } from './utils/logger';
import { AppDataSource } from './data-source';

// 加载环境变量
dotenv.config();

const port = process.env.PORT || 3008;
const uploadDir = process.env.UPLOAD_DIR || 'uploads';

// 确保上传目录存在
mkdirSync(path.join(__dirname, '..', uploadDir), { recursive: true });

// 初始化数据库连接
AppDataSource.initialize()
    .then(() => {
        logger.info('Database connected successfully');
        
        // 启动服务器
        app.listen(port, () => {
            logger.info(`Server is running on port ${port}`);
        });
    })
    .catch((error: Error) => {
        logger.error('Database connection error:', error);
        process.exit(1);
    }); 