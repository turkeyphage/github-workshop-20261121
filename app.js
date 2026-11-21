/*
  待辦事項清單 - 應用邏輯
  處理待辦事項的新增、刪除、完成狀態和本地存儲
*/

// 常數定義
const STORAGE_KEY = 'todo_list_data';

// 獲取 DOM 元素
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const emptyState = document.getElementById('emptyState');
const remainingCount = document.getElementById('remainingCount');

// 待辦事項數據陣列
let todos = [];

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
 * 計算未完成的待辦事項數量
 */
function getUncompletedCount() {
    return todos.filter(todo => !todo.completed).length;
}

/**
 * 渲染待辦事項清單
 */
function renderTodos() {
    // 清空現有的清單 HTML
    todoList.innerHTML = '';

    // 如果沒有待辦事項，顯示空狀態
    if (todos.length === 0) {
        emptyState.classList.add('show');
        remainingCount.textContent = '剩餘: 0';
        return;
    }

    // 隱藏空狀態
    emptyState.classList.remove('show');

    // 遍歷每個待辦事項並創建 DOM 元素
    todos.forEach(todo => {
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

    // 更新剩餘計數
    const uncompletedCount = getUncompletedCount();
    remainingCount.textContent = `剩餘: ${uncompletedCount}`;

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
 * 初始化應用
 */
function initializeApp() {
    // 從本地存儲載入數據
    loadTodosFromStorage();

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

    // 初始焦點設置
    todoInput.focus();
}

// 當 DOM 完全加載時初始化應用
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
