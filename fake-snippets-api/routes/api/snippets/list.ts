import { withRouteSpec } from "fake-snippets-api/lib/middleware/with-winter-spec"
import { z } from "zod"
import { snippetSchema } from "fake-snippets-api/lib/db/schema"

export default withRouteSpec({
  methods: ["GET"],
  commonParams: z.object({
    author_name: z.string().optional(),
  }),
  jsonBody: z.any().optional(),
  jsonResponse: z.object({
    snippets: z.array(snippetSchema),
  }),
})(async (req, ctx) => {
  const author_name = req.commonParams.author_name
  const snippets = ctx.db.getSnippetsByAuthor(author_name)
  return ctx.json({ snippets })
})
