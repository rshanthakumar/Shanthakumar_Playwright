# SAP Create Purchase Order - Advanced Workflow

## Purpose

This document records the observed SAP Fiori flow and locator guidance for a future Playwright TypeScript test of **Create Purchase Order - Advanced**. The live run reached item validation but did not save a purchase order because the requested material could not be confirmed for the requested plant.

## Environment and Security

- Launchpad URL: `https://s4tr4.applexus.com:8444/sap/bc/ui2/flp?sap-client=100`
- Read credentials from `SAP_USERNAME` and `SAP_PASSWORD`. Do not store credentials in the spec, this document, test reports, or screenshots.
- Use the project’s Chromium Playwright configuration. Prefer trusting the SAP server certificate in the test environment rather than adding new certificate-validation bypasses.
- The purchase-order application is hosted in the iframe `iframe[name="application-PurchaseOrder-create-iframe"]`.

## Observed Workflow

1. Navigate to the launchpad URL. The logon form exposes `User`, `Password`, and `Log On`.
2. Log on and wait for the shell profile button whose accessible name starts with `Profile of`.
3. Open `Open Search`. Searching for `Create Purchase Order` displayed the requested app, `Create Purchase Order - Advanced`. A prior attempt using the full exact title displayed `No results`; retry with the shorter phrase if needed.
4. Open the exact result `Create Purchase Order - Advanced`.
5. The app opened in the SAP GUI application iframe with `Order Type` already set to `Standard PO`. Preserve/assert the displayed value rather than choosing an ambiguous duplicate.
6. Enter supplier `5000000001` and press Enter. The supplier resolved to `5000000001 Bike Berry Corporate`. The header’s `Org. Data` tab was selected.
7. In `Org. Data`, enter:
   - `Purch. Org.`: `IBUP` (displayed description: `IBC US P.org`)
   - `Purch. Group`: `IBU` (displayed description: `IBC US P.grp`)
   - `Company Code`: `IBU1` (displayed description: `Integrated Bike Co. - USA`)
8. In the first item row, enter material `100079`. The table exposes columns `Material`, `Short Text`, `PO Quantity`, and `Plant`; the item row controls are not all given accessible names, and the GUI table is horizontally scrollable.
9. Confirm the selected material is exactly `100079` before proceeding. In the live browser run, typing `100079` opened a list of 11 suggestions, including `1000790`, but no exact `100079`. A prior full material lookup also returned similar numbers without an exact match. If the exact material is unavailable, stop without selecting a substitute.
10. Only after exact material confirmation, enter PO quantity `10` and plant `IBP1`, then press Enter to validate. A previous attempt continued with the `1000790` suggestion and SAP displayed `Material 1000790 not maintained in plant IBP1`. Do not save while this error is present.
11. Once the requested material/plant combination is confirmed and validation succeeds, click `Save Emphasized`. If a confirmation dialog with a `Save` button appears, click it.
12. Assert the success message and capture the generated PO number from the message or `Purchasing Document` field. Neither was available during this run because no PO was saved.

## Playwright Generation Contract

- Implement this as one sequential `@playwright/test` test; creating a purchase order is a state-changing operation and must not run concurrently with another copy of this test.
- Read `SAP_USERNAME` and `SAP_PASSWORD` from the environment. Fail before opening the launchpad if either is missing. Do not print them or include them in attachments, reports, or screenshots.
- Keep the SAP steps in order: login; app search/open; verify `Standard PO`; supplier; organizational data; material/quantity/plant; validation; save; confirmation if shown; success and PO number.
- Capture a numbered screenshot after each meaningful step, including before login, the authenticated home, search results, app open, order type, supplier, org data, item entry, validation, save/confirmation, and success. Use `output/sap-po-step-NN-<stage>.png`; do not capture a screenshot while the password is visible.
- Stop with a clear test failure if material `100079` does not resolve to the exact requested value, or if plant validation reports an error. Do not choose `1000790` or another near match automatically. In that case, do not save and report that no PO number was generated.
- Only after successful validation, assert a success notification and extract a non-empty PO number from that notification or the `Purchasing Document` field. Include the PO number in test output without exposing credentials.

## Locator Guidance

| Area | Role/name or locator |
| --- | --- |
| Launchpad user | `getByRole('textbox', { name: 'User' })` |
| Launchpad password | `getByRole('textbox', { name: 'Password' })` |
| Authenticated shell | `getByRole('button', { name: /Profile of/ })` |
| Search control | `getByRole('button', { name: 'Open Search' })` |
| Search input | `getByRole('searchbox', { name: 'Search' })` |
| App result | Exact accessible name `Create Purchase Order - Advanced` |
| Application frame | `page.frameLocator('iframe[name="application-PurchaseOrder-create-iframe"]')` |
| Order type | App-frame textbox `Order Type`; assert value `Standard PO` |
| Supplier | App-frame textbox `Supplier` |
| Org. Data tab | App-frame tab `Org. Data` |
| Purchasing organization | App-frame textbox `Purch. Org.` |
| Purchasing group | App-frame textbox `Purch. Group` |
| Company code | App-frame textbox `Company Code` |
| Item table | App-frame grid; use column headers and the first item row when possible. The GUI table is horizontally scrollable and has frozen columns; inspect the table’s current row/cell structure rather than assuming all columns are initially visible. |
| Item field technical IDs | Material `MEPO1211-EMATN`, quantity `MEPO1211-MENGE`, plant `MEPO1211-NAME1` (technical IDs observed in the live UI; enclosing generated row/cell IDs are not stable) |
| Save action | App-frame button `Save Emphasized` |
| Success/PO number | Assert the success message; extract the generated number from that message or the `Purchasing Document` textbox |

## Notes for Code Generation

- Use `test` and `expect` from `@playwright/test`; keep credentials in environment variables and fail early if they are missing.
- Prefer role/name locators and frame-scoped locators. The item-grid fields are partly unnamed, and the SAP-generated item control IDs changed after validation; avoid hard-coding those IDs if a row/column locator is workable.
- For SAP GUI-style fields, a value displayed after programmatic `fill()` was not sufficient evidence that SAP had accepted the field. Use realistic keyboard interaction and the app’s Enter/Tab validation behavior, then assert the resolved value and any description/message before proceeding.
- Do not automatically accept autocomplete history or a similar material result. Require exact material number `100079`; the observed lookup did not list it.
- Do not click Save until the exact requested material is accepted and the validation error is cleared. The test should fail with a clear diagnostic instead of creating an order with a substitute.
- Capture a screenshot after each meaningful workflow stage with `await page.screenshot({ path: ..., fullPage: true })` or the project’s equivalent. Avoid capturing credentials.
- On a successful run, record the PO number as test output and verify it is non-empty.

## Live-Run Outcome

- Authentication succeeded and the requested app opened. The password was not included in any screenshot.
- Supplier and organizational values were displayed with resolved descriptions.
- In the current run, the material suggestions for `100079` contained nearby numbers (including `1000790`) but not the exact requested material. The list was left unselected.
- In a previous attempt, SAP resolved the input to `1000790`, then reported `Material 1000790 not maintained in plant IBP1`.
- The purchase order was not saved; there is no success message or generated PO number to report. Automation must not proceed with a substitute material.

## Screenshots

Screenshots from the live browser exploration are in `../output/`:

| Screenshot | Captured screen |
| --- | --- |
| `sap-po-step-01-login.png` | Launchpad logon page before credentials were entered |
| `sap-po-step-02-home.png` | Authenticated launchpad home |
| `sap-po-step-03-search-open.png` | Launchpad search opened |
| `sap-po-step-04-search-results.png` | Exact app-name query with no results |
| `sap-po-step-05-search-retry.png` | Shorter search query retry |
| `sap-po-step-06-create-po-app.png` | Create Purchase Order - Advanced opened |
| `sap-po-step-07-order-type.png` | Order type dropdown inspected |
| `sap-po-step-08-supplier.png` | Supplier resolved |
| `sap-po-step-09-org-data.png` | Organizational values entered |
| `sap-po-step-10-item-details.png` | Item entry screen |
| `sap-po-step-11-header-expanded.png` | Expanded header and organizational tab |
| `sap-po-step-12-plant-validated.png` | Plant validation error |
| `sap-po-step-13-material-search.png` | Material suggestions for `100079`; no exact match selected |
