import { TypeBadge } from "@/components/TypeBadge"
import { Button } from "@/components/ui/button"
import { useAxios } from "@/hooks/use-axios"
import { useCurrentSnippet } from "@/hooks/use-current-snippet"
import { useGlobalStore } from "@/hooks/use-global-store"
import { toast, useToast } from "@/hooks/use-toast"
import { Snippet } from "fake-snippets-api/lib/db/schema"
import { ChevronLeft, Eye, GitFork, Star } from "lucide-react"
import { useEffect, useState } from "react"
import { useMutation, useQueryClient } from "react-query"
import { Link } from "wouter"
import { navigate } from "wouter/use-browser-location"

export default function ViewSnippetHeader() {
  const { snippet } = useCurrentSnippet()
  const axios = useAxios()
  const qc = useQueryClient()

  const useForkSnippetMutation = ({
    snippet,
    onSuccess,
  }: {
    snippet: Snippet
    onSuccess?: (forkedSnippet: Snippet) => void
  }) => {
    const axios = useAxios()
    const session = useGlobalStore((s) => s.session)

    return useMutation(
      ["createForkSnippet"],
      async () => {
        if (!session) throw new Error("No session")
        if (!snippet) throw new Error("No snippet to fork")

        const { data } = await axios.post("/snippets/create", {
          unscoped_name: snippet.unscoped_name,
          snippet_type: snippet.snippet_type,
          owner_name: session.github_username,
          code: snippet.code,
        })
        return data.snippet
      },
      {
        onSuccess: (forkedSnippet: Snippet) => {
          toast({
            title: `Forked snippet`,
            description: `You have successfully forked the snippet. Redirecting...`,
          })
          onSuccess?.(forkedSnippet)
        },
        onError: (error: any) => {
          console.error("Error forking snippet:", error)
        },
      },
    )
  }

  const { mutate: forkSnippet, isLoading: isForking } = useForkSnippetMutation({
    snippet: snippet!,
    onSuccess: (forkedSnippet) => {
      navigate("/editor?snippet_id=" + forkedSnippet.snippet_id)
    },
  })

  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-bold mr-2">
            <Link href={`/${snippet?.owner_name}`} className="text-blue-600">
              {snippet?.owner_name}
            </Link>
            <span className="px-1 text-gray-500">/</span>
            <Link
              className="text-blue-600"
              href={`/${snippet?.owner_name}/${snippet?.unscoped_name}`}
            >
              {snippet?.unscoped_name}
            </Link>
          </h1>
          {snippet?.snippet_type && <TypeBadge type={snippet.snippet_type} />}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              try {
                await axios.post("/snippets/add_star", {
                  snippet_id: snippet!.snippet_id,
                })
                toast({
                  title: "Starred!",
                  description: "You've starred this snippet",
                })
                qc.invalidateQueries(["snippets", snippet!.snippet_id])
              } catch (error: any) {
                if (error?.status === 400) {
                  toast({
                    title: "Already starred",
                    description: "You've already starred this snippet",
                    variant: "destructive",
                  })
                } else {
                  toast({
                    title: "Error",
                    description: "Failed to star snippet",
                    variant: "destructive",
                  })
                }
              }
            }}
          >
            <Star className="w-4 h-4 mr-2" />
            Star{" "}
            {snippet!.star_count > 0 && (
              <span className="ml-1.5 bg-gray-100 text-gray-700 rounded-full px-1.5 py-0.5 text-xs font-medium">
                {snippet!.star_count}
              </span>
            )}
          </Button>
          {/* <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Watch
          </Button> */}

          <Button variant="outline" size="sm" onClick={() => forkSnippet()}>
            <GitFork className="w-4 h-4 mr-2" />
            Fork
          </Button>
        </div>
      </div>
      {/* <div className="mt-4 flex justify-end items-center text-sm text-gray-500">
        <span className="mr-4">Last updated: 2 days ago</span>
        <span>Version: 1.0.0</span>
      </div> */}
    </header>
  )
}
