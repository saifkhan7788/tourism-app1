$controllers = @('bookingController', 'contactController', 'galleryController', 'announcementController', 'settingsController')

foreach ($ctrl in $controllers) {
    $file = "controllers\$ctrl.js"
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        # Get model name from controller name
        $modelName = $ctrl -replace 'Controller', ''
        $modelName = (Get-Culture).TextInfo.ToTitleCase($modelName)
        
        # Replace require statements
        $content = $content -replace "const $modelName = require\('\.\.\/models\/$modelName'\);", "import $modelName from '../models/$modelName.js';"
        $content = $content -replace "const (\w+) = require\('([^']+)'\);", "import `$1 from '`$2';"
        
        # Find all exported functions
        $matches = [regex]::Matches($content, "exports\.(\w+)\s*=\s*async")
        $funcNames = @()
        
        foreach ($match in $matches) {
            $funcName = $match.Groups[1].Value
            $funcNames += $funcName
            $content = $content -replace "exports\.$funcName\s*=\s*async", "const $funcName = async"
        }
        
        # Add export default
        if ($funcNames.Count -gt 0) {
            $exportLine = "`n`nexport default { " + ($funcNames -join ", ") + " };"
            $content += $exportLine
        }
        
        Set-Content $file $content -NoNewline
        Write-Host "Converted: $file" -ForegroundColor Green
    }
}
