$ErrorActionPreference = 'Stop'
$report = [System.Collections.Generic.List[string]]::new()
$report.Add('Windows build security checks (this is not a guarantee about future detections or SmartScreen reputation).')
$report.Add("UTC: $([DateTime]::UtcNow.ToString('o'))")
try {
$mustSign = $env:SIGNING_CONFIGURED -eq 'true' -or $env:REQUIRE_WINDOWS_SIGNING -eq 'true'
$targets = @((Get-Item 'dist/win-unpacked/Mandi Invoice.exe')) + @(Get-ChildItem 'release/*.exe')
foreach ($file in $targets) {
    $signature = Get-AuthenticodeSignature -LiteralPath $file.FullName
    $report.Add("Authenticode $($file.Name): $($signature.Status)")
    if ($signature.SignerCertificate) { $report.Add("Publisher: $($signature.SignerCertificate.Subject)") }
    if ($mustSign -and $signature.Status -ne 'Valid') { throw "Required signature is not valid: $($file.Name)" }
    if ($signature.Status -notin @('Valid', 'NotSigned')) { throw "Invalid signature: $($file.Name)" }
}
$status = Get-MpComputerStatus -ErrorAction SilentlyContinue
$scanner = Get-ChildItem "$env:ProgramData/Microsoft/Windows Defender/Platform/*/MpCmdRun.exe" -ErrorAction SilentlyContinue | Sort-Object FullName -Descending | Select-Object -First 1
if (-not $scanner -and (Test-Path "$env:ProgramFiles/Windows Defender/MpCmdRun.exe")) { $scanner = Get-Item "$env:ProgramFiles/Windows Defender/MpCmdRun.exe" }
if ($status.AntivirusEnabled -and $scanner) {
    Update-MpSignature
    $status = Get-MpComputerStatus
    $report.Add("Defender signatures: $($status.AntivirusSignatureVersion), updated $($status.AntivirusSignatureLastUpdated)")
    foreach ($folder in @('dist/win-unpacked', 'release')) {
        & $scanner.FullName -Scan -ScanType 3 -File (Resolve-Path $folder).Path -DisableRemediation
        if ($LASTEXITCODE -ne 0) { throw "Defender scan failed or detected a threat in $folder (exit $LASTEXITCODE). Release blocked." }
        $report.Add("Defender scan $folder : passed")
    }
} else {
    $report.Add('Defender scan: NOT AVAILABLE on this runner. No antivirus-clean claim is made.')
    Write-Warning 'Defender is unavailable on this runner; see the published security report.'
}
$report | Set-Content 'release/WINDOWS-SECURITY.txt'
$report | ForEach-Object { Write-Output $_ }

} catch {
    $message = ($_.Exception.Message + ' | ' + ($report -join ' | ')).Replace('%', '%25').Replace("`r", '%0D').Replace("`n", '%0A')
    Write-Output "::error::$message"
    throw
}
