import { useQuery } from "react-query"
import axios from "redaxios"
import type { Snippet } from "fake-snippets-api/lib/db/schema"

export const useSnippet = (snippetId: string) => {
  return useQuery<Snippet, Error>(
    ["snippet", snippetId],
    async () => {
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
