import { type Page } from '@playwright/test';
import { test, expect } from './fixtures';
import AxeBuilder from '@axe-core/playwright';
async function register(page: Page, name = 'Maple') {
  await page.getByRole('button', { name: 'Let’s find out' }).click();
  await page.getByLabel('Dog’s name').fill(name);
  await page.getByLabel('Breed or mixed breed').fill('Golden mix');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByRole('button', { name: 'Find our path' }).click();
}
async function create(page: Page) {
  await page.goto('/');
  await register(page);
  await page.getByRole('button', { name: 'Yes, let’s do this!' }).click();
  await expect(
    page.getByRole('heading', { name: 'Little lessons. Lasting habits.' }),
  ).toBeVisible();
  await expect(page.locator('.account-banner')).toHaveText(/All changes saved to your account/);
}
async function nav(page: Page, label: string) {
  const navigation = page.getByRole('navigation', { name: 'Mobile navigation' });
  if (await navigation.isVisible())
    await navigation.getByRole('button', { name: label, exact: true }).click();
  else
    await page
      .getByRole('navigation', { name: 'Main navigation' })
      .getByRole('button', { name: label, exact: true })
      .click();
  const active = (await navigation.isVisible())
    ? navigation
    : page.getByRole('navigation', { name: 'Main navigation' });
  await expect(active.getByRole('button', { name: label, exact: true })).toHaveAttribute(
    'aria-current',
    'page',
  );
}
test('confirmation cancellation discards the unconfirmed profile', async ({ page, records }) => {
  await page.goto('/');
  await register(page, 'Unconfirmed');
  await page.getByRole('button', { name: 'Not right now' }).click();
  await expect(page.getByRole('heading', { name: 'Is your dog feeling okay?' })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('mellowoof-demo-v1'))).toBeNull();
  expect(records.writes).toBe(0);
  expect(records.state.dogs).toHaveLength(0);
  await page.getByRole('button', { name: 'Let’s find out' }).click();
  await expect(page.getByLabel('Dog’s name')).toHaveValue('');
});
test('complete primary journey: timer, feedback, calendar, persistence and profile editing', async ({
  page,
  records,
}) => {
  await create(page);
  await page.getByRole('button', { name: /Doorbell Detective/ }).click();
  await page.getByRole('button', { name: 'Let’s practise' }).click();
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Pause', exact: true })).toBeVisible();
  await page.waitForTimeout(1100);
  await page.getByRole('button', { name: 'Pause', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Resume', exact: true })).toBeVisible();
  const paused = await page.getByRole('timer').textContent();
  await page.waitForTimeout(1100);
  expect(await page.getByRole('timer').textContent()).toBe(paused);
  await page.getByRole('button', { name: 'Resume', exact: true }).click();
  await page.getByRole('button', { name: 'Skip / next' }).click();
  await page.getByRole('button', { name: 'Finish session early' }).click();
  await page.getByRole('button', { name: 'Great!', exact: true }).click();
  await page.getByRole('checkbox').check();
  await page
    .getByRole('textbox', { name: 'Anything you noticed?' })
    .fill('Comfortable with a quiet sound.');
  await page.getByRole('button', { name: 'Save our little step' }).click();
  await expect(page.getByText('SESSION SAVED', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Plan next session' }).click();
  await expect(page.getByRole('textbox', { name: 'Title', exact: true })).toHaveValue(
    'Doorbell Detective',
  );
  await page.getByRole('button', { name: 'Save appointment' }).click();
  await nav(page, 'Calendar');
  await page.getByRole('button', { name: 'Agenda', exact: true }).click();
  await expect(
    page.getByRole('button', { name: /Doorbell Detective.*Completed practice/ }),
  ).toBeVisible();
  await page.getByRole('button', { name: /Doorbell Detective.*Training/ }).click();
  await page
    .getByRole('textbox', { name: 'Title', exact: true })
    .fill('Doorbell practice with Maple');
  await page.getByRole('combobox', { name: 'Repeat', exact: true }).selectOption('weekly');
  await page.getByRole('button', { name: 'Save appointment' }).click();
  await expect(
    page.getByRole('button', { name: /Doorbell practice with Maple/ }).first(),
  ).toBeVisible();
  await nav(page, 'Profile');
  await page.getByRole('button', { name: 'Edit profile' }).click();
  await page.getByLabel('Dog’s name').fill('Maple Bean');
  await page.getByRole('button', { name: 'Save profile' }).click();
  await expect(page.getByRole('heading', { name: 'Maple Bean’s little world.' })).toBeVisible();
  await expect(page.locator('.account-banner')).toHaveText(/All changes saved to your account/);
  await page.reload();
  await nav(page, 'Training');
  const saved = records.state;
  expect(saved.dogs[0].name).toBe('Maple Bean');
  expect(saved.dogs[0].sessions).toHaveLength(1);
  expect(saved.dogs[0].sessions[0].progressSnapshot).toBe(17);
  expect(saved.dogs[0].sessions[0].notes).toBe('Comfortable with a quiet sound.');
  expect(saved.dogs[0].events[0].repeat).toBe('weekly');
  expect(await page.evaluate(() => localStorage.getItem('mellowoof-demo-v1'))).toBeNull();
});
test('difficulty recommends rest without artificial progress', async ({ page, records }) => {
  await create(page);
  await page.getByRole('button', { name: /Tiny Goodbyes/ }).click();
  await page.getByRole('button', { name: 'Let’s practise' }).click();
  await page.getByRole('button', { name: 'Finish session early' }).click();
  await page.getByRole('button', { name: 'Too difficult', exact: true }).click();
  await expect(page.getByText(/Let’s rest for now/)).toBeVisible();
  await page.getByRole('button', { name: 'Save our little step' }).click();
  await expect(page.getByRole('heading', { name: 'A little rest is a good step.' })).toBeVisible();
  await expect(page.locator('.account-banner')).toHaveText(/All changes saved to your account/);
  const saved = records.state;
  expect(saved.dogs[0].sessions[0].progressSnapshot).toBe(0);
  await page.getByRole('button', { name: 'All done' }).click();
  await nav(page, 'Home');
  await expect(page.getByRole('heading', { name: /A little rest.*A gentle reset/ })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Start training', exact: true })).toHaveCount(0);
});
test('favorites, JSON export/import and multiple dogs remain separate', async ({
  page,
  records,
}) => {
  await create(page);
  await nav(page, 'Tips');
  await page
    .getByRole('button', { name: /^Save tip:/ })
    .first()
    .click();
  await page.getByRole('button', { name: /Saved tips \(1\)/ }).click();
  await expect(page.locator('.tip-card')).toHaveCount(1);
  await nav(page, 'Profile');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export JSON' }).click();
  const download = await downloadPromise;
  const file = await download.path();
  expect(file).toBeTruthy();
  await page.getByRole('button', { name: 'Add another dog' }).click();
  await register(page, 'Poppy');
  await page.getByRole('button', { name: 'Yes, let’s do this!' }).click();
  await expect(page.locator('.account-banner')).toHaveText(/All changes saved to your account/);
  await expect(page.getByLabel('Active dog')).toHaveValue(records.state.activeDogId!);
  await nav(page, 'Profile');
  await page.locator('input[type=file][accept="application/json,.json"]').setInputFiles(file!);
  await page.getByRole('button', { name: 'Replace with backup' }).click();
  await expect(page.getByRole('heading', { name: 'Maple’s little world.' })).toBeVisible();
  expect(await page.getByLabel('Active dog').locator('option').count()).toBe(1);
});
test('calendar CRUD supports all views and recurring reminders', async ({ page }) => {
  await create(page);
  await nav(page, 'Calendar');
  await page.getByRole('button', { name: 'Add appointment', exact: true }).click();
  await page.getByRole('textbox', { name: 'Title', exact: true }).fill('Annual vet visit');
  await page.getByRole('combobox', { name: 'Type', exact: true }).selectOption('Vet');
  await page.getByRole('combobox', { name: 'Repeat', exact: true }).selectOption('yearly');
  await page.getByRole('button', { name: 'Save appointment' }).click();
  await page.getByRole('button', { name: /Annual vet visit/ }).click();
  await page.getByRole('textbox', { name: 'Title', exact: true }).fill('Vet wellness visit');
  await page.getByRole('button', { name: 'Save appointment' }).click();
  await expect(page.getByRole('button', { name: /Vet wellness visit/ })).toBeVisible();
  await page.getByRole('button', { name: 'Week', exact: true }).click();
  await expect(page.locator('.calendar-grid.week .calendar-day')).toHaveCount(7);
  await page.getByRole('button', { name: 'Agenda', exact: true }).click();
  await page.getByRole('button', { name: /Vet wellness visit/ }).click();
  await page.getByRole('button', { name: 'Delete', exact: true }).click();
  await page.getByRole('button', { name: 'Yes, delete', exact: true }).click();
  await expect(page.getByRole('button', { name: /Vet wellness visit/ })).toHaveCount(0);
});
test('accessibility scan and narrow layout on core screens', async ({ page }) => {
  test.setTimeout(240000);
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Is your dog feeling okay?' })).toBeVisible();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze()
    ).violations,
  ).toEqual([]);
  await register(page);
  await page.getByRole('button', { name: 'Yes, let’s do this!' }).click();
  for (const view of ['Home', 'Training', 'Calendar', 'Tips', 'Profile']) {
    await nav(page, view);
    await expect(page.locator('h1')).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(
      results.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })),
      })),
    ).toEqual([]);
  }
  await page.screenshot({
    path: `test-results/mellowoof-${test.info().project.name}.png`,
    fullPage: true,
  });
});
