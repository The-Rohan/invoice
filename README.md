# Mandi Invoice

A focused, offline Urdu fish-market billing app for Intel Mac and Windows x64. Search/select a fish, enter the **negotiated rate for that row**, enter its weight, then save and print. No fixed fish prices, account signup, cloud service or subscription.

This is a new standalone MIT-licensed Electron app, not an Invoiso fork or an Invoiso database upgrade. Invoiso was inspected at commit `a7f9f6da9de149214142a4b2b6188efba85994e4`; no upstream application source was copied. Your existing Invoiso database remains separate. Importing it needs a version-specific migration, which is not implemented here.

## Use it

1. Open the app and choose **Business settings**. Confirm the Urdu business name, address and contact numbers.
2. Choose **New invoice**, enter a customer, bill number and date. Previously saved customer names are searchable and fill their contact details.
3. Search/type each fish name. Enter kilograms and the rate agreed with this buyer **per 40 kg**. Add as many rows as needed. Repeated fish can have different prices.
4. Enter commission, fee, labour, freight, previous balance and payment. Previous balance is explicitly entered; this app does not maintain an automatic customer ledger.
5. **Save invoice**, then **Preview & print → Print / Save PDF**. Use A4 landscape, 100% scale, no browser headers, and backgrounds enabled. The native operating-system print dialog provides PDF saving where configured.
6. Use **Back up** regularly. **Restore** validates a backup and asks before replacing data.

**Try the screenshot example** loads all 17 screenshot rows and sample details. Sample prices never populate a new bill. Unsaved edits prompt before navigation/closing. Saved bill numbers must be unique. A saved invoice captures its business header so later business changes do not rewrite it.

## Downloads and platform status

Local build outputs: `dist/Mandi Invoice-1.0.0-mac.zip` (Intel x64 `.app`) and `dist/Mandi Invoice-1.0.0-win.zip` (Windows x64 portable folder). Extract the entire Windows archive, keeping its supporting files beside the EXE. On Mac, extract and move the app to Applications.

These are unsigned builds. macOS may require the normal Privacy & Security “Open Anyway” approval; Windows may show a publisher warning. No signing or notarization credentials have been provided. Do not disable OS protection globally.

The GitHub Actions workflow builds an Intel Mac DMG and a Windows installer, and runs a real desktop launch/save/restart test on each OS. Artifacts appear under the successful workflow run. A configured workflow is not evidence that its run passed. See `docs/VALIDATION.md` for actual results and remaining platform checks.

## Development

Node.js 24, npm, and the host desktop environment are required for `npm start`.

```sh
npm ci
npm test
npm start
```

Browser integration tests on Linux use installed Chromium and Poppler's `pdfinfo`:

```sh
npm run test:ui
```

`CHROMIUM_PATH` can select another Chromium executable. Tests cover actual PDF page counts, not only HTML containers.

```sh
node test/desktop.mjs  # native Electron launch, file persistence, restart
npm run pack:mac      # Intel Mac ZIP; cross-build supported
npm run pack:win      # Windows x64 ZIP; cross-build supported
npm run dist:mac      # DMG, run on macOS
npm run dist:win      # NSIS installer, run on Windows
```

In the managed cloud environment retain its proxy and CA configuration. Electron downloads additionally need `ELECTRON_GET_USE_PROXY=1`, `GLOBAL_AGENT_HTTP_PROXY="$HTTP_PROXY"`, and `GLOBAL_AGENT_HTTPS_PROXY="$HTTPS_PROXY"`. TLS verification stays enabled.

## Data and limitations

Desktop data is an atomically replaced JSON file in Electron's OS-specific application data directory. The previous file is retained as `invoices.json.previous`. No telemetry or application network requests. Browser development mode uses localStorage instead and is separate from desktop data. Backups are portable JSON, contain customer details, and should be stored privately.

The layout follows the supplied screenshot, but it is not a certified pixel/letter-perfect reconstruction. The original small Urdu address/customer text is ambiguous at this resolution; see the transcription notes. Noto Naskh Arabic is bundled under the SIL Open Font License for offline text shaping. Original paper dimensions and font are unknown; A4 landscape is the tested default. Long text, unusually large values and physical printer margins need review before production use.

No automatic ledger, stock control, tax compliance, Invoiso import, cloud sync or multi-user concurrency is implemented. Charges are explicit inputs; no unconfirmed business rule is silently inferred for the Rs 214 fee.

Full analysis, transcription, arithmetic and user journey: [docs/INVOICE-PLAN.md](docs/INVOICE-PLAN.md).
