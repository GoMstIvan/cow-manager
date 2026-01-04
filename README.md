# 🐄 Cow Manager | 牧場乳牛管理系統

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![React](https://img.shields.io/badge/React-19-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-v0.100+-green.svg)
![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-38B2AC.svg)

[English](#english) | [中文](#chinese)

---

<a name="english"></a>
## 🌍 English

### 📝 Description
**Cow Manager** is a modern, full-stack management platform designed for cattle farmers and ranch managers. It streamlines the tracking of livestock data, health events, and breeding schedules, ensuring you never miss a beat in your herd's management.

### ✨ Key Features
- **🐄 Cow Profiles**: Maintain detailed digital records for every animal in your herd.
- **📅 Event Timeline**: A chronological view of health checks, vaccinations, and breeding events for each cow.
- **🗓️ Interactive Calendar**: Visualize the entire month's schedule and historical events at a glance.
- **🔔 Smart Reminders**: Automated alerts for upcoming tasks and critical management windows.
- **🌐 Multilingual Support**: Fully localized interface using i18next.

---

<a name="chinese"></a>
## 🌏 中文說明

### 📝 專案簡介
**Cow Manager (乳牛管理員)** 是一個為現代牧場管理者打造的全端管理平台。透過直覺的介面，您可以輕鬆記錄乳牛的成長狀況、健康事件與繁殖時程，確保每一頭牛都得到妥善的照顧與追蹤。

### ✨ 核心特色
- **🐄 乳牛檔案管理**: 為每頭乳牛建立完整的數位化檔案。
- **📅 事件時間軸**: 詳細紀錄每頭牛的健康檢查、疫苗接種與繁殖事件。
- **🗓️ 互動式行事曆**: 一目了然地查看全場當月預計行程與過往紀錄。
- **🔔 智慧提醒系統**: 針對即將到來的任務提供提醒。
- **🌐 多語系支援**: 使用 i18next 實現完整的中英文介面切換。

---

## 🚀 Getting Started | 開始使用

### 1. Prerequisites | 前置準備
- [Conda](https://docs.conda.io/en/latest/)
- [Node.js](https://nodejs.org/) (v18+) & [pnpm](https://pnpm.io/)

### 2. Backend Setup | 後端安裝
```bash
# Create and activate conda environment
conda create -n cow-manager python=3.10
conda activate cow-manager

# Install dependencies
pip install -r backend/requirements.txt

# Start the server (Run from project root)
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000
```
The API will be available at `http://localhost:8000`

### 3. Frontend Setup | 前端安裝
```bash
# Install dependencies
pnpm install

# Start the development server
pnpm run dev
```
The application will be available at `http://localhost:5173`

---

## 📄 License | 授權條款
This project is licensed under the MIT License.
