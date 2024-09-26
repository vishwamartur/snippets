import { getTestServer } from "fake-snippets-api/tests/fixtures/get-test-server"
import { test, expect } from "bun:test"

test("list newest snippets", async () => {
  const { axios, db } = await getTestServer()

  // Add some test snippets
  const snippets = [
    {
      snippet_name: "Snippet1",
      owner_name: "User1",
      content: "Content1",
      created_at: "2023-01-01T00:00:00Z",
      full_snippet_name: "User1/Snippet1",
    },
    {
      snippet_name: "Snippet2",
      owner_name: "User2",
      content: "Content2",
      created_at: "2023-01-02T00:00:00Z",
      full_snippet_name: "User2/Snippet2",
    },
    {
      snippet_name: "Snippet3",
      owner_name: "User3",
      content: "Content3",
      created_at: "2023-01-03T00:00:00Z",
      full_snippet_name: "User3/Snippet3",
    },
  ]

  for (const snippet of snippets) {
    db.addSnippet(snippet)
  }

  const { data } = await axios.get("/api/snippets/list_newest")

  expect(data.snippets).toHaveLength(3)
  expect(data.snippets[0].snippet_name).toBe("Snippet3")
  expect(data.snippets[1].snippet_name).toBe("Snippet2")
  expect(data.snippets[2].snippet_name).toBe("Snippet1")
})
