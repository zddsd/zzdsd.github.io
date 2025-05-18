import { copyFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const src = resolve(__dirname, '../../whois-crawler/data/whois-servers.json')
const target = resolve(__dirname, '../public/data/whois-servers.json')

console.log('开始复制 WHOIS 服务器配置文件...')
console.log('源文件:', src)
console.log('目标文件:', target)

if (!existsSync(src)) {
  console.error('源文件不存在:', src)
  process.exit(1)
}

try {
  copyFileSync(src, target)
  console.log('配置文件复制成功！')
} catch (e) {
  console.error('复制失败:', e)
  process.exit(1)
} 