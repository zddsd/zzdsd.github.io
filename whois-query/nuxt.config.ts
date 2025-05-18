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
      apiBase: process.env.NODE_ENV === 'production' ? '/api' : '/api',
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