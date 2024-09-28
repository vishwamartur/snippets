import { getTestServer } from "fake-snippets-api/tests/fixtures/get-test-server"
import { test, expect } from "bun:test"

test("list snippets", async () => {
  const { axios, db } = await getTestServer()

  // Add some test snippets
  const snippets = [
    {
      snippet_name: "Snippet1",
      owner_name: "User1",
      content: "Content1",
      created_at: "2023-01-01T00:00:00Z",
      updated_at: "2023-01-01T00:00:00Z",
      full_snippet_name: "User1/Snippet1",
    },
    {
      snippet_name: "Snippet2",
      owner_name: "User2",
      content: "Content2",
      created_at: "2023-01-02T00:00:00Z",
      updated_at: "2023-01-02T00:00:00Z",
      full_snippet_name: "User2/Snippet2",
    },
    {
      snippet_name: "Snippet3",
      owner_name: "User1",
      content: "Content3",
      created_at: "2023-01-03T00:00:00Z",
      updated_at: "2023-01-03T00:00:00Z",
      full_snippet_name: "User1/Snippet3",
    },
  ]

  for (const snippet of snippets) {
    db.addSnippet(snippet)
  }

  // Test without author_name parameter
  const { data: allData } = await axios.get("/api/snippets/list")
  expect(allData.snippets).toHaveLength(3)

  // Test with author_name parameter
  const { data: user1Data } = await axios.get("/api/snippets/list", {
    params: { author_name: "User1" },
  })
  expect(user1Data.snippets).toHaveLength(2)
  expect(
    user1Data.snippets.every(
      (snippet: { owner_name: string }) => snippet.owner_name === "User1",
    ),
  ).toBe(true)

  // Test with non-existent author
  const { data: nonExistentData } = await axios.get("/api/snippets/list", {
    params: { author_name: "NonExistentUser" },
  })
  expect(nonExistentData.snippets).toHaveLength(0)
})
