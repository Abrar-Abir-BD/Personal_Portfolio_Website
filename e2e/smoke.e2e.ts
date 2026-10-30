import { expect, test } from "@playwright/test";

test("home → project page → back, no console errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("/");
  const link = page.locator('a[href^="/projects/"]').first();
  const href = await link.getAttribute("href");
  // The fixed 3D character covers the card at this viewport and ScrollSmoother
  // defeats scroll-into-view, so send the click straight to the link (the
  // router handles it on document)
  await link.dispatchEvent("click", { button: 0 });
  await expect(page).toHaveURL(href!);
  await expect(page.locator("#subpage")).toBeVisible();

  await page.goBack();
  await expect(page).toHaveURL("/");
  await expect(page.locator("#subpage")).toHaveCount(0);

  expect(errors).toEqual([]);
});
