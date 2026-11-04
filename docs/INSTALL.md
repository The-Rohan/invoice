# Installing the packaged app

Download installers from [GitHub Releases](https://github.com/The-Rohan/invoice/releases). Expand **Assets** beneath a published release. If it is still building, follow the [desktop workflow](https://github.com/The-Rohan/invoice/actions/workflows/desktop.yml). A release is published only after both native build/test jobs pass.

## Intel Mac

Download the file ending in **mac-intel.dmg**. Double-click the DMG, then drag **Mandi Invoice.app** to **Applications**. Open the app from Applications and eject the disk image.

This is an unsigned preview. If macOS blocks it as an unidentified developer, use the per-app **Privacy & Security → Open Anyway** flow if you trust this build. Do not disable Gatekeeper globally. The app targets Intel x64. Automated tests do not replace a real-device check of installation and printing.

## Windows 10/11 x64

Download the file ending in **windows-x64.exe**, run it and follow the setup wizard. Setup installs for the current user without administrator elevation. Check the release’s `WINDOWS-SECURITY.txt` for actual signing and scan results. Unsigned builds may show publisher warnings; never bypass a Defender threat alert. Windows 7 is unsupported. See [Windows security](WINDOWS-SECURITY.md).

## Portable archives

A Mac ZIP contains the app to drag into Applications. A Windows portable ZIP must be extracted in full; run **Mandi Invoice.exe** with all supporting files alongside it. These are distinct from GitHub's **Source code (zip)**, which contains development files only.

## First bill

Open **Business settings** and confirm the Urdu business name and contact details. Click **New invoice**, choose/type the customer, then enter each fish, weight and negotiated rate. Rates are per 40 kg and are never fixed by fish name. Save, preview and print using A4 landscape.

Keep a backup before importing or moving data. The backup format is specific to this app; do not restore an Invoiso database into it.
