# Hybrid

离线包管理系统

## 项目结构

- `packages/web-sdk`: 离线包加载SDK
- `packages/service`: 离线包后台管理服务
- `packages/platform`: 离线包管理平台

## 开发

```bash
# 安装依赖
pnpm install

# 启动后台服务
pnpm dev:admin

# 启动管理平台
pnpm dev:publish

# 构建SDK
pnpm build:sdk
```

## Git提交规范

提交信息格式：`feat: 提交描述`（描述不超过20字）

## License

MIT 