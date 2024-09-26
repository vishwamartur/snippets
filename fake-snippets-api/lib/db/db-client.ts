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

const initializer = combine(databaseSchema.parse({}), (set) => ({
  // addThing: (thing: Omit<Thing, "thing_id">) => {
  //   set((state) => ({
  //     things: [
  //        ...state.things, { thing_id: state.idCounter + 1, ...thing }
  //     ],
  //     idCounter: state.idCounter + 1,
  //   }))
  // },
  addSnippet: (snippet: Omit<Snippet, "snippet_id">) => {
    set((state) => {
      const newSnippetId = `snippet_${state.idCounter + 1}`
      return {
        snippets: [...state.snippets, { snippet_id: newSnippetId, ...snippet }],
        idCounter: state.idCounter + 1,
      }
    })
  },
}))
