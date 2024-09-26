import { CodeAndPreview } from "@/components/CodeAndPreview"
import Header from "@/components/Header"
import { useCurrentSnippetId } from "@/hooks/use-current-snippet-id"
import { useSnippet } from "@/hooks/use-snippet"

export const EditorPage = () => {
  const snippetId = useCurrentSnippetId()
  const { data: snippet, isLoading } = useSnippet(snippetId)

  return (
    <div>
      <Header />
      <CodeAndPreview snippet={snippet} />
    </div>
  )
}
