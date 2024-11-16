import { getTestServer } from "bun-tests/fake-snippets-api/fixtures/get-test-server"
import { test, expect } from "bun:test"

test("get image of PCB in SVG format", async () => {
  const { axios, db } = await getTestServer()

  // Add a test snippet with circuit_json
  const snippet = {
    snippet_id: "test_snippet_id",
    unscoped_name: "TestSnippet",
    owner_name: "testuser",
    code: "Test Content",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
    name: "testuser/TestSnippet",
    snippet_type: "package",
    description: "Test Description",
    compiled_js: null,
    circuit_json: [
      {
        type: "source_component",
        ftype: "simple_resistor",
        source_component_id: "source_component_1",
        name: "R1",
        resistance: "1k",
      },
    ],
  }
  db.addSnippet(snippet as any)

  const response = await axios.get(
    "/api/snippets/get_image?snippet_id=test_snippet_id&image_of=pcb&format=svg",
  )

  expect(response.status).toBe(200)
  expect(response.headers["content-type"]).toBe("image/svg+xml")
  expect(response.data).toContain("<svg")
})

test("get image of PCB in SVG format using alias", async () => {
  const { axios, db } = await getTestServer()

  // Add a test snippet with circuit_json
  const snippet = {
    snippet_id: "test_snippet_id",
    unscoped_name: "TestSnippet",
    owner_name: "testuser",
    code: "Test Content",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
    name: "testuser/TestSnippet",
    snippet_type: "package",
    description: "Test Description",
    compiled_js: null,
    circuit_json: [
      {
        type: "source_component",
        ftype: "simple_resistor",
        source_component_id: "source_component_1",
        name: "R1",
        resistance: "1k",
      },
    ],
  }
  db.addSnippet(snippet as any)

  const response = await axios.get(
    "/snippets/images/testuser/TestSnippet/pcb.svg",
  )

  expect(response.status).toBe(200)
  expect(response.headers["content-type"]).toBe("image/svg+xml")
  expect(response.data).toContain("<svg")
})
