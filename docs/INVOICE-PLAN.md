# Screenshot analysis and delivery plan

## What is certain, and what is not

This is an Urdu buyer bill from a fish market/commission agent. It is not a generic retail VAT invoice. The structure and every numeric line can be reconstructed. Small proper names, the address and a few footer labels cannot be certified letter-perfect from the supplied 707×621 image. Editable text is provided rather than presenting guesses as exact OCR. The Windows activation watermark is an operating-system overlay, not invoice content, and is intentionally excluded.

### Header transcription

| Position | Visible reading | Confidence / treatment |
|---|---|---|
| Centre | ملک مچھلی منڈی | High; business title |
| Below title | مین گجرات روڈ … پُل … چک | Low for full wording; current editable default is provisional |
| Tagline | … کمیشن ایجنٹ | Commission agent is clear; leading words uncertain |
| Bill title | خریدار بل | High |
| Right | پروپرائٹر / ملک فہیم خالد | Readable; confirm spelling |
| Right phones | 0347-4904825 / 0343-0503100 | High |
| Left name | محمد طاہر تارڑ | Readable; confirm spelling |
| Left phone | 0344-6559500 | High |
| Manager | منیجر : رانا بابر | Readable; confirm spelling |
| Manager phones | 0300-5627353 / 0341-6065365 | High |

The small “فون نمبر” contact label is visible in the source but not repeated beside the header phone numbers in this implementation. The general header arrangement is preserved; this difference must be resolved for a literal replica.

### Grey rounded customer panel

Right-hand group: نام گاہک, پتہ, فون نمبر. Left-hand group: تاریخ, بل نمبر, کھاتہ نمبر.

- Date: **4-Oct-26**; interpreted as 2026-10-04.
- Bill number: **6110**.
- Account number: **958**.
- Customer phone: **03034594274**.
- Customer appears to read **آصف ماچھی … گڑھ**; the middle place-name is uncertain. The sample's complete name/address are editable provisional transcriptions.

### Items: exact numeric transcription

Each half has columns, left to right: قیمت (amount), ریٹ (rate), وزن (weight), تفصیل (description and serial). Odd serials go down the left half, even serials down the right. This is not two unrelated invoices.

Fish spellings below are provisional where needed; common English identifiers are only explanatory, not replacements for the user's chosen Urdu names.

| # | Fish as entered | kg | Negotiated rate / 40 kg | Printed rupees |
|---:|---|---:|---:|---:|
| 1 | کفام | 21.00 | 20500 | 10762 |
| 2 | کفام | 20.00 | 21500 | 10750 |
| 3 | روہو | 4.50 | 19000 | 2137 |
| 4 | سلور | 72.50 | 14200 | 25737 |
| 5 | روہو | 44.00 | 19000 | 20900 |
| 6 | روہو | 17.00 | 13500 | 5737 |
| 7 | روہو | 41.50 | 16500 | 17118 |
| 8 | روہو | 7.50 | 21000 | 3937 |
| 9 | تھیلہ | 45.50 | 18000 | 20475 |
| 10 | روہو | 42.50 | 17000 | 18062 |
| 11 | تھیلہ | 42.00 | 17500 | 18375 |
| 12 | تھیلہ | 11.50 | 17500 | 5031 |
| 13 | تھیلہ | 27.00 | 13500 | 9112 |
| 14 | تھیلہ | 23.00 | 13500 | 7762 |
| 15 | بگ ہیڈ | 18.00 | 13000 | 5850 |
| 16 | بگ ہیڈ | 86.50 | 14500 | 31356 |
| 17 | گراس | 20.50 | 23000 | 11787 |

The first species may have a different local spelling. Verify against the original document. The editor allows free-form fish names and suggests both initial names and previously saved names. **No species has a fixed price.** Each row captures the agreed price independently, as requested by the user.

## Arithmetic reconstructed from evidence

`line rupees = floor(kilograms × negotiated rate ÷ 40)`

No weight deduction is needed to reconcile the screenshot. The earlier suspicion of an adjustment was resolved by flooring each line. Summing unrounded values gives 224893.75 and would be incorrect for this bill. Summing the 17 floored lines gives **224888**.

| Stage | Calculation | Result |
|---|---|---:|
| Total weight | Sum all rows | 544.5 kg |
| Weight in maunds | 13 × 40 + 24.5 | 13 maunds, 24.5 kg |
| Goods / خام بکری | Sum displayed line amounts | 224888 |
| Commission / کمیشن | round(224888 × 2%) | 4498 |
| Fee, likely منشیانہ | Explicit amount; basis unknown | 214 |
| Subtotal / پکی بکری | 224888 + 4498 + 214 | 229600 |
| Labour / مزدوری | Explicit amount | 200 |
| Freight / کرایہ | Explicit amount | 2000 |
| Other adjustment | Explicit amount | 0 |
| Current bill / موجودہ بل رقم | 229600 + 200 + 2000 | 231800 |
| Previous balance / سابقہ بقایا | Explicit amount | 287450 |
| Received / نقد وصولی | Explicit amount | 0 |
| Balance / واجب الوصول رقم | 231800 + 287450 − 0 | 519250 |

The 2% commission is inferred from this example and editable; it is not a confirmed universal business rule. The Rs 214 fee stays manual. Some small footer labels are uncertain; changing them requires confirmation. Negative final balance is allowed when the payment exceeds the balance and represents customer credit.

Species totals: کفام 41.0 kg; سلور 72.5; روہو 157.0; تھیلہ 149.0; بگ ہیڈ 104.5; گراس 20.5. The strip uses the screenshot's species order, with additional custom species appended. Footer includes signature line and نوٹ. There is no tax, discount, logo or QR visibly required.

## Operator journey

1. **One-time setup:** business name/address, owner/manager contacts. Confirm ambiguous wording once. Bundled font works offline; no font installation.
2. **Start bill:** one New invoice action. Sequential suggested bill number and today's date; both editable. Choose/type customer. Previously used customers fill address, phone and account number.
3. **Enter sale:** search/type fish → kilograms → negotiated rate per maund → Tab to next field. Amount updates immediately. Add fish, repeat. Same fish may appear multiple times with different rates. Remove mistaken rows before saving.
4. **Settle charges:** commission percentage, fee, labour, freight, other charge, previous balance and money received. Three large totals show goods with commission/fee, current bill, and full balance. Previous balance is manual to avoid silently creating an inaccurate ledger.
5. **Save:** validation checks customer/date/bill number, positive item weight/rate, supported decimal precision and unique bill number. Desktop writes atomically and preserves the previous data file.
6. **Preview:** familiar grey panel, paired columns, species summary, account totals, signature and note. 18 items per sheet, additional sheets repeat the header, totals appear only on the final sheet.
7. **Print or PDF:** native print dialog. Tested output uses A4 landscape. Confirm real paper size and physical printer margins before production use.
8. **Return later:** search bills by customer, number or account; open/edit/save; backup to a chosen file; restore only after validation and replacement confirmation.

## Architecture and choice

Invoiso was inspected at upstream commit a7f9f6da9de149214142a4b2b6188efba85994e4. It uses Flutter, SQLite, Riverpod, the Dart pdf/printing stack, and includes desktop projects. Its customer/payment/inventory features are useful if retaining an existing database is mandatory. An in-place implementation would need a versioned schema extension, a separate fish-market calculator, an RTL template, bundled Urdu fonts, and migration tests against a copy of the user's actual database.

The supplied target repository had no commits or files, and no customized Invoiso code/database was available. This delivery therefore implements a small standalone Electron app with browser-based Urdu shaping and printing. It does not claim to have modified the user's existing installation. Switching to another large accounting suite would still require the same custom layout/calculator and add more setup; no second suite was selected or benchmarked.

Modules: exact-decimal calculation and validation (`src/model.js`); editor/history/settings (`src/app.js`); escaping and multipage print rendering (`src/print.js`); native file save/backup/print bridge (`electron/`); browser and desktop tests (`test/`); native installer CI (`.github/workflows/desktop.yml`).

## Release acceptance and remaining decisions

Implemented and tested here: screenshot arithmetic; individual negotiated rates; item entry; persistence in browser tests; settings; JSON backup/restore; preview; Urdu font loading; one-page sample and two-page overflow PDFs. Local archives exist for Intel Mac and Windows x64.

Before calling it production-ready:

- Confirm ambiguous Urdu spelling, full address, first species, footer labels, original font and paper size. The current rendering is structurally close, not pixel-perfect.
- Run native CI and install/open the generated installer on actual Intel macOS and Windows; verify native file saving after restart and native print/PDF dialogs. Linux browser tests cannot establish those outcomes.
- Sign/notarize the Mac app and sign Windows binaries if distributing without unidentified-publisher prompts. This needs the owner's signing identities.
- If replacing an existing Invoiso deployment, provide its source revision and a representative non-sensitive export/schema. Build and validate an explicit import/migration before moving real records.
- Automatic customer ledgers, payment histories, invoice deletion/voiding, stock and reports are separate future features. This version has manual previous balances and editable saved invoices, not an immutable accounting journal.
