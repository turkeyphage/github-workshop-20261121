# Copilot 指引 — 待辦清單 App 開發規則

> 這份文件定義了與 GitHub Copilot 合作開發本專案的技術限制、程式風格和協作方式。

---

## 🔧 【技術限制】

### 技術棧固定
- ✅ **只使用純前端技術**: HTML5 + CSS3 + 原生 JavaScript
- ❌ **禁止引入任何框架或套件**: 不要用 React、Vue、jQuery、Bootstrap、Tailwind 等
- ❌ **不要建立 `package.json`**: 避免 npm 依賴管理
- ❌ **不要執行 `npm install`**: 專案應獨立自成

### 離線運作要求
- ❌ **禁止引用外部 CDN**: 不要連到 cdnjs.com、unpkg.com、jsDelivr 等
- ✅ **所有資源必須本地化**: 圖片、字型、圖示都應該內嵌或本地存儲
- ✅ **完整離線可用性**: 關閉網路也能正常運作

### 檔案結構固定
```
專案根目錄/
├── index.html      (唯一的 HTML 文件)
├── styles.css      (唯一的 CSS 文件)
├── app.js          (唯一的 JavaScript 文件)
├── CHANGELOG.md
├── .vscode/mcp.json
└── .github/copilot-instructions.md (本檔案)
```

**重要**: 不要創建新的 HTML、CSS 或 JS 文件，所有代碼必須在上述三個檔案中

---

## 🎨 【程式風格】

### 註解和命名規範

#### 註解語言
- ✅ **所有註解一律用繁體中文**
- ✅ 在複雜邏輯前加上說明性註解
- ✅ 在函式上方用 JSDoc 風格註解

```javascript
/*
  待辦事項清單 - 應用邏輯
  處理待辦事項的新增、刪除、完成狀態、篩選和深色模式
*/

/**
 * 生成唯一的 ID
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
```

#### 變數與函式命名
- ✅ **一律使用 camelCase (駝峰式)**
- ✅ 常數用 UPPER_SNAKE_CASE

```javascript
// ✅ 正確
const todoInput = document.getElementById('todoInput');
const STORAGE_KEY = 'todo_list_data';
let currentFilter = 'all';
function addTodo() { ... }
function getUncompletedCount() { ... }

// ❌ 錯誤
const todo_input = document.getElementById('todoInput');  // snake_case
let CurrentFilter = 'all';  // PascalCase
function ADD_TODO() { ... }  // UPPER_SNAKE_CASE
```

### CSS 顏色變數規範

#### 定義顏色
- ✅ **所有顏色必須在 `:root` 中定義為 CSS 變數**
- ✅ 在深色模式下用 `html[data-theme="dark"]` 覆蓋顏色值
- ❌ **不要在各處寫死 hex 色碼** (#4f46e5、#ffffff 等)

```css
/* ✅ 正確 */
:root {
    --primary-color: #4f46e5;
    --bg-primary: #ffffff;
    --text-primary: #111827;
}

html[data-theme="dark"] {
    --primary-color: #818cf8;
    --bg-primary: #1f2937;
    --text-primary: #f3f4f6;
}

.button {
    background-color: var(--primary-color);
    color: white;
}

/* ❌ 錯誤 */
.button {
    background-color: #4f46e5;  /* 硬編碼色碼 */
    color: white;
}
```

### JavaScript 變數宣告

#### 使用 const 和 let
- ✅ **優先使用 `const`**: 大多數情況下用 const（無法重新賦值的常數）
- ✅ **需要重新賦值時用 `let`**: 迴圈計數器、狀態變數等
- ❌ **禁止使用 `var`**: 避免提升和作用域混亂

```javascript
// ✅ 正確
const todoInput = document.getElementById('todoInput');  // const（不會重新賦值）
let todos = [];  // let（需要重新賦值）
let currentFilter = 'all';  // let（狀態變數）

// ❌ 錯誤
var todoInput = document.getElementById('todoInput');
var todos = [];
var currentFilter = 'all';
```

### DOM 操作規範

#### 建立和修改 DOM 元素
- ✅ **用 `createElement()` 創建新元素**
- ✅ **用 `textContent` 設置純文字內容**
- ✅ **用 `appendChild()` 或 `insertBefore()` 添加元素**
- ❌ **禁止用 `innerHTML` 組字串**: 容易造成 XSS 攻擊

```javascript
// ✅ 正確
const li = document.createElement('li');
li.className = `todo-item ${completed ? 'completed' : ''}`;
li.textContent = todoText;
todoList.appendChild(li);

// ❌ 錯誤
const html = `<li class="todo-item">${todoText}</li>`;
todoList.innerHTML += html;  // XSS 風險 + 效能差

// ✅ 也可以用這種方式（但要小心轉義）
li.innerHTML = `
    <input type="checkbox" class="todo-checkbox">
    <span class="todo-text">${escapeHtml(todoText)}</span>
`;
```

#### 文字轉義保護
- ✅ **所有用戶輸入都要用 `escapeHtml()` 轉義**

```javascript
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// 使用
const userText = document.getElementById('input').value;
li.innerHTML = `<span>${escapeHtml(userText)}</span>`;
```

---

## 🤝 【協作方式】

### 開始改動之前

#### 1️⃣ 先提交計畫 (不要直接開始編碼)
- 👤 **收到改動要求後**，先用繁體中文條列說明：
  - 要修改哪些檔案（`index.html`、`styles.css`、`app.js`）
  - 每個檔案具體要做什麼變動
  - 涉及的函式或 CSS 規則名稱

```
我打算做以下改動:

📄 styles.css:
- 在 :root 中新增 --accent-color: #10b981
- 修改 .button 的背景色從硬編碼改為 var(--accent-color)

📄 app.js:
- 新增 validateEmail() 函式用於檢查郵件格式
- 修改 addTodo() 函式以支援郵件驗證

📄 index.html:
- 新增一個 <input type="email"> 欄位
```

#### 2️⃣ 等待確認
- ⏳ 提交計畫後**等待用戶確認**再動手
- ✅ 用戶說「可以」或「👍」才開始

### 編碼中的規則

#### 一次只處理一件事
- ✅ **專注於當前要求**: 只做被要求的變動
- ❌ **不要順手做其他重構**: 看到代碼不夠優雅、想優化變數名、想調整結構 → **都不要自己動**
- ⚠️ **若發現 bug 或安全問題**: 立即停止當前工作，回報給用戶決定

```
❌ 不要這樣做:
「用戶要求新增篩選功能，我順手把整個 renderTodos() 函式重寫了」

✅ 要這樣做:
「用戶要求新增篩選功能，我只新增了篩選邏輯和相應的 CSS」
```

#### 保持代碼一致性
- ✅ 遵循既有的程式風格（見上面「程式風格」章節）
- ✅ 新增的函式和變數用相同的命名方式
- ✅ 保持縮排和間距一致

### 改動完成後

#### 1️⃣ 說明改了什麼
- 用繁體中文清楚地列出所有變動
- 標記每個檔案的變動內容

```
✅ 完成! 以下是變動摘要:

📄 styles.css:
- 在 :root 新增 --accent-color: #10b981
- 修改 .button { background-color: var(--accent-color) }

📄 app.js:
- 新增 validateEmail(email) 函式
- 修改 addTodo() 以呼叫 validateEmail()

📄 index.html:
- 新增 <input type="email" id="userEmail"> 欄位
```

#### 2️⃣ 提供驗證方法
- 告訴用戶**如何在瀏覽器中驗證**新功能是否正常
- 給具體的操作步驟

```
🌐 驗證方式:

1. 在瀏覽器開啟 index.html
2. 在郵件欄位輸入「test@example.com」
3. 按下「新增」按鈕
4. 檢查待辦事項是否出現
5. 試試輸入無效郵件「notanemail」，應該會被拒絕
```

#### 3️⃣ 標記為完成
- 用 ✅ 或 🎉  表示這項工作完成
- 等待用戶的回應或新的要求

---

## ✨ 合作範例

### 範例 1: 新增功能

**用戶要求:**
> 請在深色模式按鈕旁邊新增一個字體大小切換按鈕

**我的回應（計畫階段）:**
```
我打算做以下改動:

📄 index.html:
- 在 #themeToggleBtn 下方新增 <button id="fontSizeToggleBtn">
  顯示「🔤 字體大小」

📄 styles.css:
- 新增 .font-size-toggle-btn 樣式
- 新增 html[data-font-size="large"] 規則集，提高所有字體 20%

📄 app.js:
- 新增 initializeFontSize() 函式讀取用戶偏好
- 新增 toggleFontSize() 函式切換大小
- 新增 setFontSize(size) 函式應用 CSS
- 新增 FONT_SIZE_STORAGE_KEY = 'todo_app_font_size'
- 在 initializeApp() 中呼叫 initializeFontSize()

請確認這個方案是否可行？
```

**用戶確認:**
> 👍 可以，但字體只在 large 時放大，normal 時保持原樣即可

**我開始編碼...**

**改動完成後:**
```
✅ 完成! 變動摘要:

📄 index.html:
- 在 #themeToggleBtn 下方新增 <button id="fontSizeToggleBtn">

📄 styles.css:
- 新增 .font-size-toggle-btn 樣式（與 theme-toggle-btn 類似）
- 新增 html[data-font-size="large"] 規則，html, body 的 font-size 設為 110%

📄 app.js:
- 新增常數 FONT_SIZE_STORAGE_KEY
- 新增 initializeFontSize(), toggleFontSize(), setFontSize() 函式
- 在 initializeApp() 中呼叫初始化

🌐 驗證方式:
1. 開啟 index.html
2. 點擊「🔤 字體大小」按鈕
3. 所有文字應該變大約 10%
4. 重新整理頁面，字體大小應該維持
5. 再點一下按鈕回到正常大小
```

---

## 📌 快速參考

| 項目 | ✅ 做 | ❌ 不做 |
|------|------|--------|
| **註解** | 繁體中文 | 英文或混雜 |
| **變數名** | camelCase | snake_case、PascalCase |
| **顏色** | var(--primary-color) | #4f46e5 |
| **變數宣告** | const / let | var |
| **DOM 修改** | createElement、textContent | innerHTML 拼字串 |
| **外部資源** | 本地檔案 | CDN、外部 URL |
| **框架** | 無（原生 JS） | React、Vue、jQuery |
| **改動計畫** | 先回報、等確認、才開始 | 直接修改 |
| **改動範圍** | 只做要求的事 | 順手重構、優化 |

---

## 📞 問題或例外

如果遇到以下情況，**停止並回報用戶**:

- ⚠️ 要求違反上述技術限制（例如「幫我加 React」）
- ⚠️ 發現程式邏輯矛盾或 bug
- ⚠️ localStorage 相關代碼被意外刪除或修改
- ⚠️ 色彩對比度無障礙問題被忽視

**絕不妥協的三條底線:**
1. 只用純 HTML/CSS/JS，離線完整運作
2. 遵守程式風格和無障礙標準
3. 改動前先計畫、等確認

---

<sub>最後更新: 2026-11-21 | 版本: 1.0</sub>
