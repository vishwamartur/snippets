import { useMemo, useState } from "react"
import { CodeEditor } from "./components/CodeEditor"
import * as Babel from "@babel/standalone"
import * as React from "react"
import { Circuit } from "@tscircuit/core"
import { PCBViewer } from "@tscircuit/pcb-viewer"
import { CadViewer } from "@tscircuit/3d-viewer"
import { SoupTableViewer } from "@tscircuit/table-viewer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import "react-data-grid/lib/styles.css"

const defaultCode = `
export default () => (
  <board width="10mm" height="10mm">
    <resistor
      resistance="1k"
      cadModel={{
        objUrl:
          "https://modelcdn.tscircuit.com/easyeda_models/download?pn=C2889342",
      }}
      footprint="0402"
      name="R1"
      pcbX={3}
    />
    <capacitor
      capacitance="1000pF"
      cadModel={{
        objUrl:
          "https://modelcdn.tscircuit.com/easyeda_models/download?pn=C2889342",
      }}
      footprint="0402"
      name="C1"
      pcbX={-3}
    />
    <trace from=".R1 > .pin1" to=".C1 > .pin1" />
  </board>
)
`.trim()

function App() {
  const [selectedTab, setSelectedTab] = useState<"pcb" | "cad" | "table">("pcb")
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
        <Tabs
          defaultValue="pcb"
          onValueChange={(value) => setSelectedTab(value as "pcb" | "cad")}
        >
          <TabsList>
            <TabsTrigger value="pcb">PCB</TabsTrigger>
            <TabsTrigger value="cad">3D</TabsTrigger>
            <TabsTrigger value="table">Table</TabsTrigger>
          </TabsList>
          <TabsContent value="pcb">
            <div className="mt-4 h-[500px]">
              <PCBViewer soup={circuitJson} />
            </div>
          </TabsContent>
          <TabsContent value="cad">
            <div className="mt-4 h-[500px]">
              <CadViewer soup={circuitJson as any} />
            </div>
          </TabsContent>
          <TabsContent value="table">
            <div className="mt-4 h-[500px]">
              <SoupTableViewer elements={circuitJson as any} />
            </div>
          </TabsContent>
        </Tabs>
        <textarea className="w-full h-64" value={compiledCode} />
        <hr />
        <textarea className="w-full h-8 bg-red-100" value={message} />
      </div>
    </div>
  )
}

export default App
