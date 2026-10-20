import type { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './fixtures';
import { sampleState } from '../fixtures';
import { lessons, lessonById } from '../../lib/lessons';
import { tips } from '../../lib/tips';
import { references } from '../../lib/references';

const trainerSources = new Set(['zak', 'stilwell', 'mcmillan', 'bat', 'cesar']);
const advanced = lessons.find(
  (lesson) =>
    lesson.level === 'Advanced' &&
    lesson.category === 'Recall & focus' &&
    lesson.sources.some((source) => trainerSources.has(source)),
)!;
const newTip = tips.find((tip) => trainerSources.has(tip.source))!;

async function navigate(page: Page, label: string) {
  const mobile = page.getByRole('navigation', { name: 'Mobile navigation' });
  const navigation = (await mobile.isVisible())
    ? mobile
    : page.getByRole('navigation', { name: 'Main navigation' });
  await navigation.getByRole('button', { name: label, exact: true }).click();
}

async function openAdvancedLesson(page: Page) {
  await page
    .getByRole('group', { name: 'Training level', exact: true })
    .getByRole('button', { name: 'Advanced', exact: true })
    .click();
  await page
    .getByRole('group', { name: 'Training category', exact: true })
    .getByRole('button', { name: advanced.category, exact: true })
    .click();
  await page.getByRole('textbox', { name: 'Search lessons', exact: true }).fill(advanced.title);
  await expect(page.locator('.lesson-card')).toHaveCount(1);
  await expect(page.locator('.library-results')).toContainText('1 lesson at advanced level');
  await page.locator('.lesson-card').click();
  return page.getByRole('dialog', { name: advanced.title, exact: true });
}

test('advanced lessons show readiness, open prerequisites, and persist observed practice', async ({
  page,
  records,
}) => {
  records.state = sampleState();
  await page.goto('/');
  await expect(page.locator('.current-lesson')).toContainText('Foundation · Barking');
  await navigate(page, 'Training');
  let dialog = await openAdvancedLesson(page);
  await expect(dialog.getByRole('heading', { name: 'Before this lesson' })).toBeVisible();
  await expect(dialog.getByText(advanced.readiness, { exact: true })).toBeVisible();
  await expect(dialog.getByRole('heading', { name: 'Skills to build on' })).toBeVisible();
  await expect(dialog.getByText('Suggested earlier practice').first()).toBeVisible();

  const prerequisite = lessonById(advanced.prerequisites[0])!;
  await dialog.getByRole('button', { name: prerequisite.title, exact: true }).click();
  const earlierLesson = page.getByRole('dialog', { name: prerequisite.title, exact: true });
  await expect(earlierLesson.getByRole('button', { name: 'Let’s practise' })).toBeVisible();
  await expect(earlierLesson.getByText(prerequisite.readiness, { exact: true })).toBeVisible();
  await earlierLesson.getByRole('button', { name: 'Close dialog' }).click();

  dialog = await openAdvancedLesson(page);
  await dialog.locator('summary').filter({ hasText: 'Why this approach?' }).click();
  const source = advanced.sources.find((id) => trainerSources.has(id))!;
  await expect(dialog.getByRole('link', { name: references[source].title })).toHaveAttribute(
    'href',
    references[source].url,
  );
  await dialog.getByRole('button', { name: 'Let’s practise' }).click();
  await dialog.getByRole('button', { name: 'Finish session early' }).click();
  await dialog.getByRole('button', { name: 'Great!', exact: true }).click();
  await dialog.getByRole('checkbox').check();
  await dialog
    .getByRole('textbox', { name: 'Anything you noticed?' })
    .fill('Comfortable with the easy setup; keep the next repetition simple.');
  await dialog.getByRole('button', { name: 'Save our little step' }).click();
  await expect(dialog.getByText('SESSION SAVED', { exact: true })).toBeVisible();
  await expect(page.locator('.account-banner')).toHaveText(/All changes saved to your account/);
  expect(records.state.dogs[0].sessions).toHaveLength(1);
  expect(records.state.dogs[0].sessions[0]).toMatchObject({
    lessonId: advanced.id,
    outcome: 'great',
    observed: true,
    progressSnapshot: 17,
    notes: 'Comfortable with the easy setup; keep the next repetition simple.',
  });

  await dialog.getByRole('button', { name: 'All done', exact: true }).click();
  await page.reload();
  await navigate(page, 'Training');
  const history = page.locator('.history-row').filter({ hasText: advanced.title });
  await expect(history).toContainText('17% progress');
  await history.click();
  await expect(page.getByRole('dialog', { name: advanced.title, exact: true })).toContainText(
    'Comfortable with the easy setup; keep the next repetition simple.',
  );
});

test('new trainer-reading tips can be found, saved, and restored after reload', async ({
  page,
  records,
}) => {
  records.state = sampleState();
  await page.goto('/');
  await navigate(page, 'Tips');
  await page
    .getByRole('combobox', { name: 'Tip category', exact: true })
    .selectOption(newTip.category);
  await page.getByRole('textbox', { name: 'Search tips', exact: true }).fill(newTip.text);
  await expect(page.locator('.tip-card')).toHaveCount(1);
  await expect(page.locator('.tip-card')).toContainText(newTip.text);
  await expect(
    page.locator('.tip-card').getByRole('link', { name: references[newTip.source].title }),
  ).toHaveAttribute('href', references[newTip.source].url);
  await page.getByRole('button', { name: `Save tip: ${newTip.text}`, exact: true }).click();
  await expect(page.locator('.account-banner')).toHaveText(/All changes saved to your account/);
  expect(records.state.favorites).toContain(newTip.id);

  await page.reload();
  await navigate(page, 'Tips');
  await page.getByRole('button', { name: 'Saved tips (1)', exact: true }).click();
  await expect(page.locator('.tip-card')).toHaveCount(1);
  await expect(page.locator('.tip-card')).toContainText(newTip.text);
  await expect(
    page.getByRole('button', { name: `Unsave tip: ${newTip.text}`, exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
});

test('expanded filters, advanced readiness, and new tips remain accessible on narrow screens', async ({
  page,
  records,
}) => {
  test.setTimeout(120000);
  records.state = sampleState();
  const scan = async () => {
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
          .analyze()
      ).violations,
    ).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    );
  };
  await page.goto('/');
  await navigate(page, 'Training');
  await page
    .getByRole('group', { name: 'Training level', exact: true })
    .getByRole('button', { name: 'Advanced', exact: true })
    .click();
  await expect(page.locator('.lesson-card')).toHaveCount(
    lessons.filter((lesson) => lesson.level === 'Advanced').length,
  );
  await scan();
  const dialog = await openAdvancedLesson(page);
  await expect(dialog.getByRole('heading', { name: 'Before this lesson' })).toBeVisible();
  await scan();
  await dialog.getByRole('button', { name: 'Close dialog' }).click();
  await navigate(page, 'Tips');
  await page
    .getByRole('combobox', { name: 'Tip category', exact: true })
    .selectOption(newTip.category);
  await expect(page.locator('.tip-card').first()).toBeVisible();
  await scan();
});
