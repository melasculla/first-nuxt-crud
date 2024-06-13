import { connection } from "./server/utils/useDB"

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    postgreSqlUrl: "",
    accessJwtSecret: "",
    refreshJwtSecret: "",
    redisPassword: ""
  },
  nitro: {
    imports: {
      dirs: [
        "./server/db",
        "./server/models"
      ]
    },
    storage: {
      redis: {
        driver: "redis",
        host: process.env.NUXT_REDIS_HOST,
        port: process.env.NUXT_REDIS_PORT,
        password: process.env.NUXT_REDIS_PASSWORD
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
    "/posts/**": {
      prerender: true,
      isr: true
    },
    "/user/**": {
      prerender: true,
      isr: true
    },
  },
  hooks: {
    "close": () => {
      connection.end()
    }
  }
})