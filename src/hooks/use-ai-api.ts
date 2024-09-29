import { Anthropic } from "@anthropic-ai/sdk"
import { useMemo } from "react"

export const useAiApi = () => {
  const anthropic = useMemo(
    () =>
      new Anthropic({
        apiKey: "{REPLACE_ON_SERVER}",
        baseURL: `${window.location.origin}/api/ai`,
        dangerouslyAllowBrowser: true,
      }),
    [],
  )

  return anthropic
}
