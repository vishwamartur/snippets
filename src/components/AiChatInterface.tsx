import { useState, useRef, useEffect } from "react"
import {
  BotIcon,
  ChevronDown,
  Download,
  Eye,
  RotateCcw,
  SendIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import ChatInput from "./ChatInput"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAiApi } from "@/hooks/use-ai-api"
import { createCircuitBoard1Template } from "@tscircuit/prompt-benchmarks"
import { TextDelta } from "@anthropic-ai/sdk/resources/messages.mjs"
import { MagicWandIcon } from "@radix-ui/react-icons"

interface Message {
  sender: "user" | "bot"
  content: string
  codeVersion?: number
}

const Message = ({ message }: { message: Message }) => (
  <div
    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
  >
    <div
      className={`max-w-[80%] rounded-lg p-4 ${
        message.sender === "user" ? "bg-blue-100" : "bg-white"
      }`}
    >
      {message.sender === "bot" && (
        <div className="flex items-center mb-2">
          <Avatar className="w-7 h-7 mr-2 flex items-center justify-center bg-black">
            <BotIcon className="text-white px-1" />
          </Avatar>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
                version {message.codeVersion}
                <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem className="text-xs bg-white flex">
                <RotateCcw className="mr-1 h-3 w-3" />
                Revert to v{message.codeVersion}
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs bg-white flex">
                <Eye className="mr-1 h-3 w-3" />
                View v{message.codeVersion}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      <p className="text-xs font-mono whitespace-pre-wrap">{message.content}</p>
    </div>
  </div>
)

export default function AIChatInterface({
  code,
  onCodeChange,
  errorMessage,
}: {
  code: string
  onCodeChange: (code: string) => void
  errorMessage: string | null
}) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const anthropic = useAiApi()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [currentCodeBlock, setCurrentCodeBlock] = useState<string | null>(null)

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
              onCodeChange(codeContent.replace(/^tsx/, ""))
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
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-50px)] max-w-2xl mx-auto p-4 bg-gray-100">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((message, index) => (
          <Message key={index} message={message} />
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
              "{errorMessage.slice(0, 20)}..."
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
