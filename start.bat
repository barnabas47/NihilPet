@echo off
title NihilPet 9000 - Existential Tamagotchi
cd /d "%~dp0"

echo ========================================================
echo   [👾] NIHILPET 9000 - EXISTENTIAL TAMAGOTCHI
echo   "Because all CSS will eventually dissolve into entropy."
echo ========================================================
echo.

if not exist node_modules (
    echo [*] node_modules mappa nem talalhato, fuggosegek telepitese...
    call npm.cmd install
    if errorlevel 1 (
        echo [HIBA] npm install meghiusult!
        pause
        exit /b 1
    )
)

echo [*] Bongeszo inditasa: http://localhost:3000 ...
start "" http://localhost:3000

echo [*] Vite szerver inditasa (Ctrl+C-vel leallithato)...
echo.
call npm.cmd run dev

if errorlevel 1 (
    echo.
    echo [!] A szerver leallt.
    pause
)
