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
import { useMutation, useQueryClient } from "react-query"

interface Props {
  snippet?: Snippet | null
}

export function CodeAndPreview({ snippet }: Props) {
  const defaultCode =
    decodeUrlHashToText(window.location.toString()) ?? defaultCodeForBlankPage
  const [code, setCode] = useState(defaultCode)
  const { toast } = useToast()

  const { message, circuitJson } = useRunTsx(code)
  const qc = useQueryClient()

  const updateSnippetMutation = useMutation({
    mutationFn: async () => {
      if (!snippet) throw new Error("No snippet to update")
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const response = await axios.post("/api/snippets/update", {
        snippet_id: snippet.snippet_id,
        content: code,
      })
      if (response.status !== 200) {
        throw new Error("Failed to save snippet")
      }
      return response.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["snippets", snippet?.snippet_id] })
      toast({
        title: "Snippet saved",
        description: "Your changes have been saved successfully.",
      })
    },
    onError: (error) => {
      console.error("Error saving snippet:", error)
      toast({
        title: "Error",
        description: "Failed to save the snippet. Please try again.",
        variant: "destructive",
      })
    },
  })

  const handleSave = () => {
    updateSnippetMutation.mutate()
  }

  const hasUnsavedChanges = snippet?.content !== code

  if (!snippet) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col">
      <EditorNav
        snippet={snippet}
        code={code}
        isSaving={updateSnippetMutation.isLoading}
        hasUnsavedChanges={hasUnsavedChanges}
        onSave={() => handleSave()}
      />
      <div className="flex">
        <div className="w-1/2 p-2 border-r border-gray-200 bg-gray-50">
          <CodeEditor
            defaultCode={defaultCode}
            onCodeChange={(code) => setCode(code)}
          />
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
