import { Toaster } from "@/components/ui/toaster"
import { Route, Switch } from "wouter"
import "./components/CmdKMenu"
import { ContextProviders } from "./ContextProviders"
import { AiPage } from "./pages/ai"
import AuthenticatePage from "./pages/authorize"
import { DashboardPage } from "./pages/dashboard"
import { EditorPage } from "./pages/editor"
import { LandingPage } from "./pages/landing"
import { MyOrdersPage } from "./pages/my-orders"
import { NewestPage } from "./pages/newest"
import { PreviewPage } from "./pages/preview"
import { QuickstartPage } from "./pages/quickstart"
import { SearchPage } from "./pages/search"
import { SettingsPage } from "./pages/settings"
import { UserProfilePage } from "./pages/user-profile"
import { ViewOrderPage } from "./pages/view-order"
import { ViewSnippetPage } from "./pages/view-snippet"

function App() {
  return (
    <ContextProviders>
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/editor" component={EditorPage} />
        <Route path="/quickstart" component={QuickstartPage} />
        <Route path="/dashboard" component={DashboardPage} />
        <Route path="/ai" component={AiPage} />
        <Route path="/newest" component={NewestPage} />
        <Route path="/settings" component={SettingsPage} />
        <Route path="/search" component={SearchPage} />
        <Route path="/authorize" component={AuthenticatePage} />
        <Route path="/my-orders" component={MyOrdersPage} />
        <Route path="/orders/:orderId" component={ViewOrderPage} />
        <Route path="/preview" component={PreviewPage} />
        <Route path="/:username" component={UserProfilePage} />
        <Route path="/:author/:snippetName" component={ViewSnippetPage} />
      </Switch>
      <Toaster />
    </ContextProviders>
  )
}

export default App
