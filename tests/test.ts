import { expect, test } from '@playwright/test';

test('site loads', async ({ page }) => {
	await page.goto('/');
	await expect(true).toBe(true);
});
