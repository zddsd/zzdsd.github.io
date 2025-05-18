# WHOIS 服务器爬虫服务

这是一个用于爬取 IANA WHOIS 服务器信息的独立服务。

## 功能特点

- 自动爬取 IANA 的 WHOIS 服务器列表
- 支持批量处理，避免请求过快
- 自动重试失败的请求
- 保存为 JSON 格式
- 完整的错误处理和日志输出

## 技术栈

- TypeScript
- Node.js
- Axios
- Vitest (测试框架)

## 目录结构

```
whois-crawler/
├── src/                  # 主爬虫代码
├── data/                 # 爬取结果输出目录
├── test/                 # 单元测试
├── package.json          # 项目依赖与脚本
├── vitest.config.ts      # 测试配置
├── tsconfig.json         # TypeScript 配置
└── ...
```

## 安装

```bash
npm install
```

## 使用方法

1. 运行爬虫：
```bash
npm start
```

2. 查看结果：
爬虫会在 `data/whois-servers.json` 文件中保存结果。

## 配置说明

可以在 `src/crawler.ts` 中修改以下配置：

- `baseUrl`: IANA 域名数据库的基础 URL
- `outputPath`: 输出文件的路径
- `batchSize`: 每批处理的域名数量
- `retryCount`: 失败重试次数
- `retryDelay`: 重试延迟时间（毫秒）
- `requestTimeout`: 请求超时时间（毫秒）

## 数据同步到查询服务

1. 运行本爬虫服务获取最新的 WHOIS 服务器列表
2. 进入 `whois-query` 目录，运行：
```bash
npm run copy-whois-servers
```
即可将数据同步到查询服务的 `public/data/` 目录

## 开发

1. 安装依赖：
```bash
npm install
```

2. 运行测试：
```bash
npm test
```

## 常见问题

- **Q: 爬虫运行失败或无数据？**
  - 检查网络连接，确保可以访问 IANA 网站。
  - 检查 `data/` 目录是否有写入权限。
- **Q: 如何只测试部分后缀？**
  - 可在 `src/crawler.ts` 中设置 testMode 或修改 TLD 列表。

## 贡献方式

欢迎提交 issue 或 PR 改进本项目！

1. Fork 本仓库
2. 新建分支进行开发
3. 提交 PR

## 注意事项

- 请合理设置请求间隔，避免对目标服务器造成压力
- 建议定期更新 WHOIS 服务器列表
- 确保网络连接稳定 