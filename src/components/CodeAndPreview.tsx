import { useMemo, useState } from "react"
import { CodeEditor } from "@/components/CodeEditor"
import { PCBViewer } from "@tscircuit/pcb-viewer"
import { CadViewer } from "@tscircuit/3d-viewer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { defaultCodeForBlankPage } from "@/lib/defaultCodeForBlankCode"
import { decodeUrlHashToText } from "@/lib/decodeUrlHashToText"
import { encodeTextToUrlHash } from "@/lib/encodeTextToUrlHash"
import { Button } from "@/components/ui/button"
import { useRunTsx } from "@/hooks/use-run-tsx"
import EditorNav from "./EditorNav"
import { CircuitJsonTableViewer } from "./TableViewer/CircuitJsonTableViewer"
import { Snippet } from "fake-snippets-api/lib/db/schema"
import axios from "redaxios"
import { useToast } from "@/hooks/use-toast"

interface Props {
  snippet?: Snippet | null
}

export function CodeAndPreview({ snippet }: Props) {
  const defaultCode =
    decodeUrlHashToText(window.location.toString()) ?? defaultCodeForBlankPage
  const [code, setCode] = useState(defaultCode)
  const { toast } = useToast()

  const { message, circuitJson } = useRunTsx(code)

  const handleSave = async () => {
    if (!snippet) return

    try {
      const response = await axios.post("/api/snippets/update", {
        snippet_id: snippet.snippet_id,
        content: code,
      })

      if (response.status === 200) {
        toast({
          title: "Snippet saved",
          description: "Your changes have been saved successfully.",
        })
      } else {
        throw new Error("Failed to save snippet")
      }
    } catch (error) {
      console.error("Error saving snippet:", error)
      toast({
        title: "Error",
        description: "Failed to save the snippet. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (!snippet) {
    return <div>Loading...</div>
  }

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const handleCodeChange = (newCode: string) => {
    setCode(newCode)
    setHasUnsavedChanges(true)
  }

  const handleSaveWithChanges = async () => {
    await handleSave()
    setHasUnsavedChanges(false)
  }

  return (
    <div className="flex flex-col">
      <EditorNav
        snippet={snippet}
        code={code}
        hasUnsavedChanges={hasUnsavedChanges}
        onSave={handleSaveWithChanges}
      />
      <div className="flex">
        <div className="w-1/2 p-2 border-r border-gray-200 bg-gray-50">
          <CodeEditor defaultCode={defaultCode} onCodeChange={handleCodeChange} />
        </div>
        <div className="w-1/2 p-2">
          <Tabs defaultValue="pcb">
            <TabsList>
              <TabsTrigger value="pcb">PCB</TabsTrigger>
              <TabsTrigger value="cad">3D</TabsTrigger>
              <TabsTrigger value="table">JSON</TabsTrigger>
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
                <CircuitJsonTableViewer elements={circuitJson as any} />
              </div>
            </TabsContent>
          </Tabs>
          {(message ?? "").trim() && (
            <textarea className="w-full h-32 bg-red-100" value={message} />
          )}
        </div>
      </div>
    </div>
  )
}
