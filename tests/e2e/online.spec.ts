import { test, expect } from './fixtures';
import AxeBuilder from '@axe-core/playwright';
import { sampleState } from '../fixtures';

async function navigate(page: import('@playwright/test').Page, label: string) {
  const mobile = page.getByRole('navigation', { name: 'Mobile navigation' });
  const navigation = (await mobile.isVisible())
    ? mobile
    : page.getByRole('navigation', { name: 'Main navigation' });
  await navigation.getByRole('button', { name: label, exact: true }).click();
}

test('signed-out visitors continue through Google before creating any records', async ({
  page,
  records,
}) => {
  await page.route(/\/api\/auth\/signin\/google(?:\?|$)/, (route) =>
    route.fulfill({
      json: { url: 'https://accounts.google.com/o/oauth2/v2/auth?client_id=browser-test' },
    }),
  );
  await page.route('https://accounts.google.com/**', (route) =>
    route.fulfill({ contentType: 'text/html', body: '<h1>Google consent fixture</h1>' }),
  );
  await page.goto('/signed-out');
  await expect(
    page.getByRole('heading', { name: 'A happier little world for your dog.' }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Let’s find out' })).toHaveCount(0);
  await expect(page.getByText(/local demo/i)).toHaveCount(0);
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze()
    ).violations,
  ).toEqual([]);
  const redirect = page.waitForRequest(/\/api\/auth\/signin\/google(?:\?|$)/);
  await page.getByRole('button', { name: 'Continue with Google' }).click();
  const body = new URLSearchParams((await redirect).postData()!);
  expect(body.get('csrfToken')).toBe('browser-test-csrf');
  expect(body.get('callbackUrl')).toBe('/');
  await expect(page).toHaveURL(/^https:\/\/accounts\.google\.com\//);
  expect(records.writes).toBe(0);
});

test('unavailable and failed sign-in states never open onboarding', async ({ page }) => {
  await page.goto('/unavailable');
  await expect(page.getByRole('heading', { name: 'We’ll be with you soon.' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Continue with Google' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Check again' })).toBeVisible();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.goto('/auth-error');
  await expect(page.getByRole('alert')).toContainText('We couldn’t complete sign-in.');
  await expect(page.getByRole('button', { name: 'Continue with Google' })).toBeEnabled();
  await expect(page.getByRole('button', { name: 'Let’s find out' })).toHaveCount(0);
});

test('failed account loads preserve old browser data without using it as a fallback', async ({
  page,
  records,
}) => {
  records.loadStatus = 503;
  await page.addInitScript(() =>
    localStorage.setItem('mellowoof-demo-v1', 'legacy-private-records'),
  );
  await page.goto('/');
  await expect(page.getByRole('alert')).toContainText('Your records could not be loaded.');
  await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Let’s find out' })).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem('mellowoof-demo-v1'))).toBe(
    'legacy-private-records',
  );
  expect(records.writes).toBe(0);
});

test('an expired session requires sign-in instead of opening an empty account', async ({
  page,
  records,
}) => {
  records.loadStatus = 401;
  await page.goto('/');
  await expect(page.getByRole('alert')).toContainText('Your session has expired.');
  await expect(page.getByRole('button', { name: 'Sign in again' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Let’s find out' })).toHaveCount(0);
  expect(records.writes).toBe(0);
});

test('save failures pause further writes and keep unsaved records available for export', async ({
  page,
  records,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Let’s find out' }).click();
  await page.getByLabel('Dog’s name').fill('Maple');
  await page.getByLabel('Breed or mixed breed').fill('Golden mix');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByRole('button', { name: 'Find our path' }).click();
  records.saveStatus = 503;
  await page.getByRole('button', { name: 'Yes, let’s do this!' }).click();
  await expect(page.getByRole('alert')).toContainText('Saving failed.');
  await expect(page.locator('.account-banner')).toHaveText('Your account needs attention');
  const backup = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export backup', exact: true }).click();
  const download = await backup;
  expect(await download.path()).toBeTruthy();
  expect(records.state.dogs).toHaveLength(0);
  expect(records.writes).toBe(0);
  await navigate(page, 'Calendar');
  await page.getByRole('button', { name: 'Add appointment', exact: true }).click();
  await page.getByRole('textbox', { name: 'Title', exact: true }).fill('Unsaved appointment');
  await page.getByRole('button', { name: 'Save appointment' }).click();
  await page.getByRole('button', { name: 'Close dialog' }).click();
  await expect(page.getByRole('alert')).toContainText('Saving is paused after an error.');
  expect(records.writes).toBe(0);
  expect(await page.evaluate(() => localStorage.getItem('mellowoof-demo-v1'))).toBeNull();
});

test('sign-out returns to Google sign-in and leaves account records on the server', async ({
  page,
  records,
}) => {
  records.state = sampleState();
  await page.goto('/');
  await expect(page.locator('.account-banner')).toHaveText(/All changes saved to your account/);
  await navigate(page, 'Profile');
  await page.getByRole('button', { name: 'Sign out', exact: true }).click();
  await expect(page).toHaveURL(/\/signed-out$/);
  await expect(page.getByRole('button', { name: 'Continue with Google' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Let’s find out' })).toHaveCount(0);
  expect(records.state.dogs).toHaveLength(1);
  expect(records.writes).toBe(0);
  expect(await page.evaluate(() => localStorage.getItem('mellowoof-demo-v1'))).toBeNull();
});
