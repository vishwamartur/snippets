import { withRouteSpec } from "fake-snippets-api/lib/middleware/with-winter-spec"
import { z } from "zod"
import { snippetSchema } from "fake-snippets-api/lib/db/schema"

export default withRouteSpec({
  methods: ["POST", "PUT"],
  jsonBody: z.object({
    snippet_id: z.string(),
    content: z.string(),
    snippet_name: z.string().optional(),
    is_board: z.boolean().optional(),
    is_package: z.boolean().optional(),
    is_model: z.boolean().optional(),
    is_footprint: z.boolean().optional(),
  }),
  jsonResponse: z.object({
    snippet: snippetSchema,
  }),
})(async (req, ctx) => {
  const {
    content,
    snippet_name,
    snippet_id,
    is_board,
    is_package,
    is_model,
    is_footprint,
  } = req.jsonBody

  ctx.db.updateSnippet(snippet_id, content, new Date().toISOString(), {
    is_board,
    is_package,
    is_model: is_model,
    is_footprint,
    snippet_name,
  })

  return ctx.json({ snippet: ctx.db.getSnippetById(snippet_id)! })
})
