import { test, expect } from '@playwright/test';

test.describe('Protocol Activation Ritual', () => {
  test('should navigate to the activation ritual page', async ({ page }) => {
    await page.goto('/protocols/apply');
    await expect(page.locator('h1')).toContainText('ACTIVATE YOUR REALM');
  });

  test('should show validation error if form is empty', async ({ page }) => {
    await page.goto('/protocols/apply');
    await page.click('button[type="submit"]');
    // HTML5 validation or application error
    const nameInput = page.locator('input[name="name"]');
    await expect(nameInput).toHaveAttribute('required', '');
  });
});

test.describe('Mission Board', () => {
  test('should display the mission board', async ({ page }) => {
    await page.goto('/missions');
    await expect(page.locator('h1')).toContainText('MISSION BOARD');
  });
});
