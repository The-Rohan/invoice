# Installing the packaged app

## Intel Mac

Download `Mandi Invoice-1.0.0-mac.zip`. Extract it and move **Mandi Invoice.app** into Applications. Open it. It is an unsigned build; if macOS blocks it as an unidentified developer, use its per-app **Privacy & Security → Open Anyway** flow only if you trust this build. Signing/notarization is not included. The archive targets Intel x64, not Apple Silicon. Actual Mac installation is not yet verified.

## Windows x64

Download `Mandi Invoice-1.0.0-win.zip` and extract the entire folder. Run **Mandi Invoice.exe** inside that folder. Do not copy the EXE alone; it needs the adjacent resources. A Windows installer is also produced by the GitHub Actions workflow after native tests pass. Builds are unsigned and may show a publisher warning. Actual Windows installation is not yet verified.

## First bill

Open **Business settings** and confirm the Urdu business name and contact details. Click **New invoice**, choose/type the customer, then enter each fish, weight and negotiated rate. Rates are per 40 kg and are never fixed by fish name. Save, preview and print using A4 landscape. For the supplied example choose **Try the screenshot example**.

Keep a backup before importing or moving data. The backup format is specific to this app; do not restore an Invoiso database into it.
