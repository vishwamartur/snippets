import { Link } from "wouter"

export default function Footer() {
  return (
    <footer className="bg-white text-black py-12 border-t mt-8">
      <div className="container mx-auto px-4">
        <h2 className="text-xl font-semibold mb-4">tscircuit snippets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-sm text-gray-600">
          <div className="space-y-4">
            <nav className="flex flex-col space-y-2">
              {[
                "Home",
                "Dashboard",
                "Editor",
                "Create with AI",
                "My Profile",
                "Settings",
              ].map((item) => (
                <Link key={item} href="#" className="hover:underline">
                  {item}
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold uppercase">Explore</h3>
            <nav className="flex flex-col space-y-2">
              {["Newest Snippets", "Docs"].map((item) => (
                <Link key={item} href="#" className="hover:underline">
                  {item}
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold uppercase">Follow</h3>
            <nav className="flex flex-col space-y-2">
              {["Blog", "Twitter", "Discord", "GitHub", "YouTube"].map(
                (item) => (
                  <Link key={item} href="#" className="hover:underline">
                    {item}
                  </Link>
                ),
              )}
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold uppercase">Company</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="#" className="hover:underline">
                About
              </Link>
              <Link
                href="mailto:contact@tscircuit.com"
                className="hover:underline"
              >
                contact@tscircuit.com
              </Link>
              <div className="flex-grow" />
              <div className="text-xs text-gray-500">
                we are inspired by{" "}
                <a href="https://val.town" className="underline">
                  val.town
                </a>
                ,{" "}
                <a href="https://codesandbox.io/" className="underline">
                  codesandbox
                </a>{" "}
                and{" "}
                <a href="https://v0.dev" className="underline">
                  v0.dev
                </a>
              </div>
              <div className="text-xs text-gray-500">
                &copy; {new Date().getFullYear()} tscircuit Inc.
              </div>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  )
}
