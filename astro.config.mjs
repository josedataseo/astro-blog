// @ts-check
import { defineConfig, envField } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  env: {
    schema: {
      STRAPI_URL: envField.string({
        context: "server",
        access: "secret",
        default: "http://localhost:1337",
      }),
    },
  },
  image: {
    domains: ["localhost"],
  },
});
