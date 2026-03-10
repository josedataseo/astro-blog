// @ts-check
import { defineConfig, envField } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://josedataseo.github.io",
  base: "/astro-blog",
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
      STRAPI_TOKEN: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
    },
  },
  image: {
    domains: ["localhost", "strapi-blog-mhpy.onrender.com"],
  },
});
