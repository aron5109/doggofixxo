import { test, expect } from '@playwright/test';

test('production build requires sign-in before opening personal records', async ({
  page,
  request,
}) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', {
      name: /We’ll be with you soon\.|A happier little world for your dog\./,
    }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Let’s find out' })).toHaveCount(0);
  await expect(page.getByText(/local demo/i)).toHaveCount(0);
  expect((await request.get('/api/state')).status()).toBe(401);
  const auth = await request.get('/api/auth/providers');
  if (await page.getByRole('button', { name: 'Continue with Google' }).isVisible()) {
    expect(auth.status()).toBe(200);
    expect((await auth.json()).google.id).toBe('google');
  } else {
    expect(auth.status()).toBe(503);
    expect(await auth.json()).toEqual({
      error: 'Sign-in is temporarily unavailable. Please try again later.',
    });
    await expect(page.getByRole('button', { name: 'Check again' })).toBeVisible();
  }
});
