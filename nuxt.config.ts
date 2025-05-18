import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/devtools'
  ],
  app: {
    baseURL: '/',
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
      apiBase: process.env.NODE_ENV === 'production' 
        ? 'https://common-whois-pcaj4b4wb-zzdsds-projects.vercel.app/api'  // 替换为实际的 whois-api 域名
        : 'http://localhost:3000/api',
      whoisServersPath: 'public/data/whois-servers.json'
    }
  },
  build: {
    transpile: ['vue']
  },
  nitro: {
    routeRules: {
      '/**': { isr: false }
    }
  },
  typescript: {
    strict: true
  }
}) 