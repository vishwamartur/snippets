import { createStore, type StoreApi } from "zustand/vanilla"
import { immer } from "zustand/middleware/immer"
import { hoist, type HoistedStoreApi } from "zustand-hoist"

import {
  databaseSchema,
  Snippet,
  type DatabaseSchema,
  type Thing,
} from "./schema.ts"
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
  updateSnippet: (snippet_id: string, content: string, updated_at: string) => {
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
        content: content,
        updated_at: updated_at,
      }
      return { ...state, snippets: updatedSnippets }
    })
  },
  getSnippetById: (snippet_id: string): Snippet | undefined => {
    const state = get()
    return state.snippets.find((snippet) => snippet.snippet_id === snippet_id)
  },
}))
