import Editor from "react-simple-code-editor"
// @ts-ignore
import { highlight, languages } from "prismjs/components/prism-core"
import "prismjs/components/prism-clike"
import "prismjs/components/prism-javascript"
import "prismjs/themes/prism.css"
import { useState } from "react"

export const CodeEditor = ({
  onCodeChange,
}: { onCodeChange: (code: string) => void }) => {
  const [code, setCode] = useState(`function add(a, b) {\n  return a + b;\n}`)
  return (
    <Editor
      value={code}
      onValueChange={(code) => {
        setCode(code)
        onCodeChange(code)
      }}
      highlight={(code) => highlight(code, languages.js)}
      padding={10}
      style={{
        fontFamily: '"Fira code", "Fira Mono", monospace',
        fontSize: 12,
      }}
    />
  )
}
