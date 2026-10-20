import { test as base, expect } from '@playwright/test';
import { emptyState, stateSchema, type AppState } from '../../lib/model';
type AccountRecords = {
  state: AppState;
  revision: number;
  writes: number;
  loadStatus: number;
  saveStatus: number;
};

// Authenticated UI fixtures replace network responses only inside Playwright.
// Real API authorization and SQL persistence run separately in tests/cloud.test.ts.
export const test = base.extend<{ records: AccountRecords }>({
  records: async ({}, provide) => {
    await provide({
      state: emptyState(),
      revision: 0,
      writes: 0,
      loadStatus: 200,
      saveStatus: 200,
    });
  },
  page: async ({ page, records, baseURL }, provide) => {
    await page.route('**/api/state', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: records.loadStatus,
          json: { state: records.state, revision: records.revision },
        });
        return;
      }
      if (records.saveStatus !== 200) {
        await route.fulfill({
          status: records.saveStatus,
          json: { error: 'Saving failed. Export your changes before leaving.' },
        });
        return;
      }
      const body = route.request().postDataJSON();
      if (body.revision !== records.revision) {
        await route.fulfill({
          status: 409,
          json: { error: 'Your records changed in another tab. Export your changes, then reload.' },
        });
        return;
      }
      records.state = stateSchema.parse(body.state);
      records.revision += 1;
      records.writes += 1;
      await route.fulfill({ json: { revision: records.revision } });
    });
    await page.route('**/api/auth/csrf', (route) =>
      route.fulfill({ json: { csrfToken: 'browser-test-csrf' } }),
    );
    await page.route('**/api/auth/providers', (route) =>
      route.fulfill({
        json: {
          google: {
            id: 'google',
            name: 'Google',
            type: 'oauth',
            signinUrl: `${baseURL}/api/auth/signin/google`,
            callbackUrl: `${baseURL}/api/auth/callback/google`,
          },
        },
      }),
    );
    await page.route('**/api/auth/signout', (route) =>
      route.fulfill({ json: { url: `${baseURL}/signed-out` } }),
    );
    await provide(page);
  },
});
export { expect };
