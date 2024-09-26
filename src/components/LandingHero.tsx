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
      <Card className="mb-6 bg-blue-50 rounded-sm">
        <CardHeader>
          <CardTitle className="text-blue-600 flex items-center gap-2">
            <span className="text-2xl">
              <Bot size={24} />
            </span>{" "}
            Create a circuit using AI, type anything below!
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="mb-4">
            <Input
              placeholder="Create a 3x3 usb keyboard with a dial"
              className="w-full bg-white"
            />
          </div>
          <div className="flex justify-between">
            <Button
              variant="ghost"
              className="flex items-center gap-2 opacity-70 hover:bg-white hover:opacity-100"
            >
              <Battery size={20} />
              <span>Battery-powered flashlight</span>
            </Button>
            <Button
              variant="ghost"
              className="flex items-center gap-2 opacity-70 hover:bg-white hover:opacity-100"
            >
              <Cpu size={20} />
              <span>Motor driver module</span>
            </Button>
            <Button
              variant="ghost"
              className="flex items-center gap-2 opacity-70 hover:bg-white hover:opacity-100"
            >
              <LayoutGrid size={20} />
              <span>NA555 Timer Chip</span>
            </Button>
          </div>
        </CardContent>
      </Card>

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
            A board that can be manufactured.
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
