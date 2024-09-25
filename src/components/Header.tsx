import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronDown, Search } from "lucide-react"
import { Link } from "wouter"

export default function Header() {
  return (
    <header className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center">
        <Link href="/" className="text-lg font-semibold mr-2 ">
          <span className="bg-blue-500 px-2 py-1 rounded-md text-white">
            tscircuit
          </span>{" "}
          <span className="text-gray-800">snippets</span>
        </Link>
        <nav>
          <ul className="flex items-center">
            <li>
              <Button variant="ghost">Dashboard</Button>
            </li>
            <li>
              <Button variant="ghost">Newest</Button>
            </li>
            <li>
              <Button variant="ghost">Editor</Button>
            </li>
            <li>
              <Button variant="ghost">Docs</Button>
            </li>
          </ul>
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search
            className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            type="search"
            placeholder="Search"
            className="pl-8 focus:border-blue-500 placeholder-gray-400"
          />
        </div>
        <Button
          size="sm"
          variant="default"
          className="bg-blue-600 hover:bg-blue-700"
        >
          New <ChevronDown className="ml-1" size={16} />
        </Button>
        <div className="rounded-full w-8 h-8 bg-gray-300" />
      </div>
    </header>
  )
}
