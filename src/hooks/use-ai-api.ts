import { Anthropic } from "@anthropic-ai/sdk"
import { useMemo } from "react"

export const useAiApi = ({
  streaming = false,
}: { streaming?: boolean } = {}) => {
  const anthropic = useMemo(
    () =>
      new Anthropic({
        // apiKey: "{REPLACE_ON_SERVER}",
        apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
        // baseURL: `${window.location.origin}/ai`,
        dangerouslyAllowBrowser: true,
      }),
    [],
  )

  return anthropic
}
