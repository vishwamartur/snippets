import { useAxios } from "./use-axios"
import { useMutation } from "react-query"
import { Snippet } from "fake-snippets-api/lib/db/schema"
import { safeCompileTsx } from "./use-compiled-tsx"

export const useSaveSnippet = () => {
  const axios = useAxios()

  const saveSnippetMutation = useMutation<
    Snippet,
    Error,
    { code: string; snippet_type: string }
  >({
    mutationFn: async ({ code, snippet_type }) => {
      const compileResult = safeCompileTsx(code)

      // Generate DTS using the technique in CodeEditor.tsx
      const dts = "" // Placeholder for now

      const response = await axios.post("/snippets/create", {
        code,
        snippet_type,
        owner_name: "seveibar", // Replace with actual user name or fetch from user context
        compiled_js: compileResult.success
          ? compileResult.compiledTsx
          : undefined,
        dts,
      })
      return response.data.snippet
    },
  })

  const saveSnippet = async (code: string, snippet_type: string) => {
    return saveSnippetMutation.mutateAsync({ code, snippet_type })
  }

  return {
    saveSnippet,
    isLoading: saveSnippetMutation.isLoading,
    error: saveSnippetMutation.error,
  }
}
