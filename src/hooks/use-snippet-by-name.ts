import { useQuery } from "react-query"
import axios from "redaxios"
import type { Snippet } from "fake-snippets-api/lib/db/schema"

export const useSnippetByName = (snippetName: string) => {
  return useQuery<Snippet, Error>(
    ["snippet", snippetName],
    async () => {
      const { data } = await axios.get("/api/snippets/get", {
        params: { snippet_name: snippetName },
      })
      return data
    },
    {
      enabled: Boolean(snippetName),
    },
  )
}
