import { CodeAndPreview } from "@/components/CodeAndPreview"
import Header from "@/components/Header"
import { useEffect } from "react"
import { useCurrentSnippetId } from "@/hooks/use-current-snippet-id"
import { useSnippet } from "./hooks/use-snippet"
import { ContextProviders } from "./ContextProviders"
import { EditorPage } from "./pages/editor"
import { DashboardPage } from "./pages/dashboard"
import { ViewSnippetPage } from "./pages/view-snippet"
import { LandingPage } from "./pages/landing"
import { Route, Switch } from "wouter"
import { AiPage } from "./pages/ai"

function App() {
  return (
    <ContextProviders>
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/editor" component={EditorPage} />
        <Route path="/dashboard" component={DashboardPage} />
        <Route path="/ai" component={AiPage} />
        <Route path="/:snippetName*" component={ViewSnippetPage} />
      </Switch>
    </ContextProviders>
  )
}

export default App
