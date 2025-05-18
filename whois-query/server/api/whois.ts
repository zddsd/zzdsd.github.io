import { readFileSync } from 'fs'
import { resolve } from 'path'
import whois from 'whois'
import { promisify } from 'util'
import { defineEventHandler, getQuery, createError } from 'h3'
import { useRuntimeConfig } from '#imports'

const whoisLookup = promisify(whois.lookup)

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const domain = query.domain as string

    if (!domain) {
      throw createError({ statusCode: 400, message: 'Domain is required' })
    }

    // 读取 WHOIS 服务器配置
    const config = useRuntimeConfig()
    console.log('当前工作目录:', process.cwd())
    console.log('配置文件路径:', config.public.whoisServersPath)
    const serversPath = resolve(process.cwd(), config.public.whoisServersPath)
    console.log('完整配置文件路径:', serversPath)
    let servers
    try {
      servers = JSON.parse(readFileSync(serversPath, 'utf-8'))
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code === 'ENOENT') {
         throw createError({ statusCode: 500, message: `配置文件不存在: ${serversPath}` })
      }
      throw createError({ statusCode: 500, message: 'Failed to read WHOIS server configuration' })
    }

    // 获取域名的 WHOIS 服务器
    const tld = domain.split('.').pop()?.toLowerCase()
    const whoisServer = servers[tld]
    if (!whoisServer) {
      throw createError({ statusCode: 400, message: `No WHOIS server found for TLD: ${tld}` })
    }

    // 执行 WHOIS 查询
    const result = await whoisLookup(domain, { server: whoisServer })

    return { success: true, data: result }
  } catch (error: any) {
    throw createError({ statusCode: (error.statusCode || 500), message: (error.message || 'Internal server error') })
  }
}) 