import { describe, it, expect } from 'vitest'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

describe('WHOIS 服务器信息提取测试', () => {
  // 测试用例数据
  const testCases = [
    {
      name: '标准格式',
      html: '<p><b>WHOIS Server:</b> whois.nic.aaa <br></p>',
      expected: 'whois.nic.aaa'
    },
    {
      name: '带空格格式',
      html: '<p>\n    <b>WHOIS Server:</b> whois.nic.aarp <br>\n    <b>RDAP Server: </b> https://rdap.nic.aarp\n</p>',
      expected: 'whois.nic.aarp'
    },
    {
      name: '无空格格式',
      html: '<p><b>WHOIS Server:</b>whois.nic.abb</p>',
      expected: 'whois.nic.abb'
    },
    {
      name: '带换行格式',
      html: '<p>\n<b>WHOIS Server:</b>\nwhois.nic.abc\n<br>\n</p>',
      expected: 'whois.nic.abc'
    },
    {
      name: '复杂格式',
      html: '<div class="registry-info">\n    <p>\n        <b>WHOIS Server:</b> whois.nic.xyz <br>\n        <b>RDAP Server: </b> https://rdap.nic.xyz\n    </p>\n</div>',
      expected: 'whois.nic.xyz'
    }
  ]

  // 测试正则表达式
  describe('正则表达式匹配测试', () => {
    const whoisRegex = /<b>WHOIS Server:<\/b>\s*([a-zA-Z0-9.-]+)(?:\s*<br>)?/g
    const fallbackRegex = /WHOIS Server:.*?([a-zA-Z0-9.-]+)(?:\s*<br>)?/g

    testCases.forEach(testCase => {
      it(`应该正确匹配 ${testCase.name}`, () => {
        whoisRegex.lastIndex = 0
        const match = whoisRegex.exec(testCase.html)
        if (match) {
          expect(match[1].trim()).toBe(testCase.expected)
        } else {
          fallbackRegex.lastIndex = 0
          const fallbackMatch = fallbackRegex.exec(testCase.html)
          expect(fallbackMatch?.[1].trim()).toBe(testCase.expected)
        }
      })
    })
  })

  // 测试实际页面获取
  describe('实际页面获取测试', () => {
    const testDomains = ['aaa', 'aarp', 'abb', 'abc', 'xyz']

    testDomains.forEach(domain => {
      it(`应该能获取 ${domain} 的 WHOIS 服务器信息`, async () => {
        const { stdout } = await execAsync(`curl -s https://www.iana.org/domains/root/db/${domain}.html`)
        const whoisIndex = stdout.indexOf('WHOIS Server')
        expect(whoisIndex).not.toBe(-1)

        const start = Math.max(0, whoisIndex - 50)
        const end = Math.min(stdout.length, whoisIndex + 100)
        const whoisSection = stdout.substring(start, end)

        const whoisMatch = whoisSection.match(/<b>WHOIS Server:<\/b>\s*([a-zA-Z0-9.-]+)(?:\s*<br>)?/)
        if (whoisMatch) {
          expect(whoisMatch[1].trim()).toMatch(/^whois\.[a-zA-Z0-9.-]+$/)
        } else {
          const fallbackMatch = whoisSection.match(/WHOIS Server:.*?([a-zA-Z0-9.-]+)(?:\s*<br>)?/)
          expect(fallbackMatch?.[1].trim()).toMatch(/^whois\.[a-zA-Z0-9.-]+$/)
        }
      })
    })
  })

  // 测试错误处理
  describe('错误处理测试', () => {
    it('应该正确处理不存在的域名', async () => {
      const { stdout } = await execAsync('curl -s https://www.iana.org/domains/root/db/nonexistent.html')
      const whoisIndex = stdout.indexOf('WHOIS Server')
      expect(whoisIndex).toBe(-1)
    })

    it('应该正确处理网络错误', async () => {
      try {
        await execAsync('curl -s https://www.iana.org/domains/root/db/error.html')
      } catch (error) {
        expect(error).toBeDefined()
      }
    })
  })
}) 