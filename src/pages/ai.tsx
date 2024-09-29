import AIChatInterface from "@/components/AiChatInterface"
import { CodeEditor } from "@/components/CodeEditor"
import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MagicWandIcon } from "@radix-ui/react-icons"
import { CadViewer } from "@tscircuit/3d-viewer"
import { PCBViewer } from "@tscircuit/pcb-viewer"
import { ClipboardIcon } from "lucide-react"

export const AiPage = () => {
  const message = ""
  const circuitJson: any[] = []
  const snippet: any = { content: "" }

  return (
    <div>
      <Header />
      <div className="flex bg-gray-100">
        <div className="w-2/5">
          <AIChatInterface />
        </div>
        <div className="w-3/5">
          <div className="p-4 h-full">
            <div className="bg-white h-full p-4 rounded-lg shadow">
              <Tabs defaultValue="code">
                <div className="flex items-center gap-2">
                  <TabsList>
                    <TabsTrigger value="code">Code</TabsTrigger>
                    <TabsTrigger value="pcb">PCB</TabsTrigger>
                    <TabsTrigger value="3d">3D</TabsTrigger>
                    <TabsTrigger value="error">
                      Errors
                      {message && (
                        <span className="inline-flex items-center justify-center w-5 h-5 ml-2 text-xs font-bold text-white bg-red-500 rounded-full">
                          1
                        </span>
                      )}
                    </TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="code">
                  {snippet && (
                    <div className="mt-4 bg-gray-50 rounded-md border border-gray-200">
                      <CodeEditor
                        code={snippet?.content ?? ""}
                        onCodeChange={() => {}}
                        readOnly
                      />
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="pcb">
                  <div className="mt-4 h-[500px]">
                    {circuitJson ? (
                      <PCBViewer soup={circuitJson} />
                    ) : (
                      "No Circuit JSON (might be an error in the snippet)"
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="3d">
                  <div className="mt-4 h-[500px]">
                    {circuitJson ? (
                      <CadViewer soup={circuitJson as any} />
                    ) : (
                      "No Circuit JSON (might be an error in the snippet)"
                    )}
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
                            if (!message) return
                            navigator.clipboard.writeText(message)
                            alert("Error copied to clipboard!")
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
      </div>
    </div>
  )
}
