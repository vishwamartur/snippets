import { CodeAndPreview } from "@/components/CodeAndPreview"
import Header from "@/components/Header"
import { useEffect } from "react"
import { useCurrentSnippetId } from "@/hooks/use-current-snippet-id"
import { useSnippet } from "./hooks/use-snippet"
import { ContextProviders } from "./ContextProviders"
import { EditorPage } from "./pages/editor"

function App() {
  return (
    <ContextProviders>
      <EditorPage />
    </ContextProviders>
  )
}

export default App
