//@ts-nocheck
import { fileURLToPath, URL } from "node:url";
import path from "path";
import { resolve } from "path";
import i18nResources from "vite-plugin-i18n-resources";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "vue-pro-calendar",
      fileName: (format) => `vue-pro-calendar.${format}.js`,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["vue"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: "Vue",
        },
      },
    },
  },
  plugins: [
    vue(),
    i18nResources({
      // eslint-disable-next-line no-undef
      path: resolve(__dirname, "src/locales"),
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
