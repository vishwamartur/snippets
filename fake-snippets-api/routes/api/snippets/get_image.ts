import { withRouteSpec } from "fake-snippets-api/lib/middleware/with-winter-spec"
import { z } from "zod"
import { convertCircuitJsonToSchematicSvg, convertCircuitJsonToPcbSvg } from "circuit-to-svg"

export default withRouteSpec({
  methods: ["GET"],
  auth: "none",
  queryParams: z.object({
    snippet_id: z.string(),
    image_of: z.enum(["pcb", "schematic"]),
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

  if (format !== "svg") {
    return ctx.error(400, {
      error_code: "invalid_parameters",
      message: "Invalid format parameter",
    })
  }

  let svg
  if (image_of === "pcb") {
    svg = convertCircuitJsonToPcbSvg(snippet.circuit_json)
  } else if (image_of === "schematic") {
    svg = convertCircuitJsonToSchematicSvg(snippet.circuit_json)
  } else {
    return ctx.error(400, {
      error_code: "invalid_parameters",
      message: "Invalid image_of parameter",
    })
  }

  return ctx.json({
    svg,
  })
})
