import { useCurrentSnippetId } from "./use-current-snippet-id"
import { useSnippet } from "./use-snippet"
import type { Snippet } from "fake-snippets-api/lib/db/schema"

export const useCurrentSnippet = (): {
  snippet: Snippet | null
  isLoading: boolean
  error: Error | null
} => {
  const snippetId = useCurrentSnippetId()
  const { data: snippet, isLoading, error } = useSnippet(snippetId || "")

  return {
    snippet: snippet || null,
    isLoading,
    error: error || null,
  }
}
