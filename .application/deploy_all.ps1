$projects = Get-ChildItem -Path 'C:\Users\pc gold\projet dash' -Directory
$sourceFile = 'C:\Users\pc gold\projet dash\herbute\.application\setup_testing.ps1'

foreach ($p in $projects) {
    if ($p.Name -eq 'herbute') { continue }
    $targetDir = Join-Path $p.FullName '.application'
    if (-not (Test-Path $targetDir)) { 
        New-Item -Path $targetDir -ItemType Directory -Force | Out-Null
    }
    Copy-Item -Path $sourceFile -Destination $targetDir -Force
    Write-Host "Deployed to: $($p.Name)" -ForegroundColor Green
}
