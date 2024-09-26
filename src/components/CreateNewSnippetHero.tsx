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

export function CreateNewSnippetHero() {
  return (
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
  )
}
