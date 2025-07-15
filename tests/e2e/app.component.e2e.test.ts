import { test, expect } from '@playwright/test';

test.describe('CreateEditTrackModalComponent', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('http://localhost:3000');
  });

  test('should load the homepage and display the correct title', async ({ page }) => {
    const appTitle = page.locator('a[class="logo_title"]');
    await expect(appTitle).toBeVisible();
    await expect(appTitle).toHaveText('MusicApp');
  });

  test('should display logo image', async ({ page }) => {
    const logo = page.locator('header .logo');

    await expect(logo).toBeVisible();
    await expect(logo).toHaveAttribute('src', 'https://images.rawpixel.com/image_png_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvdjkzNC1udW5ueS0xMi5wbmc.png');
  });
});
