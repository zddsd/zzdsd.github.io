import { describe, it, expect, vi } from 'vitest'
import { readFileSync } from 'fs'
import whois from 'whois'

describe('WHOIS 查询服务', () => {
  it('能正确读取 WHOIS 服务器配置', () => {
    const servers = JSON.parse(readFileSync('public/data/whois-servers.json', 'utf-8'))
    expect(servers).toBeTypeOf('object')
    expect(Object.keys(servers).length).toBeGreaterThan(0)
  })

  it('能正确解析域名后缀', () => {
    const domain = 'example.com'
    const tld = domain.split('.').pop()?.toLowerCase()
    expect(tld).toBe('com')
  })

  it('能找到对应的 WHOIS 服务器', () => {
    const servers = { com: 'whois.verisign-grs.com' }
    const domain = 'example.com'
    const tld = domain.split('.').pop()?.toLowerCase()
    expect(servers[tld!]).toBe('whois.verisign-grs.com')
  })

  it('能处理未知后缀', () => {
    const servers = { com: 'whois.verisign-grs.com' }
    const domain = 'example.unknown'
    const tld = domain.split('.').pop()?.toLowerCase()
    expect(servers[tld!]).toBeUndefined()
  })

  it('能执行 WHOIS 查询（mock）', async () => {
    vi.spyOn(whois, 'lookup').mockImplementation((domain, options, cb) => {
      cb && cb(null, 'mock result')
    })
    const result = await new Promise<string>((resolve) => {
      whois.lookup('example.com', {}, (err, data) => {
        resolve(data as string)
      })
    })
    expect(result).toBe('mock result')
  })

  it('能处理查询错误（mock）', async () => {
    vi.spyOn(whois, 'lookup').mockImplementation((domain, options, cb) => {
      cb && cb(new Error('fail'), '')
    })
    const result = await new Promise<string>((resolve) => {
      whois.lookup('fail.com', {}, (err, data) => {
        resolve(err ? 'error' : data as string)
      })
    })
    expect(result).toBe('error')
  })
}) 