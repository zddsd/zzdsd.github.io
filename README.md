# WHOIS 域名查询服务

这是一个基于 Nuxt 3 开发的 WHOIS 域名查询服务，提供简单易用的域名 WHOIS 信息查询功能。本项目采用现代化的技术栈，提供高性能、可靠的域名信息查询服务。

## 功能特点

- 简洁美观的用户界面，采用卡片式设计
- 支持多种顶级域名的 WHOIS 查询
- 完整的错误处理和用户提示
- 响应式设计，完美支持移动端和桌面端
- 实时查询状态反馈
- 查询历史记录（可选功能）
- 支持批量查询（计划中）

## 技术栈

- Nuxt 3 - 全栈框架
- TypeScript - 类型安全
- TailwindCSS - 现代化 UI 框架
- Vitest - 单元测试框架
- Node.js - 运行时环境
- WHOIS 协议 - 域名信息查询

## 环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0
- 现代浏览器支持（Chrome, Firefox, Safari, Edge 等）

## 目录结构

```
whois-query/
├── pages/                # 前端页面
│   └── index.vue        # 主查询页面
├── server/              # API 服务端代码
│   └── api/            # API 路由
├── public/              # 静态资源
│   └── data/           # WHOIS 服务器配置
├── scripts/             # 辅助脚本
│   └── copy-whois-servers.js  # 配置文件复制脚本
├── test/                # 单元测试
├── types/               # TypeScript 类型定义
├── components/          # Vue 组件
├── composables/         # 组合式函数
├── utils/              # 工具函数
├── package.json         # 项目依赖与脚本
├── nuxt.config.ts       # Nuxt 配置
└── .env                # 环境变量配置
```

## 环境变量配置

创建 `.env` 文件并配置以下环境变量：

```env
# 开发环境配置
NODE_ENV=development
PORT=3000

# 生产环境配置
NODE_ENV=production
BASE_URL=https://your-domain.com

# WHOIS 查询配置
WHOIS_TIMEOUT=10000
WHOIS_RETRY_COUNT=3
```

## 安装

1. 克隆仓库：
```bash
git clone https://github.com/your-username/whois-query.git
cd whois-query
```

2. 安装依赖：
```bash
npm install
```

3. 配置环境变量：
```bash
cp .env.example .env
# 编辑 .env 文件配置必要的环境变量
```

## 开发指南

### 开发服务器

1. 启动开发服务器：
```bash
npm run dev
```

2. 访问开发环境：
- 打开浏览器访问 `http://localhost:3000`
- 支持热重载，修改代码后自动更新

### 代码规范

- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 遵循 TypeScript 严格模式
- 组件使用 PascalCase 命名
- 工具函数使用 camelCase 命名

### 测试

1. 运行单元测试：
```bash
npm run test
```

2. 运行测试覆盖率报告：
```bash
npm run test:coverage
```

### 构建

1. 构建生产版本：
```bash
npm run build
```

2. 预览生产版本：
```bash
npm run preview
```

## 部署指南

### 静态托管部署

1. 构建项目：
```bash
npm run generate
```

2. 部署选项：
   - GitHub Pages
   - Vercel
   - Netlify
   - 自托管服务器

### Docker 部署

1. 构建 Docker 镜像：
```bash
docker build -t whois-query .
```

2. 运行容器：
```bash
docker run -p 3000:3000 whois-query
```

## 性能优化

- 使用 Nuxt 的自动代码分割
- 静态资源压缩和缓存
- API 响应缓存
- 查询结果缓存
- 延迟加载非关键组件

## 安全考虑

- 输入验证和清理
- 请求频率限制
- CORS 配置
- 错误信息处理
- 敏感信息过滤

## 维护指南

### WHOIS 服务器数据更新

1. 更新步骤：
```bash
# 1. 运行爬虫服务获取最新数据
npm run update-whois-servers

# 2. 复制配置文件
npm run copy-whois-servers

# 3. 验证配置
npm run validate-config

# 4. 重新构建部署
npm run build
```

2. 更新周期建议：
- 每月更新一次 WHOIS 服务器列表
- 每周检查配置有效性
- 每日监控查询成功率

### 日志管理

- 使用 Nuxt 内置日志系统
- 错误日志记录
- 查询统计
- 性能监控

## 常见问题

- **Q: 查询无结果或报错？**
  - 检查 `public/data/whois-servers.json` 是否存在且内容正确
  - 确认域名后缀是否在支持列表内
  - 检查网络连接和防火墙设置
  - 查看服务器日志获取详细错误信息

- **Q: 如何更新 WHOIS 服务器数据？**
  - 运行爬虫服务获取最新数据
  - 使用 `npm run copy-whois-servers` 更新配置
  - 重新构建并部署项目

- **Q: 如何本地测试？**
  - 运行 `npm run dev` 启动开发服务器
  - 访问 `http://localhost:3000`
  - 使用测试域名进行查询测试

- **Q: 如何处理查询超时？**
  - 检查网络连接
  - 调整 WHOIS_TIMEOUT 环境变量
  - 考虑使用代理服务器

## 贡献指南

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/your-feature`
3. 提交更改：`git commit -am 'Add some feature'`
4. 推送到分支：`git push origin feature/your-feature`
5. 提交 Pull Request

### 开发规范

- 遵循现有的代码风格
- 添加必要的测试
- 更新文档
- 确保所有测试通过
- 提供清晰的提交信息

## 许可证

MIT License

## 联系方式

- 项目维护者：[Your Name]
- 邮箱：[your-email@example.com]
- GitHub Issues: [项目 Issues 页面]

## 更新日志

### v1.0.0 (2024-03-xx)
- 初始版本发布
- 基本 WHOIS 查询功能
- 响应式界面设计
- 完整的错误处理

### 计划功能
- [ ] 批量查询支持
- [ ] 查询历史记录
- [ ] 更多域名后缀支持
- [ ] API 限流保护
- [ ] 查询结果导出 