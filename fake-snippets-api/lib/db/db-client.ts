import { createStore, type StoreApi } from "zustand/vanilla"
import { immer } from "zustand/middleware/immer"
import { hoist, type HoistedStoreApi } from "zustand-hoist"

import { databaseSchema, Snippet, type DatabaseSchema } from "./schema.ts"
import { combine } from "zustand/middleware"

export const createDatabase = () => {
  return hoist(createStore(initializer))
}

export type DbClient = ReturnType<typeof createDatabase>

const initializer = combine(databaseSchema.parse({}), (set, get) => ({
  addSnippet: (snippet: Omit<Snippet, "snippet_id">) => {
    set((state) => {
      const newSnippetId = `snippet_${state.idCounter + 1}`
      return {
        snippets: [...state.snippets, { snippet_id: newSnippetId, ...snippet }],
        idCounter: state.idCounter + 1,
      }
    })
  },
  getNewestSnippets: (limit: number): Snippet[] => {
    const state = get()
    return [...state.snippets]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      .slice(0, limit)
  },
  getSnippetsByAuthor: (authorName?: string): Snippet[] => {
    const state = get()
    if (authorName) {
      return state.snippets.filter(
        (snippet) => snippet.owner_name === authorName,
      )
    }
    return state.snippets
  },
  updateSnippet: (
    snippet_id: string,
    code: string,
    updated_at: string,
    options?: {
      is_board?: boolean
      is_package?: boolean
      is_model?: boolean
      is_footprint?: boolean
      snippet_name?: string
    },
  ) => {
    set((state) => {
      const snippetIndex = state.snippets.findIndex(
        (snippet) => snippet.snippet_id === snippet_id,
      )
      if (snippetIndex === -1) {
        return state
      }
      const updatedSnippets = [...state.snippets]
      updatedSnippets[snippetIndex] = {
        ...updatedSnippets[snippetIndex],
        code: code,
        updated_at: updated_at,
        ...(options?.is_board !== undefined && { is_board: options.is_board }),
        ...(options?.is_package !== undefined && {
          is_package: options.is_package,
        }),
        ...(options?.is_model !== undefined && {
          is_model: options.is_model,
        }),
        ...(options?.is_footprint !== undefined && {
          is_footprint: options.is_footprint,
        }),
        ...(options?.snippet_name && { snippet_name: options.snippet_name }),
      }
      return { ...state, snippets: updatedSnippets }
    })
  },
  getSnippetById: (snippet_id: string): Snippet | undefined => {
    const state = get()
    return state.snippets.find((snippet) => snippet.snippet_id === snippet_id)
  },
}))
