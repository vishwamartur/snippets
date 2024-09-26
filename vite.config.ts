import { defineConfig } from "vite"
import path from "path"
import react from "@vitejs/plugin-react"
import { getNodeHandler } from "winterspec/adapters/node"

// @ts-ignore
import winterspecBundle from "./dist/bundle.js"
const fakeHandler = getNodeHandler(winterspecBundle as any, {})

export default defineConfig({
  plugins: [react()],
  define: {
    global: {},
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:9999",
        changeOrigin: true,
        configure: (proxy, _options) => {
          proxy.on("proxyReq", (proxyReq, req, res) => {
            return fakeHandler(req, res)
          })
        },
      },
    },
  },
  build: {
    minify: false,
    terserOptions: {
      compress: false,
      mangle: false,
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  logLevel: "info",
})
