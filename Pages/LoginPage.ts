import { test, expect } from '@playwright/test';
 
test('display material 1000439 with Basic Data 1 and Basic Data 2', async ({
  page,
}) => {
  const username = 'KKRISHNA';
  const password = 'Nopassword@123';
 
  if (!username || !password) {
    throw new Error('Set SAP_USERNAME and SAP_PASSWORD before running this test.');
  }
 
  await page.goto(
    'https://s4tr4.applexus.com:8444/sap/bc/ui2/flp?sap-client=100',
  );
 
  await page.getByRole('textbox', { name: 'User' }).fill(username);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.getByRole('button', { name: 'Log On' }).click();
   
  
});