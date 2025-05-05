// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  ssr: false,
  devServer: {
    port: 5000,
  },
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/icon'],
  tailwindcss: {
    exposeConfig: true,
    viewer: true,
  },
  runtimeConfig: {
    public: {
      // baseURL: 'http://localhost:2020',
      baseURL: process.env.API_BASE_URL,
      goURL: process.env.API_GO_URL
    },
  },
})