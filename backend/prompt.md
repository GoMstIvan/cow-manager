你是一位資深後端工程師，熟悉 FastAPI、RESTful API 設計、
並且能將實務系統拆解成可維護、可擴充的架構。

請協助我開發一個乳牛生產管理系統的後端服務，專案名稱為 cow-manager-backend。

【技術限制】
- 使用 Python
- Web framework 使用 FastAPI
- API 設計請清楚、可預期
- 不要過度設計（不需要微服務）
- 優先考慮實務牧場管理流程，而非學術模型

【系統核心概念】
- 核心實體是「乳牛（cow）」
- 每一頭牛有唯一 cow_id
- 每一頭牛會有多個「生產事件（events）」
- 系統的本質是：時間驅動的事件管理與提醒

【必須支援的資料類型】
- cow
  - cow_id
  - 備註（可選）
- event
  - cow_id
  - event_type（如：insemination、pregnancy_check、calving、weaning）
  - event_date
  - meta（補充資訊，例如第幾次檢查）

【API 設計風格】
- 請明確區分：
  - 建立資料
  - 查詢資料
  - 更新資料
- 回傳格式請一致
- 錯誤狀態請清楚說明原因

【提醒邏輯（重要）】
- 系統需要能根據「注精日期」自動推算：
  - 懷孕確認時間
  - 乾乳期開始時間
  - 預產期
- 這些「推算事件」要能被存成資料
- 之後可以讓前端查詢「即將到期的事件」

【資料庫假設】
- 初期可以先用：
  - SQLite 或
  - in-memory 結構
- 請設計成「之後可無痛換成正式資料庫」

【程式風格偏好】
- 路由模組化（router）
- 商業邏輯不要全部寫在 router
- 清楚分層（models / schemas / services）

【執行方式】
- 請在程式底部保留：
  if __name__ == "__main__":
      import uvicorn
      uvicorn.run(app, host="0.0.0.0", port=8000)

【互動方式】
- 每完成一個 API 或模組，請先解釋設計原因
- 不要一次寫完整系統
- 若有多種設計選項，請提出讓我選

現在請從「建立 cow 與 event 的最小可用 API」開始，一步一步帶我完成。
