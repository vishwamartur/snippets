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
    data: snippets,
    isLoading,
    error,
  } = useQuery<Snippet[]>("userSnippets", async () => {
    const currentUser = "seveibar"
    const response = await axios.get(
      `/api/snippets/list?author_name=${currentUser}`,
    )
    return response.data.snippets
  })

  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <CreateNewSnippetHero />
        <h2 className="text-sm font-bold mb-4 text-gray-700 border-b border-gray-200">
          Your Snippets
        </h2>
        {isLoading && <div>Loading...</div>}
        {snippets && (
          <div className="space-y-4">
            {snippets.map((snippet) => (
              <div key={snippet.snippet_id} className="border p-4 rounded-md">
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
      <Footer />
    </div>
  )
}
