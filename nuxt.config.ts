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
    '/upload': {
      prerender: true,
    },
    '/posts': {
      prerender: true,
      isr: true,
    },
    '/posts/**': {
      prerender: true,
    },
    '/user/**': {
      prerender: true,
    },
    '/login': {
      prerender: true,
    },
    '/signup': {
      prerender: true,
    },
  },
  hooks: {
    'close': () => {
      connection.end()
    }
  }
})