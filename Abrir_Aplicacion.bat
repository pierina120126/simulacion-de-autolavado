@echo off
title AutoLavado Sim
echo ===================================================
echo             INICIANDO AUTOLAVADO SIM
echo ===================================================
echo.

cd /d "%~dp0"

if not exist "node_modules\" (
    echo Instalando dependencias por primera vez...
    call npm install
)

echo Abriendo en el navegador...
start http://localhost:5173

npm run dev
pause
