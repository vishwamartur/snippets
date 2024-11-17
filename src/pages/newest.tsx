import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { LatestSnippets } from "@/components/LatestSnippets"

export const NewestPage = () => {
  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Newest Snippets</h1>
        <LatestSnippets />
      </div>
      <Footer />
    </div>
  )
}
