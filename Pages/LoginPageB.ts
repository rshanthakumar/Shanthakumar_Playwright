import { expect, type Locator, type Page } from '@playwright/test';
 
export class LoginPage {
  private readonly username: Locator;
  private readonly password: Locator;
  private readonly loginButton: Locator;
 
  constructor(private readonly page: Page) {
    this.username = page
      .getByRole('textbox', { name: /user(name)?/i })
      .or(page.locator('input[name="sap-user"], input[autocomplete="username"]'))
      .first();
    this.password = page
      .getByLabel(/password/i)
      .or(page.locator('input[name="sap-password"], input[type="password"]'))
      .first();
    this.loginButton = page
      .getByRole('button', { name: /log ?on|sign in|login/i })
      .or(page.locator('button#logon_button, input#logon_button, input[type="submit"]'))
      .first();
  }
 
  async handleCertificateWarning(): Promise<void> {
    try {
      const advancedButton = this.page.getByRole('button', { name: 'Advanced', exact: true });
      if (!(await advancedButton.isVisible().catch(() => false))) {
        console.info('[Login] No browser SSL interstitial detected.');
        return;
      }
 
      console.info('[Login] SSL interstitial detected; opening advanced options.');
      await advancedButton.click();
      const proceedButton = this.page
        .getByRole('button', { name: /proceed to .*unsafe/i })
        .or(this.page.getByText(/proceed to .*unsafe/i))
        .first();
      await expect(proceedButton).toBeVisible();
      await proceedButton.click();
      console.info('[Login] Proceeded past the SSL interstitial.');
    } catch (error) {
      console.error('[Login] Failed while handling the browser SSL interstitial.', error);
      throw error;
    }
  }
 
  async login(username: string, password: string): Promise<void> {
    try {
      console.info('[Login] Waiting for the SAP login form.');
      await expect(this.username).toBeVisible();
      await this.username.fill(username);
      await this.password.fill(password);
      console.info('[Login] Credentials entered; submitting the login form.');
      await this.loginButton.click();
 
      const launchpad = this.page.locator('#sap-ushell-root, #sap-ushell-application-Catalog');
      const shellHeader = this.page.locator('#shell-header, #sap-ushell-header');
      await expect(launchpad.or(shellHeader).first()).toBeVisible();
      console.info('[Login] SAP Fiori Launchpad is loaded.');
    } catch (error) {
      console.error('[Login] Login or Launchpad verification failed.', error);
      throw error;
    }
  }
}