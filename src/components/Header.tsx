import { HeaderLogin } from "@/components/HeaderLogin"
import { Button } from "@/components/ui/button"
import { useGlobalStore } from "@/hooks/use-global-store"
import { cn } from "@/lib/utils"
import {
  GitHubLogoIcon,
  OpenInNewWindowIcon,
  ChatBubbleIcon,
} from "@radix-ui/react-icons"
import { Menu, MessageCircleMoreIcon, X } from "lucide-react"
import React, { useState } from "react"
import { Link, useLocation } from "wouter"
import CmdKMenu from "./CmdKMenu"
import HeaderDropdown from "./HeaderDropdown"
import SearchComponent from "./SearchComponent"

const HeaderButton = ({
  href,
  children,
  className,
  alsoHighlightForUrl,
}: {
  href: string
  children: React.ReactNode
  className?: string
  alsoHighlightForUrl?: string
}) => {
  const [location] = useLocation()

  if (location === href || location === alsoHighlightForUrl) {
    return (
      <Button
        variant="ghost"
        className={`border-b-2 rounded-none border-blue-600 header-button ${className}`}
      >
        {children}
      </Button>
    )
  }

  return (
    <Link className={cn("header-button", className)} href={href}>
      <Button className={className} variant="ghost">
        {children}
      </Button>
    </Link>
  )
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isLoggedIn = useGlobalStore((s) => Boolean(s.session))

  return (
    <header className="px-4 py-3">
      <div className="flex items-center">
        <Link href="/" className="text-lg font-semibold whitespace-nowrap">
          <span className="bg-blue-500 px-2 py-1 rounded-md text-white">
            tscircuit
          </span>
        </Link>
        <div className="hidden md:flex items-center space-x-4">
          <nav>
            <ul className="flex items-center gap-2 ml-2">
              {isLoggedIn && (
                <li>
                  <HeaderButton href="/dashboard">Dashboard</HeaderButton>
                </li>
              )}
              <li>
                <HeaderButton href="/newest">Newest</HeaderButton>
              </li>
              <li>
                <HeaderButton href="/quickstart" alsoHighlightForUrl="/editor">
                  Editor
                </HeaderButton>
              </li>
              <li>
                <HeaderButton href="/ai">AI</HeaderButton>
              </li>
              <li>
                <a href="https://docs.tscircuit.com">
                  <Button variant="ghost">Docs</Button>
                </a>
              </li>
              <li>
                <a href="https://tscircuit.com/join">
                  <Button variant="ghost" className="text-gray-500">
                    <MessageCircleMoreIcon className="w-4 h-4" />
                  </Button>
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex-grow"></div>
        <a
          href="https://github.com/tscircuit/tscircuit"
          target="_blank"
          className="mr-4"
        >
          <GitHubLogoIcon className="text-gray-400 hover:text-gray-600 transition-colors" />
        </a>
        {/* <a href="https://tscircuit.com/join" target="_blank" className="mr-2">
          <DiscordLogoIcon className="text-gray-400 hover:text-gray-600 transition-colors" />
        </a> */}
        <div className="hidden md:flex items-center space-x-4">
          <SearchComponent />
          <HeaderDropdown />
          <HeaderLogin />
        </div>
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden mt-4">
          <nav className="mb-4">
            <ul className="flex flex-col gap-2 w-full">
              {isLoggedIn && (
                <li>
                  <HeaderButton
                    className="w-full justify-start"
                    href="/dashboard"
                  >
                    Dashboard
                  </HeaderButton>
                </li>
              )}
              <li>
                <HeaderButton className="w-full justify-start" href="/newest">
                  Newest
                </HeaderButton>
              </li>
              <li>
                <HeaderButton
                  className="w-full justify-start"
                  href="/quickstart"
                  alsoHighlightForUrl="/editor"
                >
                  Editor
                </HeaderButton>
              </li>
              <li>
                <HeaderButton className="w-full justify-start" href="/ai">
                  AI
                </HeaderButton>
              </li>
              <li>
                <HeaderButton
                  className="w-full justify-start"
                  href="https://docs.tscircuit.com"
                >
                  Docs
                </HeaderButton>
              </li>
            </ul>
          </nav>
          <div className="flex flex-col gap-4">
            <SearchComponent />
            <HeaderDropdown />
            <HeaderLogin />
          </div>
        </div>
      )}
      <CmdKMenu />
    </header>
  )
}
