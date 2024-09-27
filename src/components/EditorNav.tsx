import {
  ChevronDown,
  Copy,
  Download,
  Edit2,
  Eye,
  Maximize2,
  Package,
  Share,
  Share2,
  Sidebar,
  SidebarClose,
  Save,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { OpenInNewWindowIcon } from "@radix-ui/react-icons"
import { encodeTextToUrlHash } from "@/lib/encodeTextToUrlHash"
import { Snippet } from "fake-snippets-api/lib/db/schema"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { DownloadButtonAndMenu } from "./DownloadButtonAndMenu"

export default function EditorNav({
  snippet,
  code,
  hasUnsavedChanges,
  onSave,
}: {
  snippet: Snippet
  code: string
  hasUnsavedChanges: boolean
  onSave: () => void
}) {
  return (
    <nav className="flex items-center justify-between px-2 py-3 border-b border-gray-200 bg-white text-sm border-t">
      <div className="flex items-center space-x-1">
        {/* <span className="text-base font-semibold">»</span> */}
        <span className="text-md font-semibold">
          {snippet.full_snippet_name}
        </span>
        <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
          <OpenInNewWindowIcon className="h-3 w-3 text-gray-500" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={"h-6 px-2 text-xs"}
          onClick={onSave}
        >
          <Save className="mr-1 h-3 w-3" />
          Save
        </Button>
        {hasUnsavedChanges && (
          <div className="animate-fadeIn bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
            unsaved changes
          </div>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <DownloadButtonAndMenu />
        <Button
          variant="outline"
          size="sm"
          className="h-6 px-2"
          onClick={() => {}}
        >
          <Copy className="mr-1 h-3 w-3" />
          <span className="font-mono text-[0.6rem]">
            tsci add seveibar/new-snippet-0f83a4
          </span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-6 px-2 text-xs"
          onClick={() => {
            const url = encodeTextToUrlHash(code)
            navigator.clipboard.writeText(url)
            alert("URL copied to clipboard!")
          }}
        >
          <Share className="mr-1 h-3 w-3" />
          Copy URL
        </Button>
        <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
          <Eye className="mr-1 h-3 w-3" />
          Public
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-6 px-2 text-[0.6rem] bg-green-500 text-white hover:bg-green-600 hover:text-white"
        >
          Running
        </Button>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <Sidebar className="h-3 w-3" />
        </Button>
      </div>
    </nav>
  )
}
