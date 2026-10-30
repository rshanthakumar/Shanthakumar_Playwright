import { expect, test } from '@playwright/test';

const launchpadUrl =
  'https://s4tr4.applexus.com:8444/sap/bc/ui2/flp?sap-client=100';

test('logs on to the SAP Fiori launchpad', async ({ page }) => {
  const username = 'KKRISHNA';
  const password = 'Nopassword@123';

  if (!username || !password) {
    throw new Error(
      'Set SAP_USERNAME and SAP_PASSWORD environment variables before running this test.',
    );
  }

  await page.goto(launchpadUrl);

  await page.getByRole('textbox', { name: 'User' }).fill(username);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.getByRole('button', { name: 'Log On' }).click();

  //await expect(
    //page.getByRole('button', { name: /^Profile of/i }),
  //).toBeVisible();
});
