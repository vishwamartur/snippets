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
import { defaultCodeForBlankPage } from "./defaultCodeForBlankCode"
import { decodeUrlHashToText } from "./decodeUrlHashToText"
import { encodeTextToUrlHash } from "./encodeTextToUrlHash"
import { Button } from "./components/ui/button"

function App() {
  const defaultCode =
    decodeUrlHashToText(window.location.toString()) ?? defaultCodeForBlankPage
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

  const { message, circuitJson } = useMemo(() => {
    try {
      const exports: any = {}
      const module = { exports }
      eval(compiledCode)

      try {
        const circuit = new Circuit()

        if (Object.keys(module.exports).length > 1) {
          throw new Error(
            `Too many exports, only export one thing. You exported: ${JSON.stringify(Object.keys(module.exports))}`,
          )
        }

        const primaryKey = Object.keys(module.exports)[0]

        circuit.add(React.createElement(module.exports[primaryKey]))

        circuit.render()

        const circuitJson = circuit.getCircuitJson()

        return {
          compiledModule: module,
          message: "",
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
        <Button
          className="mt-4 px-4 py-2"
          onClick={() => {
            const url = encodeTextToUrlHash(code)
            navigator.clipboard.writeText(url)
            alert("URL copied to clipboard!")
          }}
        >
          Create URL for Code Snippet
        </Button>
      </div>
      <div className="w-1/2 p-8">
        <Tabs defaultValue="pcb">
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
