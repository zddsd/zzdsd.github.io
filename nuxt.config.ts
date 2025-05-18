// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss'
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
      apiBase: '/api',
      whoisServersPath: 'public/data/whois-servers.json'
    }
  },
  nitro: {
    devProxy: {
      '/api': {
        target: 'https://common-whois-pcaj4b4wb-zzdsds-projects.vercel.app/api',
        changeOrigin: true,
        prependPath: true
      }
    }
  },
  typescript: {
    strict: true
  }
}) 