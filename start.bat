@echo off
REM ==================================================
REM Cow Manager - Public Startup Script (Fullscreen-aware)
REM ==================================================

REM --- 切換到專案目錄 ---
CD /D "%~dp0"

REM ==================================================
REM Conda 初始化
REM ==================================================
IF EXIST "%USERPROFILE%\anaconda3\Scripts\activate.bat" (
    CALL "%USERPROFILE%\anaconda3\Scripts\activate.bat"
) ELSE IF EXIST "%USERPROFILE%\miniconda3\Scripts\activate.bat" (
    CALL "%USERPROFILE%\miniconda3\Scripts\activate.bat"
) ELSE (
    ECHO [ERROR] Conda not found.
    PAUSE
    EXIT /B 1
)

CALL conda activate myenv

REM ==================================================
REM 檢查 pnpm
REM ==================================================
WHERE pnpm >nul 2>&1
IF ERRORLEVEL 1 (
    ECHO [ERROR] pnpm not found.
    PAUSE
    EXIT /B 1
)

REM ==================================================
REM 啟動後端
REM ==================================================
START "Cow Manager Backend" cmd /k ^
python -m backend.app.main

REM ==================================================
REM 啟動前端
REM ==================================================
START "Cow Manager Frontend" cmd /k ^
pnpm run dev

REM ==================================================
REM 等待前端啟動
REM ==================================================
timeout /t 5 /nobreak > nul

REM ==================================================
REM 嘗試用 Chrome 全螢幕，失敗則用預設瀏覽器
REM ==================================================
IF EXIST "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    START "" "C:\Program Files\Google\Chrome\Application\chrome.exe" ^
    --start-fullscreen ^
    http://localhost:5173
) ELSE (
    START http://localhost:5173
)
