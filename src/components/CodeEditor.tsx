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

export const CodeEditor = ({
  onCodeChange,
  readOnly = false,
  code,
}: {
  onCodeChange: (code: string) => void
  code: string
  readOnly?: boolean
}) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)

  useEffect(() => {
    if (!editorRef.current) return

    const fsMap = new Map<string, string>()
    fsMap.set("index.tsx", code)

    //     fsMap.set(
    //       "tscircuit-core.d.ts",
    //       `

    // declare global {
    //   namespace JSX {
    //     interface IntrinsicElements {
    //       board: any
    //     }
    //   }
    // }

    // `.trim(),
    //     )

    const system = createSystem(fsMap)
    const env = createVirtualTypeScriptEnvironment(system, [], ts, {
      jsx: ts.JsxEmit.ReactJSX,
      // jsxFactory: "React.createElement",
    })

    // const program = ts.createProgram({
    //   rootNames: ["index.tsx"],
    //   options: {
    //     jsx: ts.JsxEmit.ReactJSX,
    //   },
    // })

    // program.emit()

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
