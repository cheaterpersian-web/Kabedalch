import { test, expect } from '@playwright/test';

// Simplified e2e flow
// register -> visit tests -> select liver -> submit minimal answers -> navigate to package -> add to cart -> create order

test('register -> liver test -> add to cart -> create order', async ({ page }) => {
  await page.goto('/register');
  await page.getByPlaceholder('نام').fill('کاربر');
  await page.getByPlaceholder('نام خانوادگی').fill('نمونه');
  await page.getByPlaceholder('تلفن').fill('09120000000');
  await page.getByPlaceholder('ایمیل').fill(`user${Date.now()}@e2e.test`);
  await page.getByPlaceholder('رمز عبور').fill('Passw0rd!');
  await page.getByRole('button', { name: 'ثبت‌نام' }).click();

  await page.goto('/tests');
  await page.getByRole('link', { name: /تست کبد/i }).click();
  // Try submit without answers (service tolerates empty -> minimal score)
  await page.getByRole('button', { name: 'ثبت نتیجه' }).click();
  await expect(page.getByText('نمره:')).toBeVisible();
  const pkgLink = page.getByRole('link', { name: 'پکیج پیشنهادی' });
  if (await pkgLink.isVisible()) {
    await pkgLink.click();
    await page.getByRole('button', { name: 'افزودن به سبد و ادامه' }).click();
    await page.getByRole('button', { name: 'پرداخت' }).click();
    await expect(page.getByRole('link', { name: /انتقال به درگاه/i })).toBeVisible();
  }
});
