import { useMemo } from "react"
import * as Babel from "@babel/standalone"

export const useCompiledTsx = (code?: string) => {
  return useMemo(() => {
    if (!code) return ""
    try {
      const result = Babel.transform(code, {
        presets: ["react", "typescript"],
        plugins: ["transform-modules-commonjs"],
        filename: "virtual.tsx",
      })
      return result.code || ""
    } catch (error: any) {
      console.error("Babel compilation error:", error)
      return `Error: ${error.message}`
    }
  }, [code])
}