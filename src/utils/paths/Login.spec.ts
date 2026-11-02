import { test, expect } from '@playwright/test';
 
test.setTimeout(180_000);
 
test('Create a Standard PO in Create Purchase Order - Advanced', async ({ page }, testInfo) => {
  const username = 'KKRISHNA'; // process.env.SAP_USERNAME;
  const password = 'Nopassword@123'; // process.env.SAP_PASSWORD;
 
  if (!username || !password) {
    throw new Error('Set SAP_USERNAME and SAP_PASSWORD before running this test.');
  }
 
  const launchpadUrl =
    //process.env.SAP_BASE_URL ??
    'https://s4tr4.applexus.com:8444/sap/bc/ui2/flp?sap-client=100';
 
  const iframeSelector = 'iframe[name="application-PurchaseOrder-create-iframe"]';
  const screenshot = (name: string) =>
    page.screenshot({ path: testInfo.outputPath(name), fullPage: true });
 
  let saveDialogVisible = false;
 
  // Step 1: Sign in to SAP Fiori using credentials from environment variables.
  await test.step('Step 1: Sign in to SAP Fiori', async () => {
    await page.goto(launchpadUrl);
    await expect(page.getByRole('textbox', { name: 'User' })).toBeVisible();
 
    await screenshot('01-logon.png');
 
    await page.getByRole('textbox', { name: 'User' }).fill(username);
    await page.getByRole('textbox', { name: 'Password' }).fill(password);
    await page.getByRole('button', { name: 'Log On' }).click();
 
    await expect(page.getByRole('button', { name: /Profile of/ })).toBeVisible({
      timeout: 60_000,
    });
 
    await screenshot('02-launchpad-home.png');
  });
