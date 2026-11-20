# DuplicateCleaner Launcher para PowerShell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║               DuplicateCleaner v1.0                  ║" -ForegroundColor Cyan
Write-Host "║     Limpiador de Archivos Duplicados Local / PWA     ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[!] Node.js no está instalado en este sistema." -ForegroundColor Red
    Write-Host "Descárgalo en: https://nodejs.org" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Presiona Enter para salir..."
    exit 1
}

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

if (-not (Test-Path "dist\index.html")) {
    Write-Host "[!] Carpeta dist no encontrada. Compilando aplicación..." -ForegroundColor Yellow
    npm run build
}

Write-Host "[OK] Iniciando DuplicateCleaner en http://localhost:3000..." -ForegroundColor Green
node server.js
