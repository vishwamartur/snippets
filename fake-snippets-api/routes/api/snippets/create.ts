import { withRouteSpec } from "fake-snippets-api/lib/middleware/with-winter-spec"
import { z } from "zod"
import { snippetSchema } from "fake-snippets-api/lib/db/schema"

export default withRouteSpec({
  methods: ["POST"],
  jsonBody: z.object({
    snippet_name: z.string().optional(),
    owner_name: z.string(),
    content: z.string(),
  }),
  jsonResponse: z.object({
    snippet: snippetSchema,
  }),
})(async (req, ctx) => {
  const { content } = req.jsonBody

  const snippet_name =
    req.jsonBody.snippet_name || `untitled-snippet-${ctx.db.idCounter + 1}`

  const currentTime = new Date().toISOString()
  const newSnippet = {
    snippet_id: `snippet_${ctx.db.idCounter + 1}`,
    snippet_name,
    owner_name: req.jsonBody.owner_name,
    full_snippet_name: `${req.jsonBody.owner_name}/${snippet_name}`,
    content,
    created_at: currentTime,
    updated_at: currentTime,
  }

  ctx.db.addSnippet(newSnippet)

  return ctx.json({ snippet: newSnippet })
})
