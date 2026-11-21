/*
  待辦事項清單 - 應用邏輯
  處理待辦事項的新增、刪除、完成狀態、篩選、深色模式和本地存儲
*/

// 常數定義
const STORAGE_KEY = 'todo_list_data';
const THEME_STORAGE_KEY = 'todo_app_theme';
const FILTER_STORAGE_KEY = 'todo_app_filter';

// 獲取 DOM 元素
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const emptyState = document.getElementById('emptyState');
const remainingCount = document.getElementById('remainingCount');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');

// 待辦事項數據陣列
let todos = [];
let currentFilter = 'all'; // 'all', 'pending', 'completed'

/**
 * 從 localStorage 載入待辦事項數據
 */
function loadTodosFromStorage() {
    try {
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (storedData) {
            todos = JSON.parse(storedData);
        } else {
            todos = [];
        }
    } catch (error) {
        console.error('讀取本地存儲失敗:', error);
        todos = [];
    }
}

/**
 * 將待辦事項數據保存到 localStorage
 */
function saveTodosToStorage() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
        console.error('保存本地存儲失敗:', error);
    }
}

/**
 * 生成唯一的 ID
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * 驗證輸入是否有效（非空且不是只有空白）
 */
function isValidInput(text) {
    return text && text.trim().length > 0;
}

/**
 * 新增待辦事項
 */
function addTodo() {
    const inputValue = todoInput.value;

    // 驗證輸入
    if (!isValidInput(inputValue)) {
        return;
    }

    // 創建新待辦事項物件
    const newTodo = {
        id: generateId(),
        text: inputValue.trim(),
        completed: false,
        createdAt: new Date().toISOString()
    };

    // 添加到數據陣列
    todos.push(newTodo);

    // 保存到本地存儲
    saveTodosToStorage();

    // 清空輸入框
    todoInput.value = '';
    todoInput.focus();

    // 重新渲染清單
    renderTodos();
}

/**
 * 刪除待辦事項
 */
function deleteTodo(id) {
    // 通過 id 過濾出要保留的待辦事項
    todos = todos.filter(todo => todo.id !== id);

    // 保存到本地存儲
    saveTodosToStorage();

    // 重新渲染清單
    renderTodos();
}

/**
 * 切換待辦事項的完成狀態
 */
function toggleTodo(id) {
    // 找到對應的待辦事項並切換其完成狀態
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodosToStorage();
        renderTodos();
    }
}

/**
 * 刪除所有已完成的待辦事項
 */
function clearCompletedTodos() {
    // 檢查是否有已完成的項目
    const hasCompleted = todos.some(todo => todo.completed);
    if (!hasCompleted) {
        return; // 沒有已完成項目，直接返回
    }

    // 顯示確認對話框
    if (confirm('確定要刪除所有已完成的待辦事項嗎？此操作無法撤銷。')) {
        // 保留所有未完成的項目，刪除已完成的
        todos = todos.filter(todo => !todo.completed);

        // 保存到本地存儲
        saveTodosToStorage();

        // 重新渲染清單
        renderTodos();
    }
}

/**
 * 更新「清除已完成」按鈕的顯示狀態
 */
function updateClearButtonState() {
    // 檢查是否有已完成的項目
    const hasCompleted = todos.some(todo => todo.completed);
    
    // 根據是否有已完成項目來顯示或隱藏按鈕
    if (hasCompleted) {
        clearCompletedBtn.hidden = false;
        clearCompletedBtn.disabled = false;
    } else {
        clearCompletedBtn.hidden = true;
        clearCompletedBtn.disabled = true;
    }
}

/**
 * 計算未完成的待辦事項數量
 */
function getUncompletedCount() {
    return todos.filter(todo => !todo.completed).length;
}

/**
 * 根據篩選條件取得需要顯示的待辦事項
 */
function getFilteredTodos() {
    if (currentFilter === 'completed') {
        return todos.filter(todo => todo.completed);
    } else if (currentFilter === 'pending') {
        return todos.filter(todo => !todo.completed);
    }
    // 'all' 或其他情況
    return todos;
}

/**
 * 取得篩選後為空時的提示文字
 */
function getEmptyStateMessage() {
    // 如果根本沒有任何待辦事項
    if (todos.length === 0) {
        return '沒有待辦事項，享受閒暇時光吧！';
    }
    
    // 根據不同的篩選條件顯示不同的提示文字
    switch (currentFilter) {
        case 'completed':
            // 在已完成篩選下為空，代表沒有已完成的項目
            return '📭 目前沒有已完成的事項';
        case 'pending':
            // 在未完成篩選下為空，代表全部完成了
            return '🎉 所有事項都完成了！';
        default:
            // 全部篩選下為空，代表清單空的
            return '😴 什麼都沒有';
    }
}

/**
 * 渲染待辦事項清單
 */
function renderTodos() {
    // 清空現有的清單 HTML
    todoList.innerHTML = '';

    // 根據篩選條件取得待辦事項
    const filteredTodos = getFilteredTodos();

    // 如果篩選後沒有待辦事項，顯示空狀態
    if (filteredTodos.length === 0) {
        emptyState.classList.add('show');
        const emptyText = emptyState.querySelector('.empty-text');
        emptyText.textContent = getEmptyStateMessage();
    } else {
        emptyState.classList.remove('show');

        // 遍歷每個篩選後的待辦事項並創建 DOM 元素
        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <input 
                    type="checkbox" 
                    class="todo-checkbox" 
                    ${todo.completed ? 'checked' : ''}
                    data-id="${todo.id}"
                >
                <span class="todo-text">${escapeHtml(todo.text)}</span>
                <button class="delete-btn" data-id="${todo.id}">刪除</button>
            `;

            todoList.appendChild(li);
        });
    }

    // 更新剩餘計數（不受篩選影響，永遠顯示所有未完成的數量）
    const uncompletedCount = getUncompletedCount();
    remainingCount.textContent = `剩餘: ${uncompletedCount}`;

    // 更新「清除已完成」按鈕的顯示狀態
    updateClearButtonState();

    // 為新創建的複選框和刪除按鈕綁定事件監聽器
    attachEventListeners();
}

/**
 * 為清單項目綁定事件監聽器
 */
function attachEventListeners() {
    // 為所有複選框綁定變化事件
    document.querySelectorAll('.todo-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            toggleTodo(e.target.dataset.id);
        });
    });

    // 為所有刪除按鈕綁定點擊事件
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            deleteTodo(e.target.dataset.id);
        });
    });
}

/**
 * 轉義 HTML 特殊字符以防止 XSS 攻擊
 */
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

/**
 * 初始化深色模式
 * 優先級：用戶偏好設定 > 系統設定 > 淺色（預設）
 */
function initializeTheme() {
    // 檢查用戶是否有保存的主題偏好
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    
    if (savedTheme) {
        // 使用用戶的保存偏好
        setTheme(savedTheme);
    } else {
        // 檢查系統是否偏好深色模式
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    }
}

/**
 * 設置主題
 */
function setTheme(theme) {
    const html = document.documentElement;
    
    if (theme === 'dark') {
        html.setAttribute('data-theme', 'dark');
        updateThemeButton('dark');
    } else {
        html.removeAttribute('data-theme');
        updateThemeButton('light');
    }
    
    // 保存用戶的選擇到 localStorage
    localStorage.setItem(THEME_STORAGE_KEY, theme);
}

/**
 * 更新深色模式按鈕的顯示
 */
function updateThemeButton(currentTheme) {
    const icon = themeToggleBtn.querySelector('.theme-icon');
    const text = themeToggleBtn.querySelector('.theme-text');
    
    if (currentTheme === 'dark') {
        // 當前是深色，按鈕顯示淺色選項
        icon.textContent = '☀️';
        text.textContent = '淺色模式';
    } else {
        // 當前是淺色，按鈕顯示深色選項
        icon.textContent = '🌙';
        text.textContent = '深色模式';
    }
}

/**
 * 切換主題
 */
function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    
    if (isDark) {
        setTheme('light');
    } else {
        setTheme('dark');
    }
}

/**
 * 從 localStorage 載入篩選條件
 */
function loadFilterFromStorage() {
    try {
        const savedFilter = localStorage.getItem(FILTER_STORAGE_KEY);
        
        // 驗證儲存的篩選條件是否有效
        if (savedFilter && ['all', 'pending', 'completed'].includes(savedFilter)) {
            currentFilter = savedFilter;
        } else {
            // 如果無效，回退到「全部」
            currentFilter = 'all';
        }
    } catch (error) {
        console.error('讀取篩選條件失敗:', error);
        currentFilter = 'all';
    }
}

/**
 * 將篩選條件保存到 localStorage
 */
function saveFilterToStorage() {
    try {
        localStorage.setItem(FILTER_STORAGE_KEY, currentFilter);
    } catch (error) {
        console.error('保存篩選條件失敗:', error);
    }
}

/**
 * 設置篩選器
 */
function setFilter(filter) {
    currentFilter = filter;
    
    // 保存篩選條件到 localStorage
    saveFilterToStorage();
    
    // 更新篩選按鈕的樣式
    filterBtns.forEach(btn => {
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // 重新渲染清單
    renderTodos();
}

/**
 * 初始化應用
 */
function initializeApp() {
    // 初始化深色模式
    initializeTheme();

    // 從本地存儲載入數據
    loadTodosFromStorage();

    // 從本地存儲載入篩選條件
    loadFilterFromStorage();

    // 更新篩選按鈕的樣式
    filterBtns.forEach(btn => {
        if (btn.dataset.filter === currentFilter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // 初始渲染
    renderTodos();

    // 為「新增」按鈕綁定點擊事件
    addBtn.addEventListener('click', addTodo);

    // 為輸入框綁定回車鍵事件
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });

    // 為深色模式按鈕綁定點擊事件
    themeToggleBtn.addEventListener('click', toggleTheme);

    // 為篩選按鈕綁定點擊事件
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            setFilter(e.target.dataset.filter);
        });
    });

    // 為「清除已完成」按鈕綁定點擊事件
    clearCompletedBtn.addEventListener('click', clearCompletedTodos);

    // 初始焦點設置
    todoInput.focus();
}

// 當 DOM 完全加載時初始化應用
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
