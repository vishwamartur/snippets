import { useMemo, useState } from "react"
import { CodeEditor } from "./components/CodeEditor"
import * as Babel from "@babel/standalone"
import * as React from "react"
import { Circuit } from "@tscircuit/core"
import { PCBViewer } from "@tscircuit/pcb-viewer"
import { CadViewer } from "@tscircuit/3d-viewer"

const defaultCode = `
export default () => (
	<board width="10mm" height="10mm">
		<resistor resistance="1k" footprint="0402" name="R1" pcbX={3} />
		<capacitor capacitance="1000pF" footprint="0402" name="C1" pcbX={-3} />
		<trace from=".R1 > .pin1" to=".C1 > .pin1" />
	</board>
)
`.trim()

function App() {
  const [selectedTab, setSelectedTab] = useState<"pcb" | "cad">("pcb")
  const [code, setCode] = useState(defaultCode)

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

  const { compiledModule, message, circuitJson } = useMemo(() => {
    try {
      const exports: any = {}
      const module = { exports }
      eval(compiledCode)

      try {
        const circuit = new Circuit()

        const primaryKey = Object.keys(module.exports)[0]

        circuit.add(React.createElement(module.exports[primaryKey]))

        circuit.render()

        const circuitJson = circuit.getCircuitJson()

        return {
          compiledModule: module,
          message: `Primary key: ${primaryKey}`,
          circuitJson,
        }
      } catch (error: any) {
        console.error("Evaluation error:", error)
        return {
          compiledModule: module,
          message: `Error: ${error.message}`,
          circuitJson: null,
        }
      }

      return { compiledModule: module, message: "", circuitJson: null }
    } catch (error: any) {
      console.error("Evaluation error:", error)
      return {
        compiledModule: null,
        message: `Error: ${error.message}`,
        circuitJson: null,
      }
    }
  }, [compiledCode])

  return (
    <div className="flex">
      <div className="w-1/2 p-8">
        <CodeEditor defaultCode={defaultCode} onCodeChange={setCode} />
      </div>
      <div className="w-1/2 p-8">
        <div>
          <button className="" onClick={() => setSelectedTab("pcb")}>
            pcb
          </button>
          <button className="" onClick={() => setSelectedTab("cad")}>
            3d
          </button>
        </div>
        <div className="mt-4 h-[500px]">
          {selectedTab === "pcb" && <PCBViewer soup={circuitJson} />}
          {selectedTab === "cad" && <CadViewer soup={circuitJson as any} />}
        </div>
        <textarea className="w-full h-64" value={compiledCode} />
        <hr />
        <textarea className="w-full h-8 bg-red-100" value={message} />
      </div>
    </div>
  )
}

export default App
