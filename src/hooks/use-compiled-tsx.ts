import { useMemo } from "react"
import * as Babel from "@babel/standalone"

export const useCompiledTsx = (
  code?: string,
  { isStreaming = false }: { isStreaming?: boolean } = {},
) => {
  return useMemo(() => {
    if (!code) return ""
    if (isStreaming) return ""
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
  }, [code, isStreaming])
}
