import { useQuery } from "react-query"
import axios from "redaxios"
import type { Snippet } from "fake-snippets-api/lib/db/schema"

export const useSnippetByName = (fullSnippetName: string | null) => {
  return useQuery<Snippet, Error>(
    ["snippet", fullSnippetName],
    async () => {
      if (!fullSnippetName) return
      const { data } = await axios.get("/api/snippets/get", {
        params: { full_snippet_name: fullSnippetName },
      })
      return data.snippet
    },
    {
      enabled: Boolean(fullSnippetName),
    },
  )
}
