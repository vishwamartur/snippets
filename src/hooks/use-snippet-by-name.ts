import { useQuery } from "react-query"
import { useAxios } from "@/hooks/use-axios"
import type { Snippet } from "fake-snippets-api/lib/db/schema"

export const useSnippetByName = (fullSnippetName: string | null) => {
  const axios = useAxios()
  return useQuery<Snippet, Error & { status: number }>(
    ["snippet", fullSnippetName],
    async () => {
      if (!fullSnippetName) return
      const [owner_name, unscoped_name] = fullSnippetName.split("/")
      const { data } = await axios.get("/snippets/get", {
        params: {
          owner_name,
          unscoped_name,
        },
      })
      return data.snippet
    },
    {
      retry: false,
      enabled: Boolean(fullSnippetName),
    },
  )
}
