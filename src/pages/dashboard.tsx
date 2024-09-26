import React from "react"
import { useQuery } from "react-query"
import axios from "redaxios"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Snippet } from "fake-snippets-api/lib/db/schema"
import { Link } from "wouter"
import { CreateNewSnippetHero } from "@/components/CreateNewSnippetHero"

export const DashboardPage = () => {
  const {
    data: mySnippets,
    isLoading,
    error,
  } = useQuery<Snippet[]>("userSnippets", async () => {
    const currentUser = "seveibar"
    const response = await axios.get(
      `/api/snippets/list?author_name=${currentUser}`,
    )
    return response.data.snippets
  })

  const { data: trendingSnippets } = useQuery<Snippet[]>(
    "trendingSnippets",
    async () => {
      const response = await axios.get("/api/snippets/list_trending")
      return response.data.snippets
    },
  )

  const { data: newestSnippets } = useQuery<Snippet[]>(
    "newestSnippets",
    async () => {
      const response = await axios.get("/api/snippets/list_newest")
      return response.data.snippets
    },
  )

  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="flex">
          <div className="w-3/4 pr-8">
            <div className="mt-6 mb-8">
              <h2 className="text-sm font-bold mb-4 text-gray-700 border-b border-gray-200">
                Jump Back In
              </h2>
              {mySnippets &&
                mySnippets.slice(0, 3).map((snippet) => (
                  <div key={snippet.snippet_id} className="mb-2">
                    <Link
                      href={`/${snippet.full_snippet_name}`}
                      className="text-blue-600 hover:underline"
                    >
                      <span className="text-sm font-medium">
                        {snippet.snippet_name}
                      </span>
                    </Link>
                    <span className="text-xs text-gray-500 ml-2">
                      {new Date(snippet.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
            </div>
            <CreateNewSnippetHero />
            <h2 className="text-sm font-bold mb-4 text-gray-700 border-b border-gray-200">
              Your Snippets
            </h2>
            {isLoading && <div>Loading...</div>}
            {mySnippets && (
              <div className="space-y-4">
                {mySnippets.map((snippet) => (
                  <div
                    key={snippet.snippet_id}
                    className="border p-4 rounded-md"
                  >
                    <Link
                      href={`/${snippet.full_snippet_name}`}
                      className="text-blue-600 hover:underline"
                    >
                      <h3 className="text-lg font-semibold">
                        {snippet.snippet_name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500">
                      Created: {new Date(snippet.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="w-1/4">
            <h2 className="text-sm font-bold mb-2 text-gray-700 border-b border-gray-200">
              Trending Snippets
            </h2>
            {trendingSnippets && (
              <ul className="space-y-1">
                {trendingSnippets.map((snippet) => (
                  <li key={snippet.snippet_id}>
                    <Link
                      href={`/${snippet.full_snippet_name}`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      {snippet.full_snippet_name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <h2 className="text-sm font-bold mt-8 mb-2 text-gray-700 border-b border-gray-200">
              Newest Snippets
            </h2>
            {newestSnippets && (
              <ul className="space-y-1">
                {newestSnippets.map((snippet) => (
                  <li key={snippet.snippet_id}>
                    <Link
                      href={`/${snippet.full_snippet_name}`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      {snippet.full_snippet_name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
