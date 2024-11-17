import { withRouteSpec } from "fake-snippets-api/lib/middleware/with-winter-spec";
import { z } from "zod";
import { snippetSchema } from "fake-snippets-api/lib/db/schema";

export default withRouteSpec({
  methods: ["GET"],
  jsonResponse: z.object({
    snippets: z.array(snippetSchema),
  }),
})(async (req, ctx) => {
  const newestSnippets = ctx.db.getNewestSnippets(20);
  return ctx.json({ snippets: newestSnippets });
});
