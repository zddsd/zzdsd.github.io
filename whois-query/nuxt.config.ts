import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/devtools'
  ],
  app: {
    head: {
      title: 'WHOIS 域名查询',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api',
      whoisServersPath: 'public/data/whois-servers.json'
    }
  },
  build: {
    transpile: ['vue']
  },
  nitro: {
    // 移除 preset 和 prerender 配置
  },
  typescript: {
    strict: true
  }
}) 