# WHOIS 工具集

这是一个完整的 WHOIS 信息查询工具集，包含多个相互协作的组件，用于提供可靠、高效的域名 WHOIS 信息查询服务。

## 项目组件

### 1. WHOIS 查询服务 (whois-query)
基于 Nuxt 3 开发的现代化 WHOIS 查询服务，提供用户友好的 Web 界面和 API 接口。

主要特点：
- 美观的卡片式用户界面
- 完整的错误处理机制
- 响应式设计
- RESTful API 支持
- 实时查询状态反馈

详细文档：[whois-query/README.md](whois-query/README.md)

### 2. WHOIS 爬虫服务 (whois-crawler)
用于自动获取和更新 WHOIS 服务器配置信息的爬虫服务。

主要功能：
- 自动爬取 WHOIS 服务器信息
- 数据验证和清洗
- 定期更新配置
- 错误重试机制
- 日志记录

详细文档：[whois-crawler/README.md](whois-crawler/README.md)

### 3. 备份服务 (backup)
用于备份和管理 WHOIS 服务器配置数据的服务。

主要功能：
- 自动备份配置数据
- 版本控制
- 数据恢复
- 备份验证

## 系统架构

```
mytools/
├── whois-query/          # WHOIS 查询服务
│   ├── pages/           # 前端页面
│   ├── server/          # API 服务
│   └── public/          # 静态资源
├── whois-crawler/        # WHOIS 爬虫服务
│   ├── src/             # 源代码
│   └── scripts/         # 爬虫脚本
└── backup/              # 备份服务
    ├── data/            # 备份数据
    └── scripts/         # 备份脚本
```

## 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0
- 现代浏览器支持
- 网络连接（用于 WHOIS 查询）

### 安装步骤

1. 克隆仓库：
```bash
git clone https://github.com/your-username/mytools.git
cd mytools
```

2. 安装依赖：
```bash
# 安装查询服务依赖
cd whois-query
npm install

# 安装爬虫服务依赖
cd ../whois-crawler
npm install
```

3. 配置环境：
```bash
# 复制环境变量模板
cp whois-query/.env.example whois-query/.env
cp whois-crawler/.env.example whois-crawler/.env

# 编辑环境变量配置
```

### 启动服务

1. 启动 WHOIS 查询服务：
```bash
cd whois-query
npm run dev
```

2. 启动爬虫服务（可选）：
```bash
cd whois-crawler
npm run start
```

3. 访问服务：
- 查询服务：http://localhost:3000
- API 文档：http://localhost:3000/api/docs

## 开发指南

### 开发环境设置

1. 代码规范：
- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 遵循 TypeScript 严格模式
- 遵循各项目的具体开发规范

2. 测试：
```bash
# 运行查询服务测试
cd whois-query
npm run test

# 运行爬虫服务测试
cd ../whois-crawler
npm run test
```

### 部署

1. 构建服务：
```bash
# 构建查询服务
cd whois-query
npm run build

# 构建爬虫服务
cd ../whois-crawler
npm run build
```

2. 部署选项：
- 静态托管（Vercel、Netlify 等）
- Docker 容器
- 自托管服务器

## 维护指南

### 日常维护

1. WHOIS 服务器数据更新：
```bash
# 运行爬虫更新数据
cd whois-crawler
npm run update

# 复制更新后的配置
cd ../whois-query
npm run copy-whois-servers
```

2. 备份管理：
- 定期检查备份完整性
- 验证备份数据
- 清理旧备份

### 监控

- 服务健康检查
- 查询成功率监控
- 性能指标收集
- 错误日志分析

## 安全考虑

- 输入验证和清理
- 请求频率限制
- CORS 配置
- 敏感信息过滤
- 定期安全更新

## 常见问题

### 查询服务问题

- **Q: 查询服务无法启动？**
  - 检查环境变量配置
  - 确认端口未被占用
  - 查看错误日志

- **Q: 查询结果不准确？**
  - 确认 WHOIS 服务器配置是否最新
  - 检查网络连接
  - 验证域名格式

### 爬虫服务问题

- **Q: 爬虫更新失败？**
  - 检查网络连接
  - 确认目标服务器可访问
  - 查看爬虫日志

- **Q: 数据验证失败？**
  - 检查数据格式
  - 确认必要字段存在
  - 验证数据完整性

## 贡献指南

1. Fork 本仓库
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

### 开发规范

- 遵循现有代码风格
- 添加必要的测试
- 更新相关文档
- 确保所有测试通过
- 提供清晰的提交信息

## 版本历史

### v1.0.0 (2024-03-xx)
- 初始版本发布
- 基本 WHOIS 查询功能
- 爬虫服务集成
- 备份系统实现

### 计划功能
- [ ] 批量查询支持
- [ ] 查询历史记录
- [ ] 更多域名后缀支持
- [ ] API 限流保护
- [ ] 查询结果导出
- [ ] 爬虫性能优化
- [ ] 备份自动化

## 许可证

MIT License

## 联系方式

- 项目维护者：[Your Name]
- 邮箱：[your-email@example.com]
- GitHub Issues: [项目 Issues 页面]

## 致谢

感谢所有为本项目做出贡献的开发者！ 