import { expect, test } from "@playwright/test";

test("session route query changes reset session-local state", async ({ page }) => {
  await page.goto("/session?mode=deep-focus&mood=calm", {
    waitUntil: "domcontentloaded",
  });

  const focusJournal = page.getByPlaceholder(
    "What needs your full attention right now?",
  );
  await expect(focusJournal).toBeVisible();
  await focusJournal.fill("This should not bleed into the next route.");

  await page.evaluate(() => {
    window.history.pushState(
      {},
      "",
      "/session?mode=night-reflection&mood=sad",
    );
    window.dispatchEvent(new PopStateEvent("popstate"));
  });

  const reflectionJournal = page.getByPlaceholder(
    "What image, thought, or feeling is still with you?",
  );
  await expect(reflectionJournal).toBeVisible();
  await expect(reflectionJournal).toHaveValue("");
  await expect(page.getByText("00:00")).toBeVisible();
});
