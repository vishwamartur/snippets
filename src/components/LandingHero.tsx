import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Globe,
  Code,
  Sun,
  Battery,
  Cpu,
  Grid,
  LayoutGrid,
  Bot,
} from "lucide-react"

export const LandingHero = () => {
  return (
    <div className="p-6">
      {CreateNewSnippetHero()}

      <Card className="mb-6 bg-gray-50 rounded-sm">
        <CardHeader className="p-3 pl-8">
          <CardTitle className="flex justify-between items-center">
            <div className="pt-2">Onboarding Tips</div>
            <Button variant="ghost" className="text-gray-400 text-xl">
              &times;
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc marker:text-gray-400 pl-5 space-y-2">
            <li>
              tscircuit snippets are React components that turn into
              manufacturable circuit boards, circuit modules, 3D models or
              footprints.
            </li>
            <li>
              You can design full boards, or individual components like chips
            </li>
            <li>
              You can export snippets to{" "}
              <a href="#" className="text-blue-600">
                KiCad
              </a>
              ,{" "}
              <a href="#" className="text-blue-600">
                Gerbers
              </a>
              ,{" "}
              <a href="#" className="text-blue-600">
                STEP
              </a>
              , and other formats
            </li>
            <li>
              Type <b>@</b> when coding to import other snippets
            </li>
          </ul>
        </CardContent>
      </Card>

      <div className="grid grid-cols-4 gap-4">
        <div>
          <Button className="w-full justify-between mb-2">
            Create new{" "}
            <span className="ml-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
              BOARD
            </span>
          </Button>
          <p className="text-sm text-gray-600">
            A printed circuit board containing multiple chips, resistors and
            capacitors to form a functional, manufacturable electronic device.
          </p>
        </div>
        <div>
          <Button className="w-full justify-between mb-2">
            Create new{" "}
            <span className="ml-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
              PACKAGE
            </span>
          </Button>
          <p className="text-sm text-gray-600">
            A chip or circuit module that you'd like to use as part of a larger
            package.
          </p>
        </div>
        <div>
          <Button className="w-full justify-between mb-2">
            Create new{" "}
            <span className="ml-2 bg-purple-500 text-white px-2 py-1 rounded text-xs">
              FOOTPRINT
            </span>
          </Button>
          <p className="text-sm text-gray-600">
            A footprint or landing-pattern for a component. This is usually used
            as part of a chip.
          </p>
        </div>
        <div>
          <Button className="w-full justify-between mb-2">
            Create new{" "}
            <span className="ml-2 bg-indigo-500 text-white px-2 py-1 rounded text-xs">
              3D MODEL
            </span>
          </Button>
          <p className="text-sm text-gray-600">
            A 3d model of a component. This is usually used as part of a chip.
          </p>
        </div>
      </div>
      <Button variant="outline" className="mt-4">
        <span className="mr-2">📄</span> View more templates
      </Button>
    </div>
  )
}
