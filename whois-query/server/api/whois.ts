import { readFileSync } from 'fs'
import { resolve } from 'path'
import whois from 'whois'
import { promisify } from 'util'
import { defineEventHandler, getQuery, createError, H3Event } from 'h3'
import type { RuntimeConfig } from '@nuxt/schema'

const whoisLookup = promisify(whois.lookup)

export default defineEventHandler(async (event: H3Event) => {
  try {
    const query = getQuery(event)
    const domain = query.domain as string

    if (!domain) {
      throw createError({ statusCode: 400, message: 'Domain is required' })
    }

    // 读取 WHOIS 服务器配置
    const config = event.context.nuxt?.runtimeConfig as RuntimeConfig
    if (!config?.public?.whoisServersPath) {
      throw createError({ statusCode: 500, message: 'Runtime config not found' })
    }

    const serversPath = resolve(process.cwd(), config.public.whoisServersPath as string)
    let servers: Record<string, string>
    try {
      servers = JSON.parse(readFileSync(serversPath, 'utf-8'))
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code === 'ENOENT') {
        // 如果在 Vercel 环境中，尝试从 public 目录读取
        const publicPath = resolve(process.cwd(), 'public', config.public.whoisServersPath as string)
        try {
          servers = JSON.parse(readFileSync(publicPath, 'utf-8'))
        } catch (e2) {
          throw createError({ statusCode: 500, message: `配置文件不存在: ${publicPath}` })
        }
      } else {
        throw createError({ statusCode: 500, message: 'Failed to read WHOIS server configuration' })
      }
    }

    // 获取域名的 WHOIS 服务器
    const tld = domain.split('.').pop()?.toLowerCase()
    if (!tld) {
      throw createError({ statusCode: 400, message: 'Invalid domain format' })
    }
    const whoisServer = servers[tld]
    if (!whoisServer) {
      throw createError({ statusCode: 400, message: `No WHOIS server found for TLD: ${tld}` })
    }

    // 执行 WHOIS 查询
    const result = await whoisLookup(domain, { server: whoisServer })

    // 设置 CORS 头
    event.node.res.setHeader('Access-Control-Allow-Origin', '*')
    event.node.res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
    event.node.res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    return { success: true, data: result }
  } catch (error: any) {
    throw createError({ statusCode: (error.statusCode || 500), message: (error.message || 'Internal server error') })
  }
}) 