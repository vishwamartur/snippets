import { withRouteSpec } from "fake-snippets-api/lib/middleware/with-winter-spec"
import { z } from "zod"

export default withRouteSpec({
  methods: ["GET"],
  auth: "none",
  commonParams: z.object({
    jsdelivr_path: z.string(),
  }),
})(async (req, ctx) => {
  const { jsdelivr_path } = req.commonParams

  // Parse the file path
  const [owner, packageWithVersion, fileName] = jsdelivr_path.split("/")
  const [packageName, version] = packageWithVersion.split("@")

  // Find the snippet
  const snippet = ctx.db.snippets.find(
    (s) => s.owner_name === owner && s.unscoped_name === packageName,
  )

  if (!snippet) {
    return ctx.error(404, {
      error_code: "snippet_not_found",
      message: "Snippet not found",
    })
  }

  let content: string
  switch (fileName) {
    case "index.ts":
      content = snippet.code
      break
    case "index.d.ts":
      content = snippet.dts || ""
      break
    case "package.json":
      content = JSON.stringify(
        {
          name: `@tsci/${owner}.${packageName}`,
          version: version || "0.0.1",
          main: "index.ts",
          types: "index.d.ts",
        },
        null,
        2,
      )
      break
    default:
      return ctx.error(404, {
        error_code: "file_not_found",
        message: "Requested file not found",
      })
  }

  return ctx.json({ content })
})
