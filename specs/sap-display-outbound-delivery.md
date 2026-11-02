# SAP Display Outbound Delivery Workflow

## Purpose

Record the observed SAP Fiori workflow and Playwright locator guidance for checking the Document Flow status of outbound delivery `80000432`.

## Environment and Security

- Launchpad URL: `https://s4tr4.applexus.com:8444/sap/bc/ui2/flp?sap-client=100`
- Read credentials from `SAP_USERNAME` and `SAP_PASSWORD` environment variables. Do not include credentials in this document, source code, logs, screenshots, or test reports.
- Use the project's configured Chromium project and HTTPS settings.
- The SAP GUI application is hosted in `iframe[name="application-OutboundDelivery-displayInWebGUI-iframe"]`.

## Observed Workflow

1. Navigate to the launchpad and log on. The login screen exposes `User`, `Password`, and `Log On`; wait until the shell profile button whose name starts with `Profile of` is visible.
2. Open `Open Search` and search for `Display Outbound Delivery`.
3. The search results include both `Display Outbound Delivery - Proof of Delivery` and `Display Outbound Delivery`. Open the exact `Display Outbound Delivery` result (not the Proof of Delivery app).
4. The app opens to a selection screen with textbox `Outbound Delivery` and button `Continue Emphasized`.
5. Enter `80000432` and click `Continue Emphasized`. The delivery opens in the Overview screen; its heading is `Outbound Delivery 80000432 Display: Overview` and its display field is `Outbound Deliv.` with value `80000432`.
6. Open the toolbar's `More` menu and choose menu item `Document Flow`. The action is in this menu on the overview screen.
7. In Document Flow, the grid has columns `Document`, `On`, `Time`, and `Status`. The delivery appears with its SAP-padded number `Outbound Delivery 0080000432`. Its row shows status `Completed` (observed date/time: `07.01.2025 22:57:36`).
8. Assert that the Document Flow entry corresponds to `Outbound Delivery 0080000432` and that its status is exactly `Completed`. Fail if the row is missing or shows any other status.

## Locator Guidance

| Area | Observed locator |
| --- | --- |
| Launchpad user | `page.getByRole('textbox', { name: 'User' })` |
| Launchpad password | `page.getByRole('textbox', { name: 'Password' })` |
| Log on | `page.getByRole('button', { name: 'Log On' })` |
| Authenticated shell | `page.getByRole('button', { name: /^Profile of/ })` |
| Search control | `page.getByRole('button', { name: 'Open Search' })` |
| Search field | `page.getByRole('searchbox', { name: 'Search' })` |
| App result | Exact result `Display Outbound Delivery`; distinguish it from `Display Outbound Delivery - Proof of Delivery` |
| Application frame | `page.frameLocator('iframe[name="application-OutboundDelivery-displayInWebGUI-iframe"]')` |
| Delivery selection field | App-frame textbox `Outbound Delivery` |
| Continue action | App-frame button `Continue Emphasized` |
| Open More menu | App-frame button `More` |
| Document Flow action | App-frame menu item `Document Flow` |
| Delivery entry | A Document Flow grid row containing link `Outbound Delivery 0080000432` |
| Completion status | In the same outer flow row as the delivery entry, button `Completed` |

For the completion assertion, locate the outer Document Flow row containing the exact delivery link, then assert that this row contains a button named exactly `Completed`. This binds the status check to the outbound delivery instead of passing because another document in the flow is completed.

## Playwright Generation Requirements

- Implement the steps as one sequential `@playwright/test` test. The workflow is read-only after authentication.
- Read credentials from environment variables and fail before navigation if either variable is missing.
- Use `test.step` labels for login, app search/open, delivery lookup, Document Flow navigation, and status verification.
- Verify the selected app and delivery number before asserting status. The search result must be the exact `Display Outbound Delivery` app; the input number is `80000432`, while SAP displays it in the flow as `0080000432`.
- Do not assert `Completed` globally. Scope the status assertion to the flow row containing the exact outbound delivery link.
- If screenshots are added, save them under the test output directory or `output/` with numbered step names. Never capture the password field while it contains a credential.
- Do not hard-code the observed date/time as a status requirement; status `Completed` is the required outcome.

## Live-Run Outcome

- Authentication succeeded and the exact `Display Outbound Delivery` app opened.
- Delivery `80000432` opened successfully.
- The toolbar `More` menu contained the `Document Flow` action.
- The Document Flow grid showed `Outbound Delivery 0080000432` with status `Completed`.

