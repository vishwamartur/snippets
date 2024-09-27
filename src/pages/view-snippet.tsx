import Header from "@/components/Header"
import ViewSnippetSidebar from "@/components/ViewSnippetSidebar"
import { useParams } from "wouter"

export const ViewSnippetPage = () => {
  const { author, snippetName } = useParams()
  return (
    <div>
      <Header />
      <div>
        <h1>
          Viewing snippet {author}/{snippetName}
        </h1>
        <ViewSnippetSidebar />
      </div>
    </div>
  )
}
