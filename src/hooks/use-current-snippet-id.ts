import { useEffect, useMemo, useState } from "react"
import { useUrlParams } from "./use-url-params"
import axios from "redaxios"
import { defaultCodeForBlankPage } from "@/lib/defaultCodeForBlankCode"

export const useCurrentSnippetId = (): string | null => {
  const urlSnippetId = useUrlParams().snippet_id
  const [snippetId, setSnippetId] = useState<string | null>(
    urlSnippetId ?? null,
  )

  useEffect(() => {
    if (snippetId) return
    async function createSnippet() {
      const {
        data: { snippet },
      } = await axios.post("/api/snippets/create", {
        content: defaultCodeForBlankPage,
        owner_name: "seveibar",
      })

      const url = new URL(window.location.href)
      url.searchParams.set("snippet_id", snippet.snippet_id)
      window.history.pushState({}, "", url.toString())

      setSnippetId(snippet.snippet_id)
    }
    createSnippet()
  }, [snippetId])

  return snippetId
}
