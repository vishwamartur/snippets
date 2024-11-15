import { describe, expect, it } from "bun:test";
import { getTestServer } from "../../fixtures/get-test-server";

describe("/snippets/get_image", () => {
  it("should return SVG image for valid snippet_id, image_of, and format", async () => {
    const { axios, seed } = await getTestServer();

    const snippet = seed.snippet;
    const response = await axios.get("/snippets/get_image", {
      params: {
        snippet_id: snippet.snippet_id,
        image_of: "pcb",
        format: "svg",
      },
    });

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty("svg");
    expect(response.data.svg).toContain("<svg");
  });

  it("should return 404 for invalid snippet_id", async () => {
    const { axios } = await getTestServer();

    const response = await axios.get("/snippets/get_image", {
      params: {
        snippet_id: "invalid_snippet_id",
        image_of: "pcb",
        format: "svg",
      },
    });

    expect(response.status).toBe(404);
  });

  it("should return 400 for invalid image_of or format", async () => {
    const { axios, seed } = await getTestServer();

    const snippet = seed.snippet;
    const response = await axios.get("/snippets/get_image", {
      params: {
        snippet_id: snippet.snippet_id,
        image_of: "invalid_image_of",
        format: "svg",
      },
    });

    expect(response.status).toBe(400);
  });
});
