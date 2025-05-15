# Get the script path
$scriptPath = Split-Path -Parent -Path ([System.IO.Path]::GetFullPath($MyInvocation.MyCommand.Definition))

# Define paths relative to the script path
$pathTsconfig = Join-Path $scriptPath "..\tsconfig.json"
$pathMain = Join-Path $scriptPath "main.ts"

# Check if $pathMain exists, if not, change it to .js extension
if (-Not (Test-Path $pathMain)) {
  $pathMain = Join-Path $scriptPath "main.js"
}

# Set NODE_OPTIONS environment variable if not already set
if ([string]::IsNullOrEmpty($env:NODE_OPTIONS)) {
  $env:NODE_OPTIONS = "--max_old_space_size=8192"
}

# Export env vars
$env:SCRIPT_PATH = $scriptPath
$env:PATH_TSCONFIG = $pathTsconfig
$env:PATH_MAIN = $pathMain

# Run the main file using bun
& bun run $pathMain @args
