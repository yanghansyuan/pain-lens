@echo off
set "XDG_CONFIG_HOME=%~dp0.local-config"
cd /d "%~dp0"
npm.cmd run dev -- --host 127.0.0.1 --port 3000 > "%~dp0dev-server.log" 2> "%~dp0dev-server.err.log"
