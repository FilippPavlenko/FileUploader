import { defineConfig } from "vite";

export default defineConfig({
  root: "./src", // Указываем корневую папку для разработки
  publicDir: "../public", // Указываем папку для статических файлов
  build: {
    outDir: "../dist", // Папка для сборки
    emptyOutDir: true, // Очищать папку перед сборкой
  },
  server: {
    port: 3000, // Порт для разработки
    open: true, // Автоматически открывать браузер
  },
});
