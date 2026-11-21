# 待辦清單 Web App - 作品集

## 簡介

本專案是在 GitHub Copilot 實戰工作坊中完成的待辦清單 Web 應用程式。運用 Copilot Agent Mode 與 MCP（Model Context Protocol）整合工作流程，結合 `.github/prompts` 中定義的 agentic workflow，完整展示了如何透過 AI 助手高效推進 GitHub 協作開發。

---

## 線上展示

- **GitHub Pages**: https://turkeyphage.github.io/github-workshop-20261121/

---

## 功能

### 核心功能
- ✅ **新增待辦事項** - 文字輸入框加上「新增」按鈕，支援回車鍵提交
- ✅ **標記完成** - 勾選項目左側複選框，可切換完成狀態
- ✅ **刪除項目** - 每筆項目右側有刪除按鈕
- ✅ **批量清除** - 一鍵刪除所有已完成項目（含確認對話框防止誤刪）

### 篩選與分類
- ✅ **三層篩選** - 「全部」、「未完成」、「已完成」三個篩選按鈕
- ✅ **篩選狀態持久化** - 重新整理頁面後篩選條件被保留
- ✅ **智能空狀態訊息** - 根據篩選條件顯示不同的提示文字

### 深色模式
- ✅ **主題切換** - 在淺色與深色模式間切換
- ✅ **系統偏好檢測** - 自動跟隨作業系統深淺色設定（若使用者未手動切換）
- ✅ **偏好持久化** - 記住使用者的主題選擇

### 資料管理
- ✅ **本地存儲** - 使用 localStorage 實現資料永久保存
- ✅ **自動同步** - 新增、刪除、完成狀態變化會即時保存

### 使用者體驗
- ✅ **響應式設計** - 完全適配桌機、平板與手機螢幕
- ✅ **完成狀態視覺反饋** - 完成項目顯示刪除線並變淡
- ✅ **未完成計數** - 底部實時顯示未完成項目數量
- ✅ **無障礙支援** - 按鈕含 aria-label，適配螢幕閱讀器

---

## 技術

### 技術棧
- **前端框架**: 無（純原生實現）
- **語言**: HTML5、CSS3、原生 JavaScript（ES6+）
- **外部依賴**: 零（完全離線可用）
- **資料存儲**: localStorage API

### 架構特色
- **純函數式邏輯** - 無全局狀態汙染，易於測試與維護
- **響應式設計** - 使用 CSS 媒體查詢（@media）支援多裝置
- **CSS 變數系統** - 統一顏色、間距、陰影等設計令牌
- **主題切換機制** - 通過 `html[data-theme="dark"]` 實現雙主題支援
- **XSS 防護** - 使用 `textContent` 與 HTML 轉義防止注入攻擊

### 關鍵特性
- 安全的 localStorage 操作（含 try-catch 錯誤處理）
- 無效資料的防禦性回退（如無效篩選條件自動回到「全部」）
- 動態 DOM 操作（無 innerHTML 字串拼接）
- 事件委派與自動化事件繫結

---

## 開發方式

### Copilot Agent Mode 整合

本專案透過 GitHub Copilot 的 Agent Mode 完成，特別運用以下機制：

#### 1. 結構化 Prompt 工作流（`.github/prompts/fix-issue.prompt.md`）
建立了標準化的問題修復工作流程，涵蓋：
- **第一步** - 讀取 GitHub issue 並摘要
- **第二步** - 提出計畫並等待確認（在開始編碼前）
- **第三步** - 建立特性分支（`fix/issue-${NUMBER}`）
- **第四步** - 進行修改
- **第五步** - 說明驗證方式
- **第六步** - 提交並推送代碼
- **第七步** - 建立 Pull Request

#### 2. MCP（Model Context Protocol）應用
集成了 Microsoft Learn MCP 伺服器，用於：
- 查詢官方文件（CSS `prefers-color-scheme`、無障礙色彩對比）
- 驗證深色模式實作的 WCAG 合規性

#### 3. Copilot 開發指引（`.github/copilot-instructions.md`）
定義了專案級開發規範：
- **技術限制** - 禁止框架、套件、外部 CDN
- **程式風格** - 中文註解、camelCase 命名、CSS 變數強制使用
- **協作方式** - 改動前提計畫、一次一事、事後驗證

---

## 我學到什麼

### 1. **Agentic Workflow 的力量**
   透過結構化的 prompt 工作流，AI 助手能夠一致地遵循專案規範。每次修復 issue 時自動經過「計畫→確認→實施→驗證」四步驟，大幅降低人工審核成本。

### 2. **localStorage 與使用者體驗的關係**
   學習到資料持久化不只是功能需求，更是使用者期望的基本禮儀。篩選條件、主題偏好都應被記住，才能提供連貫的體驗。同時掌握了安全讀寫 localStorage 的最佳實踐。

### 3. **深色模式實作的細節**
   深色模式不只是改色；需要同時考慮系統偏好檢測、無障礙色彩對比（WCAG）、以及優雅的降級方案。CSS 變數系統提供了極大的靈活性。

### 4. **MCP 與 LLM 整合**
   MCP 允許 AI 在對話中查詢即時文件與最佳實踐。這使得 AI 生成的代碼更符合官方標準，而非依賴訓練資料中的過時知識。

### 5. **版本控制與文件驅動開發**
   CHANGELOG.md 和 PORTFOLIO.md 不只是交付物，也是開發歷程的記錄。清晰的版本履歷與功能清單使得維護者與使用者都能快速了解專案現狀。

---

## 相關連結

- **GitHub Repository**: https://github.com/turkeyphage/github-workshop-20261121
- **Issue Tracker**: https://github.com/turkeyphage/github-workshop-20261121/issues
- **版本履歷**: [CHANGELOG.md](./CHANGELOG.md)
- **開發指引**: [.github/copilot-instructions.md](./.github/copilot-instructions.md)

---

**Last Updated**: 2026-11-21
