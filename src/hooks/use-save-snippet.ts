import { Snippet } from "fake-snippets-api/lib/db/schema"
import { useMutation } from "react-query"
import { useAxios } from "./use-axios"
import { safeCompileTsx } from "./use-compiled-tsx"
import { useCurrentSnippetId } from "./use-current-snippet-id"

export const useSaveSnippet = () => {
  const axios = useAxios()

  const { snippetId } = useCurrentSnippetId()

  const saveSnippetMutation = useMutation<
    Snippet,
    Error,
    { code: string; snippet_type: string; dts?: string; circuit_json?: any[] }
  >({
    mutationFn: async ({ code, snippet_type, dts, circuit_json }) => {
      const compileResult = safeCompileTsx(code)

      if (snippetId) {
        const response = await axios.post("/snippets/update", {
          snippet_id: snippetId,
          code,
          snippet_type,
          compiled_js: compileResult.success
            ? compileResult.compiledTsx
            : undefined,
          circuit_json: circuit_json,
          dts,
        })
        return response.data.snippet
      } else {
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
      }
    },
  })

  const saveSnippet = async (
    code: string,
    snippet_type: string,
    dts?: string,
    circuit_json?: any[],
  ) => {
    return saveSnippetMutation.mutateAsync({
      code,
      snippet_type,
      dts,
      circuit_json,
    })
  }

  return {
    saveSnippet,
    isLoading: saveSnippetMutation.isLoading,
    error: saveSnippetMutation.error,
  }
}
