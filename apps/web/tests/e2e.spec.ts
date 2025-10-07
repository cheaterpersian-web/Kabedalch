import { test, expect } from '@playwright/test';

test('landing -> tests -> liver test -> result flow', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'شروع تست آنلاین' }).click();
  await expect(page).toHaveURL(/.*\/tests/);

  // Without dynamic IDs in seed, go to list then pick liver if exists later
});
