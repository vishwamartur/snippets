import { afterEach } from "bun:test"
import { tmpdir } from "node:os"
import defaultAxios from "redaxios"
import { startServer } from "./start-server"
import { DbClient } from "fake-snippets-api/lib/db/db-client"

interface TestFixture {
  url: string
  server: any
  axios: typeof defaultAxios
  db: DbClient
  seed: ReturnType<typeof seedDatabase>
}

export const getTestServer = async (): Promise<TestFixture> => {
  const port = 3001 + Math.floor(Math.random() * 999)
  const testInstanceId = Math.random().toString(36).substring(2, 15)
  const testDbName = `testdb${testInstanceId}`

  const { server, db } = await startServer({
    port,
    testDbName,
  })

  const url = `http://127.0.0.1:${port}`
  const seed = seedDatabase(db)
  const axios = defaultAxios.create({
    baseURL: url,
    headers: {
      Authorization: `Bearer ${seed.account.account_id}`,
    },
  })

  afterEach(async () => {
    if (server && typeof server.stop === "function") {
      await server.stop()
    }
    // Here you might want to add logic to drop the test database
  })

  return {
    url,
    server,
    axios,
    db,
    seed,
  }
}

const seedDatabase = (db: DbClient) => {
  const account = db.addAccount({
    github_username: "testuser",
    shippingInfo: {
      firstName: "Test",
      lastName: "User",
      companyName: "Test Company",
      address: "123 Test St",
      apartment: "Apt 4B",
      city: "Testville",
      state: "NY",
      zipCode: "10001",
      country: "United States of America",
      phone: "555-123-4567",
    },
  })
  const order = db.addOrder({
    account_id: account.account_id,
    is_draft: true,
    is_pending_validation_by_fab: false,
    is_pending_review_by_fab: false,
    is_validated_by_fab: false,
    is_approved_by_fab_review: false,
    is_approved_by_orderer: false,
    is_in_production: false,
    is_shipped: false,
    is_cancelled: false,
    should_be_blank_pcb: false,
    should_include_stencil: false,
    jlcpcb_order_params: {},
    circuit_json: [
      {
        type: "source_component",
        ftype: "simple_resistor",
        source_component_id: "source_component_1",
        name: "R1",
        resistance: "1k",
      },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })

  const snippet = db.addSnippet({
    unscoped_name: "TestSnippet",
    owner_name: "testuser",
    code: "Test Content",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
    name: "testuser/TestSnippet",
    snippet_type: "package",
    description: "Test Description",
  })

  return { account, order, snippet }
}
