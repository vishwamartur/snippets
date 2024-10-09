import { useEffect, useMemo, useState } from "react"
import * as React from "react"
import { useCompiledTsx } from "./use-compiled-tsx"
import { Circuit } from "@tscircuit/core"
import { createJSCADRenderer } from "jscad-fiber"
import { jscadPlanner } from "jscad-planner"
import { getImportsFromCode } from "@tscircuit/prompt-benchmarks/code-runner-utils"

type RunTsxResult = {
  compiledModule: any
  message: string
  circuitJson: any
  isLoading: boolean
}

const constructCircuit = (
  UserElm: any,
  type: "board" | "footprint" | "package" | "model",
) => {
  const circuit = new Circuit()

  if (type === "board") {
    circuit.add(<UserElm />)
  } else if (type === "package") {
    circuit.add(
      <board width="10mm" height="10mm">
        <UserElm name="U1" />
      </board>,
    )
  } else if (type === "footprint") {
    circuit.add(
      <board width="10mm" height="10mm">
        <chip name="U1" footprint={<UserElm />} />
      </board>,
    )
  } else if (type === "model") {
    const jscadGeoms: any[] = []
    const { createJSCADRoot } = createJSCADRenderer(jscadPlanner as any)
    const jscadRoot = createJSCADRoot(jscadGeoms)
    jscadRoot.render(<UserElm />)
    circuit.add(
      <board width="10mm" height="10mm">
        <chip
          name="U1"
          cadModel={{
            jscad: jscadGeoms[0],
          }}
        />
      </board>,
    )
  }
  return circuit
}

const evalCompiledJs = (compiledCode: string) => {
  const functionBody = `
var exports = {};
var require = globalThis.__tscircuit_require;
var module = { exports };
${compiledCode};
return module;`.trim()
  return Function(functionBody).call(globalThis)
}

export const useRunTsx = (
  code?: string,
  type?: "board" | "footprint" | "package" | "model",
  { isStreaming = false }: { isStreaming?: boolean } = {},
): RunTsxResult => {
  type ??= "board"
  const compiledCode = useCompiledTsx(code, { isStreaming })
  const [tsxResult, setTsxResult] = useState<RunTsxResult>({
    compiledModule: null,
    message: "",
    circuitJson: null,
    isLoading: false,
  })

  useEffect(() => {
    async function run() {
      if (isStreaming || !compiledCode || !code) {
        setTsxResult({
          compiledModule: null,
          message: "",
          circuitJson: null,
          isLoading: false,
        })
        return
      }

      const imports = getImportsFromCode(code!).filter((imp) =>
        imp.startsWith("@tsci/"),
      )

      const preSuppliedImports: Record<string, any> = {}

      for (const importName of imports) {
        // Fetch compiled code from the server
        // await fetch("https://registry-api.tscircuit.com/
        // preSuppliedImports[importName] =
      }

      const __tscircuit_require = (name: string) => {
        if (!preSuppliedImports[name]) {
          throw new Error(`Import "${name}" not found`)
        }
        return preSuppliedImports[name]
      }
      ;(globalThis as any).__tscircuit_require = __tscircuit_require
      // Add these imports to the require fn

      try {
        globalThis.React = React

        const module = evalCompiledJs(compiledCode)

        if (Object.keys(module.exports).length > 1) {
          throw new Error(
            `Too many exports, only export one thing. You exported: ${JSON.stringify(Object.keys(module.exports))}`,
          )
        }

        const primaryKey = Object.keys(module.exports)[0]

        const UserElm = (props: any) =>
          React.createElement(module.exports[primaryKey], props)

        try {
          const circuit = constructCircuit(UserElm, type as any)
          circuit.render()
          const circuitJson = circuit.getCircuitJson()

          setTsxResult({
            compiledModule: module,
            message: "",
            circuitJson,
            isLoading: false,
          })
        } catch (error: any) {
          console.error("Evaluation error:", error)
          setTsxResult({
            compiledModule: module,
            message: `Render Error: ${error.message}`,
            circuitJson: null,
            isLoading: false,
          })
        }
      } catch (error: any) {
        console.error("Evaluation error:", error)
        setTsxResult({
          compiledModule: null,
          message: `Eval Error: ${error.message}\n\n${error.stack}`,
          circuitJson: null,
          isLoading: false,
        })
      }
    }
    run()
  }, [compiledCode, isStreaming])

  return tsxResult
}
