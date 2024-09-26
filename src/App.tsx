import { CodeAndPreview } from "@/components/CodeAndPreview"
import Header from "@/components/Header"
import { useEffect } from "react"

function App() {
  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch("/api/health")
        .then((r) => r.json())
        .catch((e) => null)
      console.log("response", res)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div>
      <Header />
      <CodeAndPreview />
    </div>
  )
}

export default App
