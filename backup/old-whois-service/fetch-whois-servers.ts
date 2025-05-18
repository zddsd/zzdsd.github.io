import { writeFileSync, mkdirSync } from 'fs'
import { resolve } from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

async function fetchWhoisServers() {
  try {
    console.log('开始获取 WHOIS 服务器列表...')
    
    // 创建data目录
    const dataDir = resolve(process.cwd(), 'data')
    console.log(`创建数据目录: ${dataDir}`)
    mkdirSync(dataDir, { recursive: true })

    // 下载IANA的whois服务器列表
    console.log('正在从 IANA 获取顶级域名列表...')
    const { stdout } = await execAsync('curl -s https://www.iana.org/domains/root/db')
    console.log('成功获取顶级域名列表')
    console.log('页面内容长度:', stdout.length)
    
    // 解析HTML获取TLD和对应的whois服务器
    console.log('开始解析 WHOIS 服务器信息...')
    const servers: Record<string, string> = {}
    
    // 显示页面内容片段，用于调试
    console.log('\n页面内容片段:')
    console.log(stdout.slice(0, 500))
    
    const tldRegex = /<a href="\/domains\/root\/db\/([^.]+)\.html">/g
    const whoisRegex = /WHOIS Server:<\/b>\s*([a-zA-Z0-9.-]+)(?:\s*<br>)?/i

    let match
    let count = 0
    let successCount = 0
    let failCount = 0
    
    // 先收集所有TLD
    const tlds: string[] = []
    while ((match = tldRegex.exec(stdout)) !== null) {
      tlds.push(match[1].toLowerCase())
    }
    console.log(`\n找到 ${tlds.length} 个顶级域名`)
    
    // 处理每个TLD
    for (const tld of tlds) {
      count++
      console.log(`\n处理第 ${count}/${tlds.length} 个域名: ${tld}`)
      
      try {
        const url = `https://www.iana.org/domains/root/db/${tld}.html`
        console.log(`获取页面: ${url}`)
        const tldPage = await execAsync(`curl -s "${url}"`)
        const content = tldPage.stdout
        console.log(`页面内容长度: ${content.length}`)
        
        // 显示页面内容片段
        console.log('页面内容片段:')
        console.log(content.slice(0, 200))
        
        const whoisIndex = content.indexOf('WHOIS Server:')
        if (whoisIndex === -1) {
          console.log('未找到 WHOIS Server 关键字')
          failCount++
          continue
        }
        
        // 提取WHOIS服务器信息
        const whoisSection = content.slice(whoisIndex, whoisIndex + 200)
        console.log('WHOIS Server 相关内容:')
        console.log(whoisSection)
        
        // 清理 HTML 标签和多余空白
        const cleanSection = whoisSection.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
        console.log('清理后的内容:', cleanSection)
        
        const whoisMatch = whoisRegex.exec(whoisSection)
        if (whoisMatch) {
          const server = whoisMatch[1].trim()
          servers[tld] = server
          successCount++
          console.log(`找到 WHOIS 服务器: ${server}`)
        } else {
          console.log('正则匹配失败')
          failCount++
        }
      } catch (error: any) {
        console.log('获取失败:', error.message)
        failCount++
      }
      
      // 添加延迟避免请求过快
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    console.log('\n解析完成!')
    console.log(`共处理 ${count} 个域名`)
    console.log(`成功获取 ${successCount} 个域名的 WHOIS 服务器信息`)
    console.log(`失败 ${failCount} 个域名`)

    // 保存到文件
    const outputPath = resolve(dataDir, 'whois-servers.json')
    console.log(`\n正在保存 WHOIS 服务器列表到: ${outputPath}`)
    console.log('保存的数据:', JSON.stringify(servers, null, 2))
    writeFileSync(outputPath, JSON.stringify(servers, null, 2))

    if (Object.keys(servers).length > 0) {
      console.log('\n示例数据:')
      const examples = Object.entries(servers).slice(0, 5)
      examples.forEach(([tld, server]) => {
        console.log(`${tld}: ${server}`)
      })
    } else {
      console.log('\n警告: 未获取到任何 WHOIS 服务器信息')
    }
  } catch (error) {
    console.error('\n获取 WHOIS 服务器列表时发生错误:')
    console.error(error)
    process.exit(1)
  }
}

console.log('=== WHOIS 服务器列表获取工具 ===')
fetchWhoisServers() 