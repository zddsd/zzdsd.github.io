import { readFileSync } from 'fs'
import { resolve } from 'path'
import whois from 'whois'
import { promisify } from 'util'
import express from 'express'

const app = express()
const whoisLookup = promisify(whois.lookup)

app.get('/whois', async (req, res) => {
  try {
    const domain = req.query.domain as string
    if (!domain) {
      return res.status(400).json({ success: false, message: 'Domain is required' })
    }
    // 读取 WHOIS 服务器配置
    const serversPath = resolve(__dirname, '../../public/data/whois-servers.json')
    let servers: Record<string, string>
    try {
      servers = JSON.parse(readFileSync(serversPath, 'utf-8'))
    } catch (e) {
      return res.status(500).json({ success: false, message: '配置文件不存在' })
    }
    // 获取域名的 WHOIS 服务器
    const tld = domain.split('.').pop()?.toLowerCase()
    if (!tld) {
      return res.status(400).json({ success: false, message: 'Invalid domain format' })
    }
    const whoisServer = servers[tld]
    if (!whoisServer) {
      return res.status(400).json({ success: false, message: `No WHOIS server found for TLD: ${tld}` })
    }
    // 执行 WHOIS 查询
    const result = await whoisLookup(domain, { server: whoisServer })
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    return res.json({ success: true, data: result })
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' })
  }
})

// Vercel Serverless 入口
export default app

// 本地开发监听端口
if (import.meta.url === `file://${process.argv[1]}`) {
  app.listen(3000, () => {
    console.log('WHOIS API 本地服务已启动，端口 3000')
  })
} 