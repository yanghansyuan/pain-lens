$ErrorActionPreference = "Stop"
$env:XDG_CONFIG_HOME = Join-Path $PSScriptRoot ".local-config"
Set-Location $PSScriptRoot
npm.cmd run dev -- --host 127.0.0.1 --port 3000
