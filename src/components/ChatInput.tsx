import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Paperclip, ArrowUp } from "lucide-react"

export default function ChatInput() {
  return (
    <div className="relative shadow-lg border-2 border-gray-300 rounded-full m-4">
      <Input
        type="text"
        placeholder="Ask for more"
        className="pr-20 pl-4 py-6 rounded-full bg-gray-100 border-none focus:ring-2 focus:ring-blue-500"
      />
      {/* For when we support attachments */}
      {/* <Button
        size="icon"
        variant="ghost"
        className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        <Paperclip className="h-5 w-5" />
      </Button> */}
      <Button
        size="icon"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white rounded-full"
      >
        <ArrowUp className="h-5 w-5" />
      </Button>
    </div>
  )
}
