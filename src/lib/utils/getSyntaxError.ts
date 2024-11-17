import * as Babel from "@babel/standalone"

export function getSyntaxError(code: string): string | null {
  try {
    Babel.transform(code, {
      filename: "index.tsx",
      presets: ["react", "typescript"],
    })
    return null
  } catch (error: unknown) {
    return (error as Error).message
  }
}
