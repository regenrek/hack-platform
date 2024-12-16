// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: "2024-04-03",
  devtools: { enabled: false },
  modules: ["@vueuse/nuxt", "@nuxtjs/supabase"],
  plugins: [
    { src: "node_modules/nuxtjs-phaser", mode: "client" },
    "~/plugins/mitt.js",
  ],
  supabase: {
    redirect: false,
  },
  nitro: {
    experimental: {
      websocket: true,
    },
  },
});
