# Validation record

Validated in the Linux x64 cloud instance on 2026-11-02. Node 24.19.0; Electron 39.8.10; Chromium 154. This record distinguishes executed checks from configured future checks.

## Passed

- `npm test`: **6 tests passed**, 0 failed/skipped. All 17 screenshot line amounts, weights/species sums, rounded commission, current bill and final balance reconcile. Independent negotiated rates, decimal flooring, payment subtraction, invalid values, duplicate backup bills, escaping and multipage structure covered.
- `npm run test:ui`: browser integration scenario passed. Sample entry, per-line negotiated rate edits, save/reload, search, settings, backup/restore, odd/even columns, embedded Urdu font and no uncaught page errors.
- Generated PDF checked by `pdfinfo`: screenshot sample **1 A4 landscape page**, 19-item overflow bill **2 pages**. A first attempt overflowed; print CSS was corrected and the checks rerun successfully. Printed PDF visually inspected for Urdu shaping, table arrangement and totals.
- `DISPLAY=:99 node test/desktop.mjs`: **native Electron Linux launch, JSON file save, preview, PDF generation, close/relaunch and persisted invoice** passed using a virtual X display. Displayless Ozone attempts failed; a verified Debian Xvfb package resolved this environment prerequisite.
- Intel Mac ZIP and Windows x64 ZIP packaging completed. File inspection identifies a Mach-O x86_64 Mac binary and a PE32+ x86-64 Windows executable. A successful cross-build is not an operating-system launch test.

Generated artifacts are under `dist/`. Test PDFs and screenshots are under `test-results/` and deliberately excluded from source control. `dist/SHA256SUMS` records checksums for final downloadable packages.

## Installer build limitation

The local Windows NSIS installer attempt failed because Wine is not installed in this Linux environment. The supported deliverable here is the Windows portable ZIP. Native Windows CI is configured to generate the installer without Wine. No successful local installer build is claimed.

## Not yet verified

- The Mac and Windows Actions jobs have not been observed to complete. They are configured to run the same native desktop persistence/PDF test before producing installers. GitHub API requests were denied by environment networking; `api.github.com` was added to the environment draft, not yet applied by that draft save.
- Actual Intel macOS and Windows installation, OS print dialogs, physical printing, and backup dialogs on those OSes.
- Apple signing/notarization and Windows code signing. Packages are unsigned.
- Exact small Urdu words, original font and original paper dimensions. Current transcription has explicitly documented uncertainty.
- Import/migration of the user's existing Invoiso data. This standalone app has a different data format.

Do not describe these artifacts as fully tested on Mac and Windows until the native jobs and real-device acceptance checks succeed.

## Installer release workflow update

The release workflow now builds native Intel Mac DMG and Windows NSIS EXE installers, tests the packaged executables, and publishes both with SHA-256 checksums for a matching version tag. Publication requires both platform jobs to succeed.

The workflow YAML was parsed and its build dependency/permissions checked locally. The modified desktop harness passed against both the Linux source application and `dist/linux-unpacked/mandi-invoice`, including save/restart and native PDF generation. All six calculation tests also passed. Native Mac/Windows release outcomes remain unobserved from this environment while GitHub API access is blocked.

## Version 1.0.2 fish entry

Eight model tests pass. Browser integration now also verifies chip selection, weight-to-rate Enter navigation, live price rounding, rejection of empty lots, blocking save/preview with an unadded lot, Enter/click addition, clearing fields and returning focus, repeated fish with independent rates, custom fish, save/reload, and replacement of the initial blank row. The full browser/PDF suite passed and software screenshots were regenerated.

## Version 1.0.4 customer balances

Ten local model tests passed, including multi-bill carry-forward, payments, edits to earlier linked invoices, credit balances, duplicate-name disambiguation, missing/circular/wrong-customer links. Browser integration passed returning-customer autofill, clearing when switching to a new customer, read-only carried amounts, save/reopen without double-counting, and printed closing balance. Existing calculation and PDF checks also passed.

## Version 1.0.5 deletion and unsaved-work flows

Eleven model tests passed, including safe deletion, restore order, retained invoice numbering and linked balance protection. Browser integration passed deletion confirmation/cancellation, restore, blocked parent deletion, absent demo button, unsaved cancellation/discard, saving business settings before navigation, and staying on invalid drafts. Native Electron tests passed closing via Cancel, Save and Discard, with file contents checked after exit. The existing calculator, PDF, backup and returning-customer checks also passed.
