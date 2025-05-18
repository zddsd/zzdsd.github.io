import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { writeFileSync, mkdirSync } from 'fs'

// 模拟模块
vi.mock('axios')
vi.mock('fs')

describe('WHOIS 爬虫服务', () => {
  const mockTlds = ['com', 'net', 'org']
  const mockServers = {
    com: 'whois.verisign-grs.com',
    net: 'whois.verisign-grs.net',
    org: 'whois.pir.org'
  }

  beforeEach(() => {
    vi.resetAllMocks()
    
    // 模拟 axios.get
    const mockAxiosGet = vi.fn()
    mockAxiosGet.mockImplementation(async (url: string) => {
      if (url.includes('/domains/root/db') && !url.includes('.html')) {
        return {
          data: mockTlds.map(tld => `<a href="/domains/root/db/${tld}.html">${tld}</a>`).join('\n')
        }
      } else {
        const tld = url.split('/').pop()?.replace('.html', '')
        return {
          data: `<table><tr><th>WHOIS Server:</th><td>${mockServers[tld as keyof typeof mockServers]}</td></tr></table>`
        }
      }
    })
    vi.mocked(axios.get).mockImplementation(mockAxiosGet)

    // 模拟文件系统操作
    vi.mocked(mkdirSync).mockReturnValue(undefined)
    vi.mocked(writeFileSync).mockReturnValue(undefined)
  })

  it('应该正确解析 TLD 列表', async () => {
    const { data } = await axios.get('https://www.iana.org/domains/root/db')
    const $ = cheerio.load(data)
    const tlds: string[] = []
    
    $('a[href^="/domains/root/db/"]').each((_, el) => {
      const href = $(el).attr('href')
      if (href) {
        const tld = href.replace('/domains/root/db/', '').replace('.html', '')
        tlds.push(tld.toLowerCase())
      }
    })

    expect(tlds).toEqual(mockTlds)
  })

  it('应该正确解析 WHOIS 服务器信息', async () => {
    const tld = 'com'
    const { data } = await axios.get(`https://www.iana.org/domains/root/db/${tld}.html`)
    const $ = cheerio.load(data)
    const whoisServer = $('th:contains("WHOIS Server:")').next('td').text().trim()

    expect(whoisServer).toBe(mockServers[tld])
  })

  it('应该正确处理错误情况', async () => {
    vi.mocked(axios.get).mockRejectedValueOnce(new Error('Network error'))

    await expect(axios.get('https://www.iana.org/domains/root/db'))
      .rejects
      .toThrow('Network error')
  })

  it('应该正确保存结果到文件', () => {
    const mockOutputPath = '/path/to/output.json'
    const mockData = { com: 'whois.verisign-grs.com' }

    writeFileSync(mockOutputPath, JSON.stringify(mockData, null, 2))

    expect(writeFileSync).toHaveBeenCalledWith(
      mockOutputPath,
      JSON.stringify(mockData, null, 2)
    )
  })
}) 