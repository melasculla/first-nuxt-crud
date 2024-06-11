import { connection } from "./server/utils/useDB"

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    postgreSqlUrl: '',
  },
  nitro: {
    imports: {
      dirs: [
        './server/db',
        './server/models'
      ]
    },
    storage: {
      test: {
        driver: 'fs',
        base: '.test'
      }
    }
  },
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss"],
  app: {
    pageTransition: {
      name: "page",
      mode: "in-out",
    },
    head: {
      title: "Patrik Website",
      meta: [
        { name: "description", content: "My first crud on nuxt" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { charset: "utf-8" },
      ],
      // link: [{ rel: "icon", type: "image/webp", href: "/favicon.webp" }],
    }
  },
  experimental: {
    writeEarlyHints: false,
  },
  ssr: true,
  routeRules: {
    '/': {
      cache: { maxAge: 60 }
    },
    '/posts': {
      // cache: { maxAge: 30 }
    },
    '/posts/**': {
      prerender: true,
      isr: true
    },
    '/user/**': {
      prerender: true,
    },
  },
  hooks: {
    'close': () => {
      connection.end()
    }
  }
})