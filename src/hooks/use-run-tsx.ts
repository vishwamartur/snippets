import {useMemo} from "react"
import * as React from "react"
import {useCompiledTsx} from "./use-compiled-tsx"
import {Circuit} from "@tscircuit/core"

export const useRunTsx = (code?: string) => {
  const compiledCode = useCompiledTsx(code)

  return useMemo(() => {
    try {
      globalThis.React = React

      // eval(compiledCode)
      const functionBody = `var exports = {}; var module = { exports }; ${compiledCode}; return module;`
      const module = Function(functionBody).call(globalThis)

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

}