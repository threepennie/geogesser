@echo off
setlocal

set REPO_DIR=C:\dev\geogesser
set BRANCH=main

if not exist "%REPO_DIR%\.git" (
  echo [ERROR] Git repository not found: %REPO_DIR%
  pause
  exit /b 1
)

cd /d "%REPO_DIR%"

echo [1/4] Checkout %BRANCH%
git checkout %BRANCH%
if errorlevel 1 goto :failed

echo [2/4] Fetch
git fetch origin
if errorlevel 1 goto :failed

echo [3/4] Pull (rebase)
git pull --rebase origin %BRANCH%
if errorlevel 1 goto :failed

echo [4/4] Status
git status -sb

echo Done.
pause
exit /b 0

:failed
echo [ERROR] Pull failed.
git status -sb
pause
exit /b 1