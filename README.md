# Hybrid 离线包体系

本项目是一个完整的离线包解决方案，包含以下三个子项目：

## 项目结构

- `packages/publish-platform`: 离线包发布平台
  - React + Redux 实现的管理界面
  - 提供离线包的发布、版本管理等功能

- `packages/admin-service`: 离线包后台管理服务
  - Node.js 实现的后端服务
  - 提供离线包的存储、分发等功能

- `packages/web-sdk`: Web端SDK
  - 提供离线包的加载、更新等功能
  - 支持多场景使用

## 开发说明

### 环境要求

- Node.js >= 16
- Yarn >= 1.22

### 安装依赖

```bash
yarn install
```

### 开发命令

- 启动发布平台：`yarn dev:publish`
- 启动管理服务：`yarn dev:admin`
- 构建SDK：`yarn build:sdk`
- 运行测试：`yarn test`

## Git提交规范

提交信息格式：`feat: 提交描述`（描述不超过20字）

## License

MIT 