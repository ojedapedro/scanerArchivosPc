@echo off
chcp 65001 >nul
title DuplicateCleaner - Detector de Archivos Duplicados

echo.
echo  ╔══════════════════════════════════════════════════════╗
echo  ║               DuplicateCleaner v1.0                  ║
echo  ║     Limpiador de Archivos Duplicados Local / PWA     ║
echo  ╚══════════════════════════════════════════════════════╝
echo.

:: 1. Verificar si Node.js está disponible
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo  [!] Node.js no fue encontrado en tu sistema.
    echo.
    echo  Para ejecutar la aplicacion localmente necesitas instalar Node.js.
    echo  Descargalo gratis en: https://nodejs.org (Version LTS recomendada).
    echo.
    pause
    exit /b 1
)

:: 2. Verificar que la carpeta dist existe
if not exist "dist\index.html" (
    echo  [!] La carpeta de distribucion 'dist' no se encontro.
    echo  Generando build de produccion...
    call npm run build
)

echo  [OK] Node.js detectado.
echo  [OK] Archivos de produccion verificados.
echo.
echo  Iniciando servidor local y abriendo el navegador...
echo.

:: 3. Iniciar el servidor local nativo sin dependencias
node server.js

pause
