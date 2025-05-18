import axios from 'axios';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { WhoisServer, CrawlerConfig } from './types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config: CrawlerConfig = {
  baseUrl: 'https://www.iana.org/domains/root/db',
  outputPath: resolve(__dirname, '../data/whois-servers.json'),
  batchSize: 2, // 测试时设置为 2
  retryCount: 3,
  retryDelay: 2000,
  requestTimeout: 10000,
  testMode: false // 添加测试模式
};

async function fetchWhoisServers() {
  try {
    console.log('开始获取 WHOIS 服务器列表...');
    
    // 创建数据目录
    const dataDir = dirname(config.outputPath);
    console.log(`创建数据目录: ${dataDir}`);
    mkdirSync(dataDir, { recursive: true });

    // 获取顶级域名列表
    console.log('正在从 IANA 获取顶级域名列表...');
    const { data: rootPage } = await axios.get<string>(config.baseUrl, {
      timeout: config.requestTimeout,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    console.log('成功获取顶级域名列表');
    console.log('页面内容长度:', rootPage.length);
    
    // 显示页面内容片段
    console.log('\n页面内容片段:');
    console.log(rootPage.slice(0, 500));

    // 解析顶级域名列表
    const tldRegex = /<a href="\/domains\/root\/db\/([^.]+)\.html">/g;
    const whoisRegex = /WHOIS Server:<\/b>\s*([a-zA-Z0-9.-]+)(?:\s*<br>)?/i;
    
    const tlds: string[] = [];
    let match;
    while ((match = tldRegex.exec(rootPage)) !== null) {
      tlds.push(match[1].toLowerCase());
    }

    // 测试模式下只处理前两个域名
    const testTlds = config.testMode ? tlds.slice(0, 2) : tlds;
    console.log(`\n找到 ${tlds.length} 个顶级域名，测试模式下处理 ${testTlds.length} 个`);

    // 批量处理域名
    const servers: Record<string, string> = {};
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < testTlds.length; i += config.batchSize) {
      const batch = testTlds.slice(i, i + config.batchSize);
      console.log(`\n处理第 ${i + 1} 到 ${Math.min(i + config.batchSize, testTlds.length)} 个域名`);

      await Promise.all(batch.map(async (tld) => {
        let retries = 0;
        while (retries < config.retryCount) {
          try {
            const url = `${config.baseUrl}/${tld}.html`;
            console.log(`\n获取 ${tld} 的 WHOIS 服务器信息...`);
            console.log(`获取页面: ${url}`);
            
            const { data: tldPage } = await axios.get<string>(url, {
              timeout: config.requestTimeout,
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
              }
            });

            console.log(`页面内容长度: ${tldPage.length}`);
            
            // 显示页面内容片段
            console.log('页面内容片段:');
            console.log(tldPage.slice(0, 200));

            const whoisIndex = tldPage.indexOf('WHOIS Server:');
            if (whoisIndex === -1) {
              console.log('未找到 WHOIS Server 关键字');
              failCount++;
              break;
            }

            // 提取 WHOIS 服务器信息
            const whoisSection = tldPage.slice(whoisIndex, whoisIndex + 200);
            console.log('WHOIS Server 相关内容:');
            console.log(whoisSection);

            // 清理 HTML 标签和多余空白
            const cleanSection = whoisSection.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
            console.log('清理后的内容:', cleanSection);

            const whoisMatch = whoisRegex.exec(whoisSection);
            if (whoisMatch) {
              const server = whoisMatch[1].trim();
              servers[tld] = server;
              successCount++;
              console.log(`找到 WHOIS 服务器: ${server}`);
            } else {
              console.log('正则匹配失败');
              failCount++;
            }
            break;
          } catch (error) {
            retries++;
            if (retries === config.retryCount) {
              console.error(`获取 ${tld} 的 WHOIS 服务器信息失败:`, error);
              failCount++;
            } else {
              console.log(`重试获取 ${tld} 的 WHOIS 服务器信息 (${retries}/${config.retryCount})`);
              await new Promise(resolve => setTimeout(resolve, config.retryDelay));
            }
          }
        }
      }));

      // 每批处理完后等待一段时间
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // 保存结果
    const outputPath = resolve(dataDir, 'whois-servers.json');
    console.log(`\n正在保存 WHOIS 服务器列表到: ${outputPath}`);
    console.log('保存的数据:', JSON.stringify(servers, null, 2));
    writeFileSync(outputPath, JSON.stringify(servers, null, 2));

    console.log('\n爬取完成!');
    console.log(`成功获取 ${successCount} 个域名的 WHOIS 服务器信息`);
    console.log(`失败 ${failCount} 个域名`);
    console.log(`数据已保存到: ${outputPath}`);

    // 显示结果
    if (Object.keys(servers).length > 0) {
      console.log('\n示例数据:');
      const examples = Object.entries(servers).slice(0, 5);
      examples.forEach(([tld, server]) => {
        console.log(`${tld}: ${server}`);
      });
    } else {
      console.log('\n警告: 未获取到任何 WHOIS 服务器信息');
    }

  } catch (error) {
    console.error('爬取过程中发生错误:', error);
    process.exit(1);
  }
}

// 运行爬虫
console.log('=== WHOIS 服务器爬虫 ===');
fetchWhoisServers(); 