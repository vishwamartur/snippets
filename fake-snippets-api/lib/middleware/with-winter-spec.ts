import { createWithWinterSpec } from "winterspec"
import { withDb } from "./with-db"
import { createWithDefaultExceptionHandling } from "winterspec/middleware"

export const withRouteSpec = createWithWinterSpec({
  apiName: "tscircuit Snippets API",
  productionServerUrl: "https://snippets.tscircuit.com/api",
  beforeAuthMiddleware: [],
  authMiddleware: {},
  afterAuthMiddleware: [
    withDb,
    createWithDefaultExceptionHandling({
      includeStackTraceInResponse: true,
    }),
  ],
})
