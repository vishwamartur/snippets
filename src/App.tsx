import { useMemo, useState } from "react"
import { CodeEditor } from "./components/CodeEditor"
import * as Babel from "@babel/standalone"
import * as React from "react"
import { Circuit } from "@tscircuit/core"

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

  const { compiledModule, message } = useMemo(() => {
    try {
      const exports = {}
      const module = { exports }
      eval(compiledCode)

      try {
        const circuit = new Circuit()

        const primaryKey = Object.keys(module.exports)[0]

        // circuit.add(module.exports[primaryKey])

        return { compiledModule: module, message: `Primary key: ${primaryKey}` }
      } catch (error: any) {
        console.error("Evaluation error:", error)
        return { compiledModule: module, message: `Error: ${error.message}` }
      }

      return { compiledModule: module, message: "" }
    } catch (error: any) {
      console.error("Evaluation error:", error)
      return { compiledModule: null, message: `Error: ${error.message}` }
    }
  }, [compiledCode])

  return (
    <div className="flex">
      <div className="w-1/2 p-8">
        <CodeEditor
          defaultCode={`
					
export default MyCircuit = () => (
	<board width="10mm" height="10mm">
		<resistor resistance="1k" footprint="0402" name="R1" />
	</board>
)
					
					`.trim()}
          onCodeChange={setCode}
        />
      </div>
      <div className="w-1/2 p-8">
        <textarea className="w-full h-64" value={compiledCode} />
        <hr />
        <textarea className="w-full h-8 bg-red-100" value={message} />
        <textarea
          className="w-full h-64 bg-gray-100"
          value={JSON.stringify(
            Object.keys(compiledModule?.exports ?? {}),
            null,
            "  ",
          )}
        />
      </div>
    </div>
  )
}

export default App
