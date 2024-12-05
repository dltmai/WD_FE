import glsl from "vite-plugin-glsl";
import { defineConfig } from "vite";

export default defineConfig({
  root: ".", // Đảm bảo root là thư mục gốc
  publicDir: "public",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: "index.html", // Đảm bảo đường dẫn đúng
    },
  },
  plugins: [glsl()],
  base: "./",
});
