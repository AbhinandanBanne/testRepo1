// @ts-check
const { test, expect } = require('@playwright/test');

test('open hagrids.com, scroll down and play the YouTube video', async ({ page }) => {
  // 1. Open the website
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveURL(/hagrids\.com/);

  // 2. Scroll down the page gradually (like a real user)
  for (let i = 0; i < 6; i++) {
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(400);
  }

  // 3. Bring the YouTube section into view
  const youtubeSection = page.locator('#watch');
  await youtubeSection.scrollIntoViewIfNeeded();
  await expect(youtubeSection.getByRole('heading', { name: 'See HAGRIDS in Action' })).toBeVisible();

  // 4. Click the play button inside the embedded YouTube iframe
  const iframe = youtubeSection.locator('.youtube-embed-wrapper iframe');
  await expect(iframe).toBeVisible();

  const player = youtubeSection.frameLocator('.youtube-embed-wrapper iframe');
  const playButton = player.getByRole('button', { name: 'Play video' });
  await expect(playButton).toBeVisible({ timeout: 20_000 });
  await playButton.click();

  // 5. Verify the video started playing (the <video> element is no longer paused)
  await expect
    .poll(() => player.locator('video').evaluate((v) => !v.paused), { timeout: 20_000 })
    .toBe(true);

  // Let it play a few seconds so you can see it, then take a screenshot
  await page.waitForTimeout(5_000);
  await page.screenshot({ path: 'test-results/youtube-playing.png' });
});
