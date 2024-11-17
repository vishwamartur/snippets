import { test, expect } from "@playwright/test"
import { viewports } from "./viewports"

for (const [size, viewport] of Object.entries(viewports)) {
  test(`view-snippet Page on ${size} screen`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.goto("http://127.0.0.1:5177/testuser/my-test-board")

    await page.waitForSelector(".run-button")
    await expect(page).toHaveScreenshot(`view-snippet-before-${size}.png`)
    await page.click(".run-button")
    await page.waitForTimeout(5000)
    await expect(page).toHaveScreenshot(`view-snippet-after-${size}.png`)

    if (size !== "xs") {
      await page.click('span:has-text("Files")')
    }
  })
}

test("files dialog", async ({ page }) => {
  await page.goto("http://127.0.0.1:5177/testuser/my-test-board")

  await page.waitForSelector(".run-button")

  await page.click('span:has-text("Files")')
  await expect(page).toHaveScreenshot(`view-snippet-files.png`)
})

test("SVG image generation and retrieval", async ({ page }) => {
  await page.goto("http://127.0.0.1:5177/testuser/my-test-board")

  await page.waitForSelector(".run-button")
  await page.click(".run-button")
  await page.waitForTimeout(5000)

  const responsePcb = await page.request.get("/snippets/get_image", {
    params: {
      snippet_id: "test_snippet_id",
      image_of: "pcb",
      format: "svg",
    },
  })

  expect(responsePcb.status()).toBe(200)
  const responseBodyPcb = await responsePcb.body()
  expect(responseBodyPcb.toString()).toContain("<svg")

  const responseSchematic = await page.request.get("/snippets/get_image", {
    params: {
      snippet_id: "test_snippet_id",
      image_of: "schematic",
      format: "svg",
    },
  })

  expect(responseSchematic.status()).toBe(200)
  const responseBodySchematic = await responseSchematic.body()
  expect(responseBodySchematic.toString()).toContain("<svg")
})
