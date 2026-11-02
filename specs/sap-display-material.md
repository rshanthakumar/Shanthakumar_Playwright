# SAP Display Material Workflow

## Purpose

The Playwright TypeScript test at `tests/sap-display-material.spec.ts` signs in to the SAP Fiori launchpad, opens the Display Material app, displays material `1000439` with Basic Data 1 and Basic Data 2 selected, and verifies that material information is visible.

## Environment and Security

- Launchpad URL: `https://s4tr4.applexus.com:8444/sap/bc/ui2/flp?sap-client=100`
- Read credentials from `SAP_USERNAME` and `SAP_PASSWORD` environment variables. Do not put credentials in the spec, this document, test reports, or screenshots.
- Keep TLS certificate verification enabled. Trust the SAP server certificate in the test environment instead of setting `ignoreHTTPSErrors`.
- Run the test in Chromium unless another browser is specifically required.

## Observed Workflow

1. Open the launchpad URL and wait for the logon form.
2. Fill the `User` and `Password` textboxes. Submit with Enter (or click `Log On`). Verify authentication by waiting for the shell button whose accessible name starts with `Profile of`.
3. Click the shell button `Open Search`. Fill the `Search` searchbox with `Display Material` and submit with Enter.
4. Search can take several seconds. Use Playwright locator auto-waiting for the result; do not use a fixed sleep. The results include catalog entities as well as app links. Open the exact app link named `Display Material`.
5. The app UI is hosted in an iframe. Use `page.frameLocator('iframe')` for app locators and wait for the textbox named `Material Required`.
6. Fill that textbox with `1000439` and press Enter. This opens the `Select View(s)` dialog.
7. In the dialog, select the first gridcell of the rows named `Basic Data 1` and `Basic Data 2`. The first gridcell is the selection cell; clicking the view-name button only focuses the label. Confirm each row is selected if useful (`Row selected` is included in its accessible name).
8. Click the dialog button whose name starts with `Continue` (displayed as `Continue (Enter)`).
9. Wait for the material form in the iframe and verify material number, description, and both requested tabs.

## Acceptance Checks

- Material textbox named `Material` has value `1000439`.
- Description textbox named `Descr.` has value `NK test Material`.
- Tabs `Basic data 1` and `Basic data 2` are visible.
- The page heading identifies `Display Material 1000439 (Raw material)`.
- Basic Data 1 includes Base Unit of Measure `EA` (optional additional assertion).

## Locator Map

| Area | Role/name or locator |
| --- | --- |
| Logon user | `getByRole('textbox', { name: 'User' })` |
| Logon password | `getByRole('textbox', { name: 'Password' })` |
| Authenticated shell | `getByRole('button', { name: /Profile of/ })` |
| Launchpad search control | `getByRole('button', { name: 'Open Search' })` |
| Launchpad search input | `getByRole('searchbox', { name: 'Search' })` |
| Display Material app | Exact link name `Display Material` |
| App frame | `page.frameLocator('iframe')` |
| Initial material field | App-frame textbox `Material Required` |
| View dialog | App-frame dialog `Select View(s)` |
| View row selectors | First `gridcell` in rows matching `Basic Data 1` and `Basic Data 2` |
| Continue action | Dialog button name matching `/Continue/` |
| Result material field | App-frame textbox `Material` |
| Result description | App-frame textbox `Descr.` |

## Notes for Code Generation

- Use `test` and `expect` from `@playwright/test`.
- Fail early with a clear message if either credential environment variable is missing.
- Prefer accessible roles/names and iframe-scoped locators over CSS tied to generated SAP IDs.
- Use `expect(locator).toBeVisible()` / `toHaveValue()` to wait on application state. Do not use fixed delays.
- The logon page may show an alert about HTTP logon while the page URL is HTTPS; in the observed run, submitting the form still reached the authenticated launchpad. Treat the alert as non-blocking only if the shell profile appears.
- The live run completed successfully: material `1000439`, description `NK test Material`, and both Basic Data tabs were displayed.

## Running the Test

Set `SAP_USERNAME` and `SAP_PASSWORD` in the environment, then run:

```powershell
npx playwright test tests/sap-display-material.spec.ts --project=chromium
```