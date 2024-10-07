import { useEffect, useRef } from "react"
import { EditorView, basicSetup } from "codemirror"
import { javascript } from "@codemirror/lang-javascript"
import { EditorState } from "@codemirror/state"
import {
  tsFacet,
  tsSync,
  tsLinter,
  tsAutocomplete,
  tsHover,
} from "@valtown/codemirror-ts"
import { autocompletion } from "@codemirror/autocomplete"
import { linter } from "@codemirror/lint"
import {
  createSystem,
  createVirtualTypeScriptEnvironment,
} from "@typescript/vfs"
import ts from "typescript"
import { setupTypeAcquisition } from "@typescript/ata"
import { ATABootstrapConfig } from "@typescript/ata"
import { useAxios } from "@/hooks/use-axios"
import { useSnippetsBaseApiUrl } from "@/hooks/use-snippets-base-api-url"

export const CodeEditor = ({
  onCodeChange,
  onDtsChange,
  readOnly = false,
  code,
}: {
  onCodeChange: (code: string) => void
  onDtsChange?: (dts: string) => void
  code: string
  readOnly?: boolean
}) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const apiUrl = useSnippetsBaseApiUrl()

  useEffect(() => {
    if (!editorRef.current) return

    const fsMap = new Map<string, string>()
    fsMap.set("index.tsx", code)

    const system = createSystem(fsMap)
    const env = createVirtualTypeScriptEnvironment(system, [], ts, {
      jsx: ts.JsxEmit.ReactJSX,
      declaration: true,
    })

    const ataConfig: ATABootstrapConfig = {
      projectName: "my-project",
      typescript: ts,
      logger: console,
      fetcher: (input: RequestInfo | URL, init?: RequestInit) => {
        const registryPrefix =
          "https://data.jsdelivr.com/v1/package/resolve/npm/@tsci/"
        if (typeof input === "string" && input.startsWith(registryPrefix)) {
          const fullPackageName = input.split(registryPrefix)[1]
          // TODO: Implement redirection to our API registry for @tsci/* packages
          // For now, we'll just log the package name
          console.log(`Intercepted @tsci package: ${fullPackageName}`)
          return fetch(
            `${apiUrl}/snippets/download?path=${encodeURIComponent(fullPackageName)}`,
          )
        }
        // For all other cases, proceed with the original fetch
        return fetch(input, init)
      },
      delegate: {
        receivedFile: (code: string, path: string) => {
          fsMap.set(path, code)
          env.createFile(path, code)
        },
      },
    }

    const ata = setupTypeAcquisition(ataConfig)
    ata(`
import React from "@types/react"
import { Circuit } from "@tscircuit/core"
${code}
`)

    const state = EditorState.create({
      doc: code,
      extensions: [
        basicSetup,
        javascript({ typescript: true, jsx: true }),
        tsFacet.of({ env, path: "index.tsx" }),
        tsSync(),
        tsLinter(),
        autocompletion({ override: [tsAutocomplete()] }),
        tsHover(),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onCodeChange(update.state.doc.toString())

            const { outputFiles } = env.languageService.getEmitOutput(
              "index.tsx",
              true,
            )

            const indexDts = outputFiles.find(
              (file) => file.name === "index.d.ts",
            )
            if (indexDts?.text && onDtsChange) {
              onDtsChange(indexDts.text)
            }
          }
        }),
        EditorState.readOnly.of(readOnly),
      ],
    })

    const view = new EditorView({
      state,
      parent: editorRef.current,
    })

    viewRef.current = view

    return () => {
      view.destroy()
    }
  }, [code !== ""])

  return <div ref={editorRef} style={{ height: "640px", width: "100%" }} />
}
