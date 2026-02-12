# Convert all remaining CommonJS files to ES modules
$files = @(
    "controllers\authController.js",
    "controllers\bookingController.js",
    "controllers\contactController.js",
    "controllers\galleryController.js",
    "controllers\announcementController.js",
    "controllers\settingsController.js",
    "models\Tour.js",
    "models\Booking.js",
    "models\User.js",
    "models\Contact.js",
    "models\Gallery.js",
    "models\Announcement.js",
    "models\Settings.js",
    "utils\emailService.js"
)

foreach ($file in $files) {
    $path = Join-Path $PSScriptRoot $file
    if (Test-Path $path) {
        $content = Get-Content $path -Raw
        
        # Replace require statements
        $content = $content -replace "const\s+(\w+)\s*=\s*require\('([^']+)'\);", "import `$1 from '`$2.js';"
        $content = $content -replace "const\s+(\w+)\s*=\s*require\(`"([^`"]+)`"\);", "import `$1 from '`$2.js';"
        $content = $content -replace "require\('dotenv'\)\.config\(\);", "import dotenv from 'dotenv';\ndotenv.config();"
        
        # Replace exports
        $content = $content -replace "module\.exports\s*=\s*(\w+);", "export default `$1;"
        $content = $content -replace "exports\.(\w+)", "const `$1"
        
        # Add export default at end if needed
        if ($content -notmatch "export default") {
            $functions = [regex]::Matches($content, "const\s+(\w+)\s*=\s*async\s*\(")
            if ($functions.Count -gt 0) {
                $funcNames = $functions | ForEach-Object { $_.Groups[1].Value }
                $exportLine = "`n`nexport default { " + ($funcNames -join ", ") + " };"
                $content += $exportLine
            }
        }
        
        Set-Content $path $content -NoNewline
        Write-Host "Converted: $file" -ForegroundColor Green
    }
}

Write-Host "`nConversion complete!" -ForegroundColor Cyan
