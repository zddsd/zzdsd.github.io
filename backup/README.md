# 备份目录说明

本目录用于存放项目历史代码、脚本、测试用例等备份内容，便于回溯和参考。

## 目录结构

```
backup/
├── old-whois-service/        # 旧版 WHOIS 服务相关代码和测试
│   ├── fetch-whois-servers.ts
│   └── whois-servers.test.ts
├── whois-servers.json        # 历史 WHOIS 服务器数据备份
└── ...
```

## 说明

- 本目录下的内容不会被自动清理或覆盖。
- 仅供开发、迁移、回溯历史时参考。
- 新开发请以 whois-query/ 和 whois-crawler/ 目录为准。 