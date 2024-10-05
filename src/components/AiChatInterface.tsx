import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import ChatInput from "./ChatInput"
import { useAiApi } from "@/hooks/use-ai-api"
import { createCircuitBoard1Template } from "@tscircuit/prompt-benchmarks"
import { TextDelta } from "@anthropic-ai/sdk/resources/messages.mjs"
import { MagicWandIcon } from "@radix-ui/react-icons"
import { AiChatMessage } from "./AiChatMessage"
import { useLocation } from "wouter"

export default function AIChatInterface({
  code,
  onCodeChange,
  onStartStreaming,
  onStopStreaming,
  errorMessage,
}: {
  code: string
  onCodeChange: (code: string) => void
  onStartStreaming: () => void
  onStopStreaming: () => void
  errorMessage: string | null
}) {
  const [messages, setMessages] = useState<AiChatMessage[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const anthropic = useAiApi()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [currentCodeBlock, setCurrentCodeBlock] = useState<string | null>(null)
  const [location] = useLocation()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const addMessage = async (message: string) => {
    const newMessages = messages.concat([
      {
        sender: "user",
        content: message,
      },
      {
        sender: "bot",
        content: "",
        codeVersion: messages.filter((m) => m.sender === "bot").length,
      },
    ])
    setMessages(newMessages)
    setIsStreaming(true)
    onStartStreaming()

    try {
      const stream = await anthropic.messages.stream({
        model: "claude-3-sonnet-20240229",
        system: createCircuitBoard1Template({
          currentCode: code,
        }),
        messages: [
          // TODO: include previous messages
          {
            role: "user",
            content: message,
          },
        ],
        max_tokens: 4096,
      })

      let accumulatedContent = ""
      let isInCodeBlock = false

      for await (const chunk of stream) {
        if (chunk.type === "content_block_delta") {
          const chunkText = (chunk.delta as TextDelta).text
          accumulatedContent += chunkText

          if (chunkText.includes("```")) {
            isInCodeBlock = !isInCodeBlock
            if (isInCodeBlock) {
              setCurrentCodeBlock("")
            } else {
              const codeContent = accumulatedContent
                .split("```")
                .slice(-2, -1)[0]
                .trim()
                .replace(/^tsx/, "")
                .trim()
              onCodeChange(codeContent)
              setCurrentCodeBlock(null)
            }
          } else if (isInCodeBlock) {
            setCurrentCodeBlock((prev) => {
              const updatedCode = (prev || "") + chunkText
              onCodeChange(updatedCode)
              return updatedCode
            })
          }

          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages]
            updatedMessages[updatedMessages.length - 1].content =
              accumulatedContent
            return updatedMessages
          })
        }
      }
    } catch (error) {
      console.error("Error streaming response:", error)
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages]
        updatedMessages[updatedMessages.length - 1].content =
          "An error occurred while generating the response."
        return updatedMessages
      })
    } finally {
      setIsStreaming(false)
      onStopStreaming()
    }
  }

  useEffect(() => {
    const searchParams = new URLSearchParams(
      window.location.search.split("?")[1],
    )
    const initialPrompt = searchParams.get("initial_prompt")

    if (initialPrompt && messages.length === 0) {
      addMessage(initialPrompt)
    }
  }, [])

  return (
    <div className="flex flex-col h-[calc(100vh-60px)] max-w-2xl mx-auto p-4 bg-gray-100">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((message, index) => (
          <AiChatMessage key={index} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      {code && errorMessage && !isStreaming && (
        <div className="flex justify-end mr-6">
          <Button
            onClick={() => {
              addMessage(`Fix this error: ${errorMessage}`)
            }}
            className="mb-2 bg-green-50 hover:bg-green-100"
            variant="outline"
          >
            <MagicWandIcon className="w-4 h-4 mr-2" />
            <span className="font-bold">Fix Error with AI</span>
            <span className="italic font-normal ml-2">
              "{errorMessage.slice(0, 26)}..."
            </span>
          </Button>
        </div>
      )}
      <ChatInput
        onSubmit={async (message: string) => {
          addMessage(message)
        }}
        disabled={isStreaming}
      />
    </div>
  )
}
