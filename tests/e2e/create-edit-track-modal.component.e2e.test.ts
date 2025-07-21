import { test, expect } from '@playwright/test';

test.describe('CreateEditTrackModalComponent', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.click('button[data-testid="create-track-button"]'); // Open the modal
  });

  test('should render the form and validate user input', async ({ page }) => {
    const titleInput = page.locator('[data-testid="input-title"]');
    await titleInput.fill('');
    await page.locator('body').click(); // click aside

    const errorTitle = page.locator('[data-testid="error-title"]');
    await expect(errorTitle).toBeVisible();
    await expect(errorTitle).toHaveText('Track title is required');
  });

  test('should submit the form when valid', async ({ page }) => {
    await page.fill('[data-testid="input-title"]', 'Test Track');
    await page.fill('[data-testid="input-artist"]', 'Test Artist');
    await page.fill('[data-testid="input-album"]', 'Test Album');
    await page.fill('[data-testid="input-cover-image"]', 'test-image.jpg');

    await page.waitForResponse(response =>
      response.url().includes('/api/genres') && response.status() === 200
    );

    // Ensure genres are rendered
    const genresItems = page.locator('li.genres-item');
    const count = await genresItems.count();
    expect(count).toBeGreaterThan(0);

    await genresItems.nth(0).click();

    const submitButton = page.locator('[data-testid="submit-button"]');
    await expect(submitButton).not.toBeDisabled();

    await submitButton.click();
    await expect(page.locator('[data-testid="track-form"]')).not.toBeVisible(); // Modal should close
  });
});
