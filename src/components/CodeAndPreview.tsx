import { useEffect, useMemo, useState } from "react"
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
import { ClipboardIcon, Share } from "lucide-react"
import { MagicWandIcon } from "@radix-ui/react-icons"

interface Props {
  snippet?: Snippet | null
}

export function CodeAndPreview({ snippet }: Props) {
  const defaultCode = useMemo(() => {
    return decodeUrlHashToText(window.location.toString()) ?? snippet?.content
  }, [])
  const [code, setCode] = useState(defaultCode ?? "")

  useEffect(() => {
    if (snippet?.content && !defaultCode) {
      setCode(snippet.content)
    }
  }, [snippet?.content])
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
            code={code}
            onCodeChange={(newCode) => setCode(newCode)}
          />
        </div>
        <div className="w-1/2 p-2">
          <Tabs defaultValue="pcb">
            <TabsList>
              <TabsTrigger value="pcb">PCB</TabsTrigger>
              <TabsTrigger value="cad">3D</TabsTrigger>
              <TabsTrigger value="table">JSON</TabsTrigger>
              <TabsTrigger value="error">
                Errors
                {message && (
                  <span className="inline-flex items-center justify-center w-5 h-5 ml-2 text-xs font-bold text-white bg-red-500 rounded-full">
                    1
                  </span>
                )}
              </TabsTrigger>
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
            <TabsContent value="error">
              {message ? (
                <>
                  <div className="mt-4 bg-red-50 rounded-md border border-red-200">
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-red-800 mb-3">
                        Error
                      </h3>
                      <p className="text-sm font-mono whitespace-pre-wrap text-red-700">
                        {message}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(message)
                        toast({
                          title: "Copied",
                          description: "Error message copied to clipboard",
                        })
                      }}
                    >
                      <ClipboardIcon className="w-4 h-4 mr-2" />
                      Copy Error
                    </Button>
                    <Button variant="outline">
                      <MagicWandIcon className="w-4 h-4 mr-2" />
                      Fix with AI
                    </Button>
                  </div>
                </>
              ) : (
                <div className="mt-4 bg-green-50 rounded-md border border-green-200">
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-green-800 mb-3">
                      No Errors 👌
                    </h3>
                    <p className="text-sm text-green-700">
                      Your code is running without any errors.
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
