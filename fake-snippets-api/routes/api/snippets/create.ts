import { withRouteSpec } from "fake-snippets-api/lib/middleware/with-winter-spec"
import { z } from "zod"
import { snippetSchema } from "fake-snippets-api/lib/db/schema"

export default withRouteSpec({
  methods: ["POST"],
  auth: "session",
  jsonBody: z.object({
    unscoped_name: z.string(),
    code: z.string().optional(),
    type: z.enum(["board", "package", "model", "footprint"]),
    description: z.string().optional(),
  }),
  jsonResponse: z.object({
    ok: z.boolean(),
    snippet: snippetSchema,
  }),
})(async (req, ctx) => {
  const { unscoped_name, code = "", type, description = "" } = req.jsonBody
  const newSnippet = {
    snippet_id: `snippet_${ctx.db.idCounter + 1}`,
    name: `${ctx.auth.github_username}/${unscoped_name}`,
    unscoped_name,
    owner_name: ctx.auth.github_username,
    code,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    type,
    description,
  }

  ctx.db.addSnippet(newSnippet)

  return ctx.json({
    ok: true,
    snippet: newSnippet,
  })
})
