import { useMemo, useState } from "react"
import { CodeEditor } from "@/components/CodeEditor"
import { PCBViewer } from "@tscircuit/pcb-viewer"
import { CadViewer } from "@tscircuit/3d-viewer"
import { SoupTableViewer } from "@tscircuit/table-viewer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import "react-data-grid/lib/styles.css"
import { defaultCodeForBlankPage } from "@/lib/defaultCodeForBlankCode"
import { decodeUrlHashToText } from "@/lib/decodeUrlHashToText"
import { encodeTextToUrlHash } from "@/lib/encodeTextToUrlHash"
import { Button } from "@/components/ui/button"
import {useRunTsx} from "@/hooks/use-run-tsx"

export function CodeAndPreview() {
  const defaultCode =
    decodeUrlHashToText(window.location.toString()) ?? defaultCodeForBlankPage
  const [code, setCode] = useState(defaultCode)

  const { message, circuitJson } = useRunTsx(code)

  return (
    <div className="flex">
      <div className="w-1/2 p-8">
        <CodeEditor defaultCode={defaultCode} onCodeChange={setCode} />
        <Button
          className="mt-4 px-4 py-2"
          onClick={() => {
            const url = encodeTextToUrlHash(code)
            navigator.clipboard.writeText(url)
            alert("URL copied to clipboard!")
          }}
        >
          Create URL for Code Snippet
        </Button>
      </div>
      <div className="w-1/2 p-8">
        <Tabs defaultValue="pcb">
          <TabsList>
            <TabsTrigger value="pcb">PCB</TabsTrigger>
            <TabsTrigger value="cad">3D</TabsTrigger>
            <TabsTrigger value="table">Table</TabsTrigger>
          </TabsList>
          <TabsContent value="pcb">
            <div className="mt-4 h-[500px]">
              <PCBViewer soup={circuitJson} />
            </div>
          </TabsContent>
          <TabsContent value="cad">
            <div className="mt-4 h-[500px]">
              <CadViewer soup={circuitJson as any} />
            </div>
          </TabsContent>
          <TabsContent value="table">
            <div className="mt-4 h-[500px]">
              <SoupTableViewer elements={circuitJson as any} />
            </div>
          </TabsContent>
        </Tabs>
        <textarea className="w-full h-32 bg-red-100" value={message} />
      </div>
    </div>
  )
}
