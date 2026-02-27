import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
    // Listen for console messages
    page.on('console', msg => console.log(`BROWSER [${msg.type()}]: ${msg.text()}`));
    page.on('pageerror', err => console.log(`BROWSER ERROR: ${err.message}`));

    // Navigate to login page
    await page.goto('/fr/login');

    // Fill in credentials (using credentials from seedE2E)
    await page.fill('input[name="identifier"]', 'mario@reclamtrack.com');
    await page.fill('input[name="password"]', 'password123');

    // Click login button
    await page.click('button[type="submit"]:has-text("Se connecter")');

    // Check for error toasts or messages if login fails
    // Check for error toasts or messages if login fails
    // Only look for visible error alerts to avoid false positives
    const errorMessage = page.locator('.toast-error:visible, [role="alert"][data-type="error"]:visible');

    // Short wait to see if error appears
    try {
        await expect(errorMessage).toBeVisible({ timeout: 2000 });
        console.log('Login failed with error:', await errorMessage.first().textContent());
    } catch {
        // No error visible, proceed
    }

    // Wait for navigation and load
    await page.waitForURL(/\/dashboard/);
    await page.waitForLoadState('networkidle');

    // Inspect localStorage to see if token exists
    const authStorage = await page.evaluate(() => localStorage.getItem('reclamtrack-auth-storage'));
    console.log('AUTH STORAGE:', authStorage);

    // Verify we're logged in
    // 1. Check if the store has a user
    const hasUser = await page.evaluate(() => {
        try {
            const data = JSON.parse(localStorage.getItem('reclamtrack-auth-storage') || '{}');
            return !!data.state?.user;
        } catch { return false; }
    });

    if (!hasUser) {
        console.log('VERIFICATION FAILED: user not found in localStorage');
        // Take a screenshot of the current page to debug
        await page.screenshot({ path: 'test-results/login-failed.png' });
    }

    expect(hasUser).toBe(true);

    // Save authentication state
    await page.context().storageState({ path: authFile });
});
