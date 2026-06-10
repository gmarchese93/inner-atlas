import { expect, test } from "@playwright/test";

test("selects a state and persists the active journal draft", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
      }
    `,
  });

  await expect(
    page.getByRole("heading", { name: /choose a state/i }),
  ).toBeVisible();

  await page.getByRole("button", { name: /deep focus/i }).click();
  await expect(
    page.getByRole("heading", { name: /how are you arriving/i }),
  ).toBeVisible();

  await page.getByRole("button", { name: /quiet/i }).click();
  const journal = page.getByPlaceholder(
    "What needs your full attention right now?",
  );

  await expect(journal).toBeVisible();
  await journal.fill("Protect the quiet center.");
  await page.reload({ waitUntil: "domcontentloaded" });

  await expect(journal).toHaveValue("Protect the quiet center.");
});
