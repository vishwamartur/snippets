import { withRouteSpec } from "fake-snippets-api/lib/middleware/with-winter-spec"
import { z } from "zod"
import { snippetSchema } from "fake-snippets-api/lib/db/schema"

export default withRouteSpec({
  methods: ["POST"],
  jsonBody: z.object({
    snippet_name: z.string().optional(),
    owner_name: z.string(),
    content: z.string(),
    is_board: z.boolean().optional(),
    is_package: z.boolean().optional(),
    is_3d_model: z.boolean().optional(),
    is_footprint: z.boolean().optional(),
  }),
  jsonResponse: z.object({
    snippet: snippetSchema,
  }),
})(async (req, ctx) => {
  const { content, is_board, is_package, is_3d_model, is_footprint } = req.jsonBody

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
    is_board: is_board ?? (!(is_package || is_3d_model || is_footprint) ?? true),
    is_package: is_package ?? false,
    is_3d_model: is_3d_model ?? false,
    is_footprint: is_footprint ?? false,
  }

  ctx.db.addSnippet(newSnippet)

  return ctx.json({ snippet: newSnippet })
})
