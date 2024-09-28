import { useQuery } from "react-query"
import axios from "redaxios"
import type { Snippet } from "fake-snippets-api/lib/db/schema"

export const useSnippet = (snippetId: string | null) => {
  return useQuery<Snippet, Error>(
    ["snippets", snippetId],
    async () => {
      if (!snippetId) {
        throw new Error("Snippet ID is required")
      }
      const { data } = await axios.get("/api/snippets/get", {
        params: { snippet_id: snippetId },
      })
      return data.snippet
    },
    {
      enabled: Boolean(snippetId),
    },
  )
}
