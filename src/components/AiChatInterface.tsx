import { useState } from "react"
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

interface Message {
  id: number
  sender: "user" | "bot"
  content: string
}

export default function AIChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "user",
      content: "Create a circuit that does XYZ",
    },
    {
      id: 2,
      sender: "bot",
      content: `I'll make a circuit that does XYZ`,
    },
    {
      id: 3,
      sender: "user",
      content: "give an led to indicate power",
    },
  ])

  return (
    <div className="flex flex-col h-[calc(100vh-50px)] max-w-2xl mx-auto p-4 bg-gray-100">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((message) => (
          <div
            key={message.id}
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
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 px-2 text-xs"
                      >
                        version 1
                        <ChevronDown className="ml-1 h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem className="text-xs bg-white flex">
                        <RotateCcw className="mr-1 h-3 w-3" />
                        Revert to v1
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-xs bg-white flex">
                        <Eye className="mr-1 h-3 w-3" />
                        View v1
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
      </div>
      <ChatInput />
    </div>
  )
}
