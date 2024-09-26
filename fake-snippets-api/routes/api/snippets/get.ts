import { withRouteSpec } from "fake-snippets-api/lib/middleware/with-winter-spec"
import { z } from "zod"
import { snippetSchema } from "fake-snippets-api/lib/db/schema"

export default withRouteSpec({
  methods: ["GET", "POST"],
  commonParams: z.object({
    snippet_id: z.string().optional(),
    full_snippet_name: z.string().optional(),
  }),
  jsonBody: z.any().optional(),
  jsonResponse: z.object({
    snippet: snippetSchema,
  }),
})(async (req, ctx) => {
  const { snippet_id, full_snippet_name } = req.commonParams

  const snippet = ctx.db.snippets.find(
    (snippet) =>
      snippet.snippet_id === snippet_id ||
      snippet.full_snippet_name === full_snippet_name,
  )

  if (!snippet) {
    return ctx.json(
      {
        error: {
          message: "Snippet not found",
        },
      } as any,
      { status: 404 },
    )
  }

  return ctx.json({ snippet })
})
