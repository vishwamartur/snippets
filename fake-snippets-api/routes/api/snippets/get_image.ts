import { snippetSchema } from "fake-snippets-api/lib/db/schema"
import { withRouteSpec } from "fake-snippets-api/lib/middleware/with-winter-spec"
import { z } from "zod"
import { convertCircuitJsonToSchematicSvg } from "circuit-to-svg"
import { convertCircuitJsonToPcbSvg } from "circuit-to-svg"

export default withRouteSpec({
  methods: ["GET"],
  auth: "none",
  queryParams: z.object({
    snippet_id: z.string(),
    image_of: z.enum(["schematic", "pcb"]),
    format: z.enum(["svg"]),
  }),
  jsonResponse: z.string(),
})(async (req, ctx) => {
  const { snippet_id, image_of, format } = req.queryParams

  const snippet = ctx.db.snippets.find((s) => s.snippet_id === snippet_id)

  if (!snippet) {
    return ctx.error(404, {
      error_code: "snippet_not_found",
      message: "Snippet not found",
    })
  }

  if (!snippet.circuit_json) {
    return ctx.error(400, {
      error_code: "no_circuit_json",
      message: "Snippet does not contain circuit JSON",
    })
  }

  if (image_of === "schematic" && format === "svg") {
    const svg = convertCircuitJsonToSchematicSvg(snippet.circuit_json)
    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
      },
    })
  }

  if (image_of === "pcb" && format === "svg") {
    const svg = convertCircuitJsonToPcbSvg(snippet.circuit_json)
    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
      },
    })
  }

  return ctx.error(400, {
    error_code: "invalid_parameters",
    message: "Invalid image_of or format parameter",
  })
})

export const config = {
  api: {
    bodyParser: false,
  },
  async rewrites() {
    return [
      {
        source: "/snippets/images/:author/:snippet_name/pcb.svg",
        destination: "/api/snippets/get_image?snippet_id=:snippet_id&image_of=pcb&format=svg",
      },
      {
        source: "/snippets/images/:author/:snippet_name/schematic.svg",
        destination: "/api/snippets/get_image?snippet_id=:snippet_id&image_of=schematic&format=svg",
      },
    ]
  },
}
