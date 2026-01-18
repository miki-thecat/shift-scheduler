import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveTitle(/Shift Scheduler/);
});

test('login flow', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('admin@example.com').fill('manager@example.com');
    await page.getByPlaceholder('••••••••').fill('password');
    await page.getByRole('button', { name: 'ログインする' }).click();

    await expect(page).toHaveURL(/\/manager/);
    await expect(page.getByText('Welcome Back, Manager')).toBeVisible();
});

test('mobile staff flow', async ({ page, isMobile }) => {
    // Only run on mobile
    if (!isMobile) test.skip();

    await page.goto('/staff/calendar');
    await expect(page.getByRole('heading', { name: /年/ })).toBeVisible(); // Calendar header
});
