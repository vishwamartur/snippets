import { Link } from "wouter"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Code,
  Monitor,
  Bot,
  GitFork,
  AtSign,
  Package,
  Settings,
  Link as LinkIcon,
  Copy,
  Hash,
  Clock,
} from "lucide-react"
import { GitHubLogoIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"

export default function ViewSnippetSidebar({
  className,
}: { className?: string }) {
  return (
    <div
      className={cn(
        "w-64 h-screen bg-gray-100 text-gray-700 flex flex-col",
        className,
      )}
    >
      <nav className="flex-1 overflow-y-auto">
        <ul className="p-2 space-y-2">
          {[
            { icon: <Code className="w-5 h-5" />, label: "Edit Code" },
            {
              icon: <Bot className="w-5 h-5" />,
              label: "Edit with AI",
              badge: "AI",
            },
            {
              icon: <GitHubLogoIcon className="w-5 h-5" />,
              label: "Github",
            },
            { icon: <GitFork className="w-5 h-5" />, label: "Forks" },
            { icon: <AtSign className="w-5 h-5" />, label: "References" },
            { icon: <Package className="w-5 h-5" />, label: "Dependencies" },
            { icon: <Clock className="w-5 h-5" />, label: "Versions" },
            { icon: <Settings className="w-5 h-5" />, label: "Settings" },
          ].map((item, index) => (
            <li key={index}>
              <Link
                href="#"
                className="flex items-center gap-3 px-2 py-1.5 hover:bg-gray-200 rounded-md"
              >
                {item.icon}
                <span className="text-sm">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded">
                    {item.badge}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200 space-y-4">
        <div className="flex items-center gap-2 text-blue-500">
          <LinkIcon className="w-5 h-5" />
          <span className="text-sm font-medium">
            https://snippets.tscircuit.com/embed/seveibar/circuitmodule
          </span>
        </div>
        <div className="text-sm text-gray-500">September 26, 2024</div>
        <div className="space-y-2">
          <div className="text-sm font-medium">Copy embed URL</div>
          <Input
            value="https://snippets.tscircuit.com/embed/seveibar/circuitmodule"
            readOnly
            className="text-xs"
          />
        </div>
        <div className="space-y-2">
          <div className="text-sm font-medium">Copy import URL</div>
          <Input
            value={`import CircuitModule from "@tsci/seveibar.circuitmodule"`}
            readOnly
            className="text-xs"
          />
        </div>
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start">
            <Copy className="w-4 h-4 mr-2" />
            Copy embed code
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <LinkIcon className="w-4 h-4 mr-2" />
            Copy link
          </Button>
        </div>
      </div>
    </div>
  )
}
