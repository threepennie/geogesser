@echo off
setlocal

REM ===== 設定 =====
set BRANCH=main
set REMOTE=origin

REM ===== 作業ディレクトリ確認（このbatをrepo直下に置く想定）=====
cd /d %~dp0

echo.
echo [1/7] Git状態確認
git status
if errorlevel 1 goto :error

echo.
echo [2/7] 変更をステージング
git add .
if errorlevel 1 goto :error

echo.
echo [3/7] ステージ済み差分確認
git diff --cached --quiet
if not errorlevel 1 (
  echo コミット対象がありません。処理を終了します。
  goto :end
)

echo.
echo [4/7] コミットメッセージ入力
set /p MSG=commit message を入力してください: 
if "%MSG%"=="" set MSG=chore: update by codex

echo.
echo [5/7] コミット実行
git commit -m "%MSG%"
if errorlevel 1 goto :error

echo.
echo [6/7] リモート最新取り込み（rebase）
git pull --rebase %REMOTE% %BRANCH%
if errorlevel 1 goto :error

echo.
echo [7/7] Push
git push -u %REMOTE% %BRANCH%
if errorlevel 1 goto :error

echo.
echo ===== 完了: GitHubへのアップロード成功 =====
goto :end

:error
echo.
echo ===== エラーが発生しました。処理を中断します。=====
echo git status を確認して原因を特定してください。
exit /b 1

:end
endlocal