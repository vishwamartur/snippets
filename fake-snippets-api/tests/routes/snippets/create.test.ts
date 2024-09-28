import { getTestServer } from "fake-snippets-api/tests/fixtures/get-test-server"
import { test, expect } from "bun:test"

test("create snippet", async () => {
  const { axios } = await getTestServer()

  const response = await axios.post("/api/snippets/create", {
    snippet_name: "TestSnippet",
    owner_name: "TestUser",
    content: "Test Content",
    is_package: true,
  })

  expect(response.status).toBe(200)
  expect(response.data.snippet.snippet_name).toBe("TestSnippet")
  expect(response.data.snippet.owner_name).toBe("TestUser")
  expect(response.data.snippet.content).toBe("Test Content")
  expect(response.data.snippet.is_board).toBe(false)
  expect(response.data.snippet.is_package).toBe(true)
  expect(response.data.snippet.is_model).toBe(false)
  expect(response.data.snippet.is_footprint).toBe(false)
  expect(response.data.snippet.type).toBe("package")
})
