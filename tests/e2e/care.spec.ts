import type { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './fixtures';
import { sampleState } from '../fixtures';
import { lessons } from '../../lib/lessons';
import { localDay, plusDays } from '../../lib/model';

async function nav(page: Page, label: string) {
  const mobile = page.getByRole('navigation', { name: 'Mobile navigation' });
  const navigation = (await mobile.isVisible())
    ? mobile
    : page.getByRole('navigation', { name: 'Main navigation' });
  await navigation.getByRole('button', { name: label, exact: true }).click();
}
async function saved(page: Page) {
  await expect(page.locator('.app-layout')).toHaveAttribute('data-save-state', 'saved');
}
async function yearPlan(page: Page, kind: 'feeding' | 'bathing' | 'play') {
  await page.getByRole('button', { name: 'Continue to calendar options' }).click();
  await page.getByRole('button', { name: 'Review one-year plan' }).click();
  await page.getByRole('button', { name: `Confirm one-year ${kind} plan` }).click();
  await saved(page);
}

test('progress advances twice on the same day and save status stays inside Profile', async ({
  page,
  records,
}) => {
  records.state = sampleState();
  records.state.dogs[0].name = 'Maple with a very long name';
  await page.goto('/');
  await expect(page.getByText('All changes saved to your account', { exact: true })).toHaveCount(0);
  const menu = page.getByRole('button', { name: 'Toggle navigation' });
  if (await menu.isVisible()) {
    const select = (await page.getByRole('combobox', { name: 'Active dog' }).boundingBox())!;
    const hamburger = (await menu.boundingBox())!;
    expect(
      Math.abs(select.y + select.height / 2 - hamburger.y - hamburger.height / 2),
    ).toBeLessThan(2);
  }
  await nav(page, 'Training');
  for (const percent of [17, 33]) {
    await page.locator('.lesson-card').filter({ hasText: 'Calm at Home' }).click();
    const dialog = page.getByRole('dialog', { name: 'Calm at Home', exact: true });
    await dialog.locator('summary').filter({ hasText: 'Why this approach?' }).click();
    await expect(dialog.getByRole('link')).toHaveCount(0);
    await dialog.getByRole('button', { name: 'Let’s practise' }).click();
    await dialog.getByRole('button', { name: 'Finish session early' }).click();
    await dialog.getByRole('button', { name: 'Great!', exact: true }).click();
    await expect(dialog.getByRole('checkbox')).toBeChecked();
    await dialog.getByRole('button', { name: 'Save our little step' }).click();
    await expect(dialog.locator('.progress-result')).toContainText(`${percent}% lesson progress`);
    await saved(page);
    await dialog.getByRole('button', { name: 'All done', exact: true }).click();
  }
  expect(records.state.dogs[0].sessions.map((s) => s.progressSnapshot)).toEqual([17, 33]);
  await page.reload();
  await nav(page, 'Training');
  await expect(
    page.getByRole('progressbar', { name: 'Calm at Home progress', exact: true }),
  ).toHaveAttribute('aria-valuenow', '33');
  await nav(page, 'Profile');
  await expect(page.locator('.account-save-status')).toHaveText(
    /All changes saved to your account/,
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('birthday and microchip survive reload with one automatic birthday series', async ({
  page,
  records,
}) => {
  records.state = sampleState();
  const today = localDay(new Date());
  const birthday = `2024-${today.slice(5)}`;
  await page.goto('/');
  await nav(page, 'Profile');
  await page.getByRole('button', { name: 'Edit profile', exact: true }).click();
  await page.getByLabel('Birthday (optional)').fill(birthday);
  await page.getByLabel('Microchip number (optional)').fill('123456789012345');
  await page.getByRole('button', { name: 'Save profile', exact: true }).click();
  await saved(page);
  expect(records.state.dogs[0].birthday).toBe(birthday);
  expect(records.state.dogs[0].events.filter((e) => e.carePlan === 'birthday')).toHaveLength(1);
  const id = records.state.dogs[0].events[0].id;
  await page.reload();
  await nav(page, 'Profile');
  await expect(page.getByText('Microchip: 123456789012345', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Edit profile', exact: true }).click();
  await page.getByLabel('Dog’s name').fill('Maple Bean');
  await page.getByRole('button', { name: 'Save profile', exact: true }).click();
  await saved(page);
  expect(records.state.dogs[0].events[0]).toMatchObject({
    id,
    title: 'Maple Bean’s birthday',
    repeat: 'yearly',
  });
  await nav(page, 'Calendar');
  await expect(
    page.locator('.agenda-item').filter({ hasText: 'Maple Bean’s birthday' }),
  ).toBeVisible();
});

test('feeding asks times before recurrence, writes only after confirmation, and supports manual entry', async ({
  page,
  records,
}) => {
  records.state = sampleState();
  await page.goto('/');
  await nav(page, 'Profile');
  await expect(page.getByRole('heading', { name: 'Food & water · approx.' })).toBeVisible();
  await page.getByRole('button', { name: 'Plan feeding times' }).click();
  await page.getByLabel('Meal 1 time').fill('07:30');
  await page.getByLabel('Meal 2 time').fill('18:30');
  await page.getByRole('button', { name: 'Continue to calendar options' }).click();
  await expect(
    page.getByRole('heading', { name: 'Would you like this to repeat for one year?' }),
  ).toBeVisible();
  expect(records.state.dogs[0].events).toHaveLength(0);
  await page.getByRole('button', { name: 'Review one-year plan' }).click();
  expect(records.state.dogs[0].events).toHaveLength(0);
  await page.getByRole('button', { name: 'Confirm one-year feeding plan' }).click();
  await saved(page);
  expect(records.state.dogs[0].events).toHaveLength(2);
  expect(
    records.state.dogs[0].events.every(
      (e) => e.repeat === 'daily' && e.repeatUntil && e.carePlan === 'feeding',
    ),
  ).toBe(true);
  await page.getByRole('button', { name: 'Plan feeding times' }).click();
  await page.getByRole('button', { name: 'Continue to calendar options' }).click();
  await page.getByRole('button', { name: 'Add manually instead' }).click();
  expect(records.state.dogs[0].events).toHaveLength(2);
  await expect(page.getByRole('combobox', { name: 'Repeat', exact: true })).toHaveValue('none');
  await page.getByRole('textbox', { name: 'Title', exact: true }).fill('Manual meal');
  await page.getByRole('button', { name: 'Save appointment', exact: true }).click();
  await saved(page);
  expect(records.state.dogs[0].events.find((e) => e.title === 'Manual meal')).toMatchObject({
    kind: 'Feeding',
    repeat: 'none',
  });
  await page.locator('.agenda-item').filter({ hasText: 'Maple · meal 1' }).click();
  await page.getByRole('combobox', { name: 'Repeat', exact: true }).selectOption('none');
  await page.getByRole('combobox', { name: 'Type', exact: true }).selectOption('Reminder');
  await page.getByRole('textbox', { name: 'Title', exact: true }).fill('Converted one-off');
  await page.getByRole('button', { name: 'Save appointment', exact: true }).click();
  await saved(page);
  const converted = records.state.dogs[0].events.find((e) => e.title === 'Converted one-off')!;
  expect(converted.repeat).toBe('none');
  expect(converted.repeatUntil).toBeUndefined();
  expect(converted.carePlan).toBeUndefined();
});

test('bathing schedules the selected interval only after approving the year', async ({
  page,
  records,
}) => {
  records.state = sampleState();
  await page.goto('/');
  await nav(page, 'Profile');
  await page.getByRole('button', { name: 'Plan bathing check-ins' }).click();
  await page.getByRole('combobox', { name: 'Check in every' }).selectOption('8');
  await page.getByLabel('Preferred time').fill('10:00');
  await yearPlan(page, 'bathing');
  expect(records.state.dogs[0].events).toHaveLength(1);
  expect(records.state.dogs[0].events[0]).toMatchObject({
    kind: 'Grooming',
    carePlan: 'bathing',
    repeat: 'weekly',
    repeatEvery: 8,
  });
});

test('daily play uses actual completed minutes in calendar, charts and saved profile', async ({
  page,
  records,
}) => {
  records.state = sampleState();
  await page.goto('/');
  await nav(page, 'Profile');
  const slider = page.getByRole('slider', { name: /Daily play goal/ });
  await slider.focus();
  await slider.press('Home');
  for (let i = 0; i < 4; i++) await slider.press('ArrowRight');
  await page.getByRole('button', { name: 'Save play goal' }).click();
  await saved(page);
  expect(records.state.dogs[0].playTarget).toBe(40);
  await page.getByRole('button', { name: 'Plan daily play' }).click();
  await yearPlan(page, 'play');
  expect(records.state.dogs[0].playSessions).toBeUndefined();
  await nav(page, 'Calendar');
  await page.getByRole('button', { name: 'Mark play done', exact: true }).click();
  await page.getByLabel('Completed minutes', { exact: true }).fill('25');
  await page.getByRole('button', { name: 'Save completed play' }).click();
  await saved(page);
  expect(records.state.dogs[0].playSessions).toHaveLength(1);
  expect(records.state.dogs[0].playSessions![0].minutes).toBe(25);
  await nav(page, 'Profile');
  for (const period of ['Week', 'Month', 'Year']) {
    await page
      .getByRole('group', { name: 'Activity chart period' })
      .getByRole('button', { name: period, exact: true })
      .click();
    await expect(
      page.getByRole('img', { name: new RegExp(`${period} play chart: 25 completed minutes`) }),
    ).toBeVisible();
  }
  await page.reload();
  await nav(page, 'Profile');
  await expect(
    page.getByRole('img', { name: /Week play chart: 25 completed minutes/ }),
  ).toBeVisible();
  await nav(page, 'Calendar');
  await page.getByRole('button', { name: 'Undo completed play' }).click();
  await saved(page);
  expect(records.state.dogs[0].playSessions).toEqual([]);
  await nav(page, 'Profile');
  await page.getByLabel('Actual minutes', { exact: true }).fill('35');
  await page.getByRole('button', { name: 'Log completed play' }).click();
  await saved(page);
  await expect(
    page.getByRole('img', { name: /Week play chart: 35 completed minutes/ }),
  ).toBeVisible();
});

test('training and activity badges are earned from recorded milestones; care profile is accessible', async ({
  page,
  records,
}) => {
  records.state = sampleState();
  const now = new Date();
  records.state.dogs[0].playSessions = Array.from({ length: 30 }, (_, i) => ({
    id: crypto.randomUUID(),
    day: localDay(plusDays(now, -i)),
    minutes: 40,
  }));
  records.state.dogs[0].sessions = lessons
    .filter((l) => l.category === 'Barking')
    .flatMap((lesson) =>
      Array.from({ length: 6 }, (_, i) => ({
        id: crypto.randomUUID(),
        lessonId: lesson.id,
        startedAt: now.toISOString(),
        finishedAt: now.toISOString(),
        day: localDay(now),
        duration: 60,
        outcome: 'great' as const,
        observed: true,
        milestone: Math.floor(i / 2),
        notes: '',
        progressSnapshot: Math.round(((i + 1) / 6) * 100),
      })),
    );
  await page.goto('/');
  await nav(page, 'Profile');
  await expect(page.locator('.earned-badges')).toContainText('Barking collection');
  await expect(page.locator('.earned-badges')).toContainText('1,000 play minutes');
  await expect(page.locator('.earned-badges')).toContainText('1 month of active days');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.screenshot({
    path: `test-results/care-profile-${test.info().project.name}.png`,
    fullPage: true,
  });
});
