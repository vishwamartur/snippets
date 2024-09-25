import { useMemo, useState } from "react"
import { CodeEditor } from "./components/CodeEditor"
import * as Babel from "@babel/standalone"

function App() {
  const [code, setCode] = useState("")

  const compiledCode = useMemo(() => {
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

  const evalResult = useMemo(() => {
    try {
      const exports = {}
      const module = { exports }
      eval(compiledCode)
      return module
    } catch (error: any) {
      console.error("Evaluation error:", error)
      return `Error: ${error.message}`
    }
  }, [compiledCode])

  return (
    <div className="flex">
      <div className="w-1/2 p-8">
        <CodeEditor onCodeChange={setCode} />
      </div>
      <div className="w-1/2 p-8">
        <textarea className="w-full h-64" value={compiledCode} />
        <hr />
        <textarea
          className="w-full h-64 bg-gray-100"
          value={JSON.stringify(
            Object.keys(evalResult?.exports ?? {}),
            null,
            "  ",
          )}
        />
      </div>
    </div>
  )
}

export default App
