import AIChatInterface from "@/components/AiChatInterface"
import { CodeEditor } from "@/components/CodeEditor"
import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MagicWandIcon } from "@radix-ui/react-icons"
import { CadViewer } from "@tscircuit/3d-viewer"
import { PCBViewer } from "@tscircuit/pcb-viewer"
import { ClipboardIcon } from "lucide-react"
import { useState } from "react"
import { useRunTsx } from "@/hooks/use-run-tsx"
import { ErrorTabContent } from "@/components/ErrorTabContent"

export const AiPage = () => {
  const [code, setCode] = useState("")
  const { message: errorMessage, circuitJson } = useRunTsx(code, "board", {
    isStreaming: true,
  })

  return (
    <div>
      <Header />
      <div className="flex bg-gray-100">
        <div className="w-1/2">
          <AIChatInterface
            code={code}
            onCodeChange={setCode}
            errorMessage={errorMessage}
          />
        </div>
        <div className="w-1/2">
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
                      {errorMessage && (
                        <span className="inline-flex items-center justify-center w-5 h-5 ml-2 text-xs font-bold text-white bg-red-500 rounded-full">
                          1
                        </span>
                      )}
                    </TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="code">
                  <div className="mt-4 bg-gray-50 rounded-md border border-gray-200">
                    <CodeEditor
                      code={code}
                      onCodeChange={setCode}
                      readOnly={false}
                    />
                  </div>
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
                  <ErrorTabContent code={code} errorMessage={errorMessage} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
