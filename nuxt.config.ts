// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: "2024-04-03",
  devtools: { enabled: false },
  modules: ["@vueuse/nuxt"],
  plugins: [
    { src: "node_modules/nuxtjs-phaser", mode: "client" },
    "~/plugins/mitt.js",
  ],
  // plugins: ["~/plugins/mitt.js"],
  runtimeConfig: {
    public: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_KEY: process.env.SUPABASE_KEY,
    },
  },
  nitro: {
    experimental: {
      websocket: true,
    },
  },
});
