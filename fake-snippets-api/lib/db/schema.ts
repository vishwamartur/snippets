import { z } from "zod"

export const snippetSchema = z.object({
  snippet_id: z.string(),
  full_snippet_name: z.string(),
  snippet_name: z.string(),
  owner_name: z.string(),
  content: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
})
export type Snippet = z.infer<typeof snippetSchema>

export const databaseSchema = z.object({
  idCounter: z.number().default(0),
  snippets: z.array(snippetSchema).default([]),
})
export type DatabaseSchema = z.infer<typeof databaseSchema>
