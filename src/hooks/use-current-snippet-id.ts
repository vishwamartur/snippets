import { useEffect, useRef, useState } from "react"
import { useUrlParams } from "./use-url-params"
import axios from "redaxios"
import { defaultCodeForBlankPage } from "@/lib/defaultCodeForBlankCode"
import { useLocation, useParams } from "wouter"
import { useMutation } from "react-query"
import { useSnippetByName } from "./use-snippet-by-name"

export const useCurrentSnippetId = (): string | null => {
  const urlSnippetId = useUrlParams().snippet_id
  const urlParams = useParams()
  const [location] = useLocation()
  const [snippetIdFromUrl, setSnippetId] = useState<string | null>(urlSnippetId)

  const { data: snippetByName } = useSnippetByName(
    urlParams.author && urlParams.snippetName
      ? `${urlParams.author}/${urlParams.snippetName}`
      : null,
  )

  const createSnippetMutation = useMutation({
    mutationKey: ["createSnippet"],
    mutationFn: async () => {
      console.log("creating snippet")
      const {
        data: { snippet },
      } = await axios.post("/api/snippets/create", {
        content: defaultCodeForBlankPage,
        owner_name: "seveibar",
      })
      return snippet
    },
    onSuccess: (snippet: any) => {
      const url = new URL(window.location.href)
      url.searchParams.set("snippet_id", snippet.snippet_id)
      window.history.pushState({}, "", url.toString())
      setSnippetId(snippet.snippet_id)
    },
    onError: (error: any) => {
      console.error("Error creating snippet:", error)
    },
  })

  useEffect(() => {
    if (snippetIdFromUrl) return
    if (location !== "/editor") return
    if (urlParams?.author && urlParams?.snippetName) return
    if ((window as any).AUTO_CREATED_SNIPPET) return
    ;(window as any).AUTO_CREATED_SNIPPET = true
    createSnippetMutation.mutate()
    return () => {
      setTimeout(() => {
        ;(window as any).AUTO_CREATED_SNIPPET = false
      }, 1000)
    }
  }, [])

  return snippetIdFromUrl ?? snippetByName?.snippet_id ?? null
}
