// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      test: ''
    },
    postgreSqlUrl: "",
    accessJwtSecret: "",
    refreshJwtSecret: "",
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
        driver: 'redis',
        user: '',
        host: process.env.NUXT_REDIS_HOST ?? 'redis.my',
        port: process.env.NUXT_REDIS_PORT ?? 6379,
        password: process.env.NUXT_REDIS_PASSWORD ?? 'test'
      },
      images: {
        driver: 'fs',
        base: './images'
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
  modules: ["@nuxtjs/tailwindcss", "@nuxt/image"],
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
  }
})