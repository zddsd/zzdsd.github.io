import { readFileSync } from 'fs'
import { resolve } from 'path'
import whois from 'whois'
import { promisify } from 'util'

const whoisLookup = promisify(whois.lookup)

export default async function handler(req, res) {
  try {
    const { domain } = req.query
    if (!domain) {
      res.status(400).json({ success: false, message: 'Domain is required' })
      return
    }
    const serversPath = resolve(process.cwd(), 'public/data/whois-servers.json')
    let servers: Record<string, string>
    try {
      servers = JSON.parse(readFileSync(serversPath, 'utf-8'))
    } catch (e) {
      res.status(500).json({ success: false, message: '配置文件不存在' })
      return
    }
    const tld = domain.split('.').pop()?.toLowerCase()
    if (!tld) {
      res.status(400).json({ success: false, message: 'Invalid domain format' })
      return
    }
    const whoisServer = servers[tld]
    if (!whoisServer) {
      res.status(400).json({ success: false, message: `No WHOIS server found for TLD: ${tld}` })
      return
    }
    const result = await whoisLookup(domain, { server: whoisServer })
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    res.json({ success: true, data: result })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Internal server error' })
  }
} 