import React from "react"
import { useQuery } from "react-query"
import axios from "redaxios"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Snippet } from "fake-snippets-api/lib/db/schema"
import { Link } from "wouter"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const StartEditorPage = () => {
  const { data: mySnippets, isLoading } = useQuery<Snippet[]>(
    "userSnippets",
    async () => {
      const currentUser = "seveibar"
      const response = await axios.get(
        `/api/snippets/list?author_name=${currentUser}`,
      )
      return response.data.snippets
    },
  )

  const blankTemplates = [
    { name: "Blank Circuit Board", type: "BOARD", color: "blue" },
    { name: "Blank Circuit Module", type: "PACKAGE", color: "green" },
    { name: "Blank 3D Model", type: "MODEL", color: "indigo" },
    { name: "Blank Footprint", type: "FOOTPRINT", color: "purple" },
  ]

  const templates = [
    { name: "Blinking LED Board", type: "BOARD", color: "blue" },
  ]

  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Start a New Project</h1>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Recent Snippets</h2>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {mySnippets?.slice(0, 6).map((snippet) => (
                <Link
                  key={snippet.snippet_id}
                  href={`/editor?snippet_id=${snippet.snippet_id}`}
                >
                  <Card className="hover:shadow-md transition-shadow rounded-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md">
                        {snippet.snippet_name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500">
                        Last edited:{" "}
                        {new Date(snippet.updated_at).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Start Blank Snippet</h2>
          <div className="grid grid-cols-4 gap-4">
            {blankTemplates.map((template, index) => (
              <Link
                key={index}
                href={`/editor?template=${template.name.toLowerCase().replace(/ /g, "-")}`}
              >
                <Card className="hover:shadow-md transition-shadow rounded-md h-full flex flex-col">
                  <CardHeader className="p-4 flex-grow flex flex-col justify-between">
                    <CardTitle className="text-md">{template.name}</CardTitle>
                    <div className="mt-2 flex">
                      <span
                        className={`bg-${template.color}-500 text-white px-2 py-1 rounded text-xs`}
                      >
                        {template.type}
                      </span>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Start from a Template</h2>
          <div className="grid grid-cols-3 gap-4">
            {templates.map((template, index) => (
              <Link
                key={index}
                href={`/editor?template=${template.name.toLowerCase().replace(/ /g, "-")}`}
              >
                <Card className="hover:shadow-md transition-shadow rounded-md">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      {template.name}
                      <span
                        className={`ml-2 bg-${template.color}-500 text-white px-2 py-1 rounded text-xs`}
                      >
                        {template.type}
                      </span>
                    </CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
