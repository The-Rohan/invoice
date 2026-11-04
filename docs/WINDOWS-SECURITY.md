# Windows security and compatibility

Supported target: Windows 10/11 x64. Electron no longer supports Windows 7/8/8.1. Maintaining an obsolete runtime for those systems would remove security fixes. Use an OS still receiving security updates (Windows 10 requires an appropriate extended-support arrangement). Native CI runs on Windows Server 2022; it does not certify every Windows desktop edition or physical printer.

The application works offline, opens no listening network ports, blocks renderer web requests and denies browser permissions. It needs no firewall exception. Windows manages USB/network printer drivers and printer connections separately. Installation is per-user without administrator elevation. Invoice data stays in the current user's application-data directory; the app does not encrypt it at rest. Protect the Windows account and backups.

## Download verification

Download only from this repository's Releases page. Compare the download's SHA-256 with `SHA256SUMS` using PowerShell `Get-FileHash`. This verifies that the file matches the release; it is not an antivirus certification.

Each new release includes `WINDOWS-SECURITY.txt`: Authenticode status for the application and installer, plus Defender scan results and definition version when Defender is available on the build runner. A detected threat or a failed enabled scan blocks publication. If the runner cannot scan, the report explicitly says so. A clean scan cannot guarantee future scanners will agree.

## Signing for maintainers

The Windows application and installer support electron-builder Authenticode signing. Configure repository Actions secrets `WIN_CSC_LINK` (a signing certificate in electron-builder's supported form, typically base64 PFX) and `WIN_CSC_KEY_PASSWORD`. Never commit certificates/passwords or send them through chat. Use a certificate issued for your publisher by a trusted CA; a self-signed certificate does not establish public trust. Modern CA certificates often require hardware/cloud custody; those require the provider's signing integration rather than exporting its key into a PFX.

Set the Actions variable `REQUIRE_WINDOWS_SIGNING=true` to fail builds unless signing succeeds. When a certificate is configured, the security check also requires valid signatures on both executable and installer. Until credentials are configured and the published report confirms `Valid`, treat the build as unsigned. macOS signing is separate.

Signing identifies the publisher and protects executable integrity. It does not guarantee SmartScreen reputation or remove Defender detections.

## When Windows reports a problem

- **Defender threat:** keep it blocked. In Windows Security → Virus & threat protection → Protection history, capture the exact threat name, affected file and definition version. Do not disable protection, add exclusions or restore the quarantined file merely to run it. Maintainers should investigate the exact release and, if confirmed a false positive, submit it through [Microsoft's file analysis portal](https://www.microsoft.com/en-us/wdsi/filesubmission).
- **Unknown publisher / Windows protected your PC:** this is publisher/reputation checking, distinct from a malware threat. A valid trusted signature and subsequent Microsoft reputation are the legitimate solution.
- **Firewall prompt:** the billing app does not require inbound network access. Check the named executable; printer network access is handled by Windows and its drivers. Do not open firewall ports for this app.

There is no responsible setting that guarantees removal of every Windows security message.
