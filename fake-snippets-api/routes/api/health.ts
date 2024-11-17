import { withRouteSpec } from "fake-snippets-api/lib/middleware/with-winter-spec";
import { z } from "zod";

export default withRouteSpec({
  methods: ["GET"],
  jsonResponse: z.object({ ok: z.boolean() }),
})(async (req: any, ctx: any) => {
  return ctx.json({ ok: true });
});
