import { withRouteSpec } from "fake-snippets-api/lib/middleware/with-winter-spec"
import { z } from "zod"
import { convertCircuitJsonToSchematicSvg } from "circuit-to-svg"

export default withRouteSpec({
  methods: ["GET"],
  auth: "none",
  queryParams: z.object({
    snippet_id: z.string(),
    image_of: z.enum(["pcb"]),
    format: z.enum(["svg"]),
  }),
  jsonResponse: z.object({
    svg: z.string(),
  }),
})(async (req, ctx) => {
  const { snippet_id, image_of, format } = req.query

  const snippet = ctx.db.getSnippetById(snippet_id)
  if (!snippet) {
    return ctx.error(404, {
      error_code: "snippet_not_found",
      message: "Snippet not found",
    })
  }

  if (image_of !== "pcb" || format !== "svg") {
    return ctx.error(400, {
      error_code: "invalid_parameters",
      message: "Invalid image_of or format parameter",
    })
  }

  const svg = convertCircuitJsonToSchematicSvg(snippet.circuit_json)

  return ctx.json({
    svg,
  })
})
