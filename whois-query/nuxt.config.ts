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
    },
    baseURL: process.env.NODE_ENV === 'production' ? '/whois-query/' : '/'
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NODE_ENV === 'production' ? '/whois-query/api' : '/api',
      whoisServersPath: 'public/data/whois-servers.json'
    }
  },
  build: {
    transpile: ['vue']
  },
  nitro: {
    preset: 'static',
    prerender: {
      routes: ['/'],
      ignore: ['/api/**']
    }
  },
  typescript: {
    strict: true
  }
}) 