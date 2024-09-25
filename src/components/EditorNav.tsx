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

export default function EditorNav({ code }: { code: string }) {
  return (
    <nav className="flex items-center justify-between px-2 py-3 border-b border-gray-200 bg-white text-sm border-t">
      <div className="flex items-center space-x-1">
        {/* <span className="text-base font-semibold">»</span> */}
        <span className="text-md font-semibold">
          seveibar/new-snippet-0f83a4
        </span>
        <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
          <OpenInNewWindowIcon className="h-3 w-3 text-gray-500" />
        </Button>
      </div>
      <div className="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
              <Download className="mr-1 h-3 w-3" />
              Download
              <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem className="text-xs">
              <Download className="mr-1 h-3 w-3" />
              <span className="flex-grow mr-6">Download TSX</span>
              <span className="text-[0.6rem] opacity-80 bg-blue-500 text-white font-mono rounded-md px-1 text-center py-0.5 mr-1">
                tsx
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-xs">
              <Download className="mr-1 h-3 w-3" />
              <span className="flex-grow mr-6">Download Circuit JSON</span>
              <span className="text-[0.6rem] opacity-80 bg-blue-500 text-white font-mono rounded-md px-1 text-center py-0.5 mr-1">
                json
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-xs">
              <Download className="mr-1 h-3 w-3" />
              <span className="flex-grow  mr-6">Download 3D Model</span>
              <span className="text-[0.6rem] bg-green-500 opacity-80 text-white font-mono rounded-md px-1 text-center py-0.5 mr-1">
                stl
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-xs">
              <Download className="mr-1 h-3 w-3" />
              <span className="flex-grow  mr-6">Fabrication Files</span>
              <span className="text-[0.6rem] bg-purple-500 opacity-80 text-white font-mono rounded-md px-1 text-center py-0.5 mr-1">
                gerber/pnp/bom/csv
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-xs">
              <Download className="mr-1 h-3 w-3" />
              <span className="flex-grow mr-6">Download Footprint</span>
              <span className="text-[0.6rem] bg-orange-500 opacity-80 text-white font-mono rounded-md px-1 text-center py-0.5 mr-1">
                kicad_mod
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-xs">
              <Download className="mr-1 h-3 w-3" />
              <span className="flex-grow mr-6">Download KiCad Zip</span>
              <span className="text-[0.6rem] bg-orange-500 opacity-80 text-white font-mono rounded-md px-1 text-center py-0.5 mr-1">
                kicad_*
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
