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
    },
    experimental: {
      tasks: true
    },
    scheduledTasks: {
      // https://crontab.guru
      '*/20 * * * *': ['posts:update']
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
      isr: true
    },
    "/user/**": {
      isr: true
    },
  },
  hooks: {
    "build:before": () => {
      connection.end()
      console.info('before build')
    },
    "close": () => {
      // connection.end()
    }
  }
})