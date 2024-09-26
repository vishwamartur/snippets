import { withRouteSpec } from "fake-snippets-api/lib/middleware/with-winter-spec"
import { z } from "zod"
import { snippetSchema } from "fake-snippets-api/lib/db/schema"

export default withRouteSpec({
  methods: ["POST", "PUT"],
  jsonBody: z.object({
    snippet_id: z.string(),
    content: z.string(),
    snippet_name: z.string().optional(),
  }),
  jsonResponse: z.object({
    snippet: snippetSchema,
  }),
})(async (req, ctx) => {
  const { content, snippet_name, snippet_id } = req.jsonBody

  ctx.db.updateSnippet(snippet_id, content)

  return ctx.json({ snippet: ctx.db.getSnippetById(snippet_id)! })
})
