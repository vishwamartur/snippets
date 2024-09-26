import { defineConfig, Plugin } from "vite"
import path from "path"
import react from "@vitejs/plugin-react"
import { getNodeHandler } from "winterspec/adapters/node"

// @ts-ignore
import winterspecBundle from "./dist/bundle.js"

const fakeHandler = getNodeHandler(winterspecBundle as any, {})

function apiFakePlugin(): Plugin {
  return {
    name: "api-fake",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.startsWith("/api/")) {
          fakeHandler(req, res)
        } else {
          next()
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), apiFakePlugin()],
  define: {
    global: {},
  },
  // server: {
  //   proxy: {
  //     "/api": {
  //       target: "http://localhost:9999",
  //       changeOrigin: true,
  //       configure: (proxy, _options) => {
  //         proxy.on("proxyReq", (proxyReq, req, res) => {
  //           return fakeHandler(req, res)
  //         })
  //       },
  //     },
  //   },
  // },
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
