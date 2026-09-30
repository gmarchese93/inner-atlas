import { expect, test } from "@playwright/test";

test("selects a scene and persists the active journal draft", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "networkidle" });
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
  await expect(page.getByRole("button", { name: /still room/i })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.getByRole("button", { name: /soft rain/i }).click();
  const journal = page.getByPlaceholder(
    "Notice what softens when nothing asks for an answer.",
  );

  await expect(journal).toBeVisible();
  await journal.fill("Protect the quiet center.");
  await page.reload({ waitUntil: "networkidle" });

  await expect(page.getByRole("button", { name: /soft rain/i })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(journal).toHaveValue("Protect the quiet center.");
});
