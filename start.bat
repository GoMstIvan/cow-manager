@echo off
REM ===============================
REM Cow Manager Startup Script
REM ===============================

REM --- 初始化 Conda ---
CALL C:\Users\%USERNAME%\anaconda3\Scripts\activate.bat

REM --- 啟用 Conda 環境 ---
CALL conda activate myenv

REM --- 初始化 nvm（Windows）---
SET NVM_HOME=%APPDATA%\nvm
SET PATH=%NVM_HOME%;%NVM_HOME%\nodejs;%PATH%

REM --- 切換到專案目錄 ---
CD /D F:\Local_Home\cow-manager

REM ===============================
REM 啟動後端（新視窗）
REM ===============================
START "Backend" cmd /k ^
python -m backend.app.main

REM ===============================
REM 啟動前端（新視窗）
REM ===============================
START "Frontend" cmd /k ^
pnpm run dev
