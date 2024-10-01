import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronDown, Search } from "lucide-react"
import { Link, useLocation } from "wouter"
import { cn } from "@/lib/utils/index"
import { HeaderLogin } from "@/components/HeaderLogin"

const HeaderButton = ({
  href,
  children,
}: { href: string; children: React.ReactNode }) => {
  const [location] = useLocation()

  if (location === href) {
    return (
      <Button
        variant="ghost"
        className="border-b-2 rounded-none border-blue-600"
      >
        {children}
      </Button>
    )
  }

  return (
    <Link href={href}>
      <Button variant="ghost">{children}</Button>
    </Link>
  )
}

export default function Header() {
  return (
    <header className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center">
        <Link href="/" className="text-lg font-semibold mr-3 ">
          <span className="bg-blue-500 px-2 py-1 rounded-md text-white">
            tscircuit
          </span>{" "}
          <span className="text-gray-800">snippets</span>
        </Link>
        <nav>
          <ul className="flex items-center gap-2">
            <li>
              <HeaderButton href="/dashboard">Dashboard</HeaderButton>
            </li>
            <li>
              <HeaderButton href="/newest">Newest</HeaderButton>
            </li>
            <li>
              <HeaderButton href="/quickstart">Editor</HeaderButton>
            </li>
            <li>
              <HeaderButton href="/ai">AI</HeaderButton>
            </li>
            <li>
              <Link href="https://docs.tscircuit.com">
                <Button variant="ghost">Docs</Button>
              </Link>
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
        <HeaderLogin />
      </div>
    </header>
  )
}
