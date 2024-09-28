import { getTestServer } from "fake-snippets-api/tests/fixtures/get-test-server"
import { test, expect } from "bun:test"

test("update snippet", async () => {
  const { axios, db } = await getTestServer()

  // Add a test snippet
  const snippet = {
    snippet_name: "TestSnippet",
    owner_name: "TestUser",
    content: "Original Content",
    created_at: "2023-01-01T00:00:00Z",
    full_snippet_name: "TestUser/TestSnippet",
  }
  db.addSnippet(snippet)

  const addedSnippet = db.snippets[0]

  // Update the snippet
  const updatedContent = "Updated Content"
  const response = await axios.post("/api/snippets/update", {
    snippet_id: addedSnippet.snippet_id,
    content: updatedContent,
  })

  expect(response.status).toBe(200)
  expect(response.data.snippet.content).toBe(updatedContent)
  expect(response.data.snippet.updated_at).not.toBe(addedSnippet.created_at)

  // Verify the snippet was updated in the database
  const updatedSnippet = db.snippets[0]
  expect(updatedSnippet.content).toBe(updatedContent)
  expect(updatedSnippet.updated_at).not.toBe(updatedSnippet.created_at)
})

test.skip("update non-existent snippet", async () => {
  const { axios } = await getTestServer()

  try {
    await axios.post("/api/snippets/update", {
      snippet_id: "non-existent-id",
      content: "Updated Content",
    })
    // If the request doesn't throw an error, fail the test
    expect(true).toBe(false)
  } catch (error: any) {
    expect(error.response.status).toBe(404)
    expect(error.response.data.error.message).toBe("Snippet not found")
  }
})
