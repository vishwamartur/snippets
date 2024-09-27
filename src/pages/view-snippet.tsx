import { CodeEditor } from "@/components/CodeEditor"
import { DownloadButtonAndMenu } from "@/components/DownloadButtonAndMenu"
import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ViewSnippetHeader from "@/components/ViewSnippetHeader"
import ViewSnippetSidebar from "@/components/ViewSnippetSidebar"
import { useCurrentSnippet } from "@/hooks/use-current-snippet"
import { encodeTextToUrlHash } from "@/lib/encodeTextToUrlHash"
import { CadViewer } from "@tscircuit/3d-viewer"
import { PCBViewer } from "@tscircuit/pcb-viewer"
import { Share } from "lucide-react"
import { useParams } from "wouter"

export const ViewSnippetPage = () => {
  const { author, snippetName } = useParams()
  const { snippet } = useCurrentSnippet()
  return (
    <div>
      <Header />
      <ViewSnippetHeader />
      <div className="flex">
        <div className="flex-grow m-4 p-4 border border-gray-200 rounded-md">
          <Tabs defaultValue="code">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => {
                  if (!snippet) return
                  const url = encodeTextToUrlHash(snippet.content)
                  navigator.clipboard.writeText(url)
                  alert("URL copied to clipboard!")
                }}
              >
                <Share className="mr-1 h-3 w-3" />
                Copy URL
              </Button>
              <DownloadButtonAndMenu />
              <div className="flex-grow" />
              <TabsList>
                <TabsTrigger value="code">Code</TabsTrigger>
                <TabsTrigger value="pcb">PCB</TabsTrigger>
                <TabsTrigger value="3d">3D</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="code">
              {snippet && (
                <div className="mt-4 bg-gray-50 rounded-md border border-gray-200">
                  <CodeEditor
                    defaultCode={snippet?.content}
                    onCodeChange={() => {}}
                    readOnly
                  />
                </div>
              )}
            </TabsContent>
            <TabsContent value="pcb">
              <div className="mt-4 h-[500px]">
                {/* <PCBViewer soup={circuitJson} /> */}
              </div>
            </TabsContent>
            <TabsContent value="3d">
              <div className="mt-4 h-[500px]">
                {/* <CadViewer soup={circuitJson as any} /> */}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <ViewSnippetSidebar />
      </div>
    </div>
  )
}
