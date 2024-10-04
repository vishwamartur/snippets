import axios from "redaxios"
import { useMemo } from "react"
import { useSnippetsBaseApiUrl } from "./use-snippets-base-api-url"

export const useAxios = () => {
  const snippetsBaseApiUrl = useSnippetsBaseApiUrl()
  return useMemo(() => {
    const instance = axios.create({
      baseURL: snippetsBaseApiUrl,
      headers: {
        Authorization: "Bearer 1234",
      },
    })
    return instance
  }, [])
}
