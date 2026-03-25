class TodoUI {
    constructor(storage) {
        this.storage = storage;
        this.currentFilter = 'all';
        
        this.todoInput = document.getElementById('todoInput');
        this.todoForm = document.getElementById('todoForm');
        this.todoList = document.getElementById('todoList');
        this.emptyState = document.getElementById('emptyState');
        this.themeToggle = document.getElementById('themeToggle');
        this.clearAllBtn = document.getElementById('clearAllBtn');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadTheme();
        this.render();
    }

    setupEventListeners() {
        this.todoForm.addEventListener('submit', (e) => this.handleAddTodo(e));
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        this.clearAllBtn.addEventListener('click', () => this.handleClearAll());
        
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilter(e));
        });

        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.todoForm.dispatchEvent(new Event('submit'));
            }
        });
    }

    handleAddTodo(e) {
        e.preventDefault();
        
        const text = this.todoInput.value.trim();
        
        if (!text) {
            alert('Por favor, adicione um texto para a tarefa');
            return;
        }
        
        if (text.length < 3) {
            alert('A tarefa deve ter no mínimo 3 caracteres');
            return;
        }
        
        this.storage.addTodo({ text });
        this.todoInput.value = '';
        this.todoInput.focus();
        this.render();
    }

    handleToggleComplete(id) {
        this.storage.toggleComplete(id);
        this.render();
    }

    handleToggleFavorite(id) {
        this.storage.toggleFavorite(id);
        this.render();
    }

    handleDeleteTodo(id) {
        if (confirm('Tem certeza que deseja deletar esta tarefa?')) {
            this.storage.deleteTodo(id);
            this.render();
        }
    }

    handleFilter(e) {
        const filter = e.target.closest('.filter-btn').dataset.filter;
        this.currentFilter = filter;
        
        this.filterBtns.forEach(btn => btn.classList.remove('active'));
        e.target.closest('.filter-btn').classList.add('active');
        
        this.render();
    }

    handleClearAll() {
        if (confirm('Tem certeza que deseja deletar TODAS as tarefas? Esta ação não pode ser desfeita!')) {
            this.storage.clearAll();
            this.render();
        }
    }

    render() {
        const todos = this.storage.getFilteredTodos(this.currentFilter);
        const stats = this.storage.getStats();
        
        this.todoList.innerHTML = '';
        
        if (todos.length === 0) {
            this.emptyState.style.display = 'block';
        } else {
            this.emptyState.style.display = 'none';
            todos.forEach(todo => {
                this.todoList.appendChild(this.createTodoElement(todo));
            });
        }
        
        this.updateStats(stats);
    }

    createTodoElement(todo) {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''} ${todo.favorite ? 'favorite' : ''}`;
        li.id = `todo-${todo.id}`;
        
        li.innerHTML = `
            <input 
                type="checkbox" 
                class="w-5 h-5 rounded"
                ${todo.completed ? 'checked' : ''}
                onchange="ui.handleToggleComplete(${todo.id})"
            />
            
            <div class="flex-1">
                <p class="todo-text text-gray-800 dark:text-gray-200">
                    ${this.escapeHtml(todo.text)}
                </p>
                <div class="flex gap-2 mt-2 flex-wrap items-center">
                    <span class="text-xs text-gray-400 dark:text-gray-500">
                        ${this.getTimeAgo(todo.createdAt)}
                    </span>
                </div>
            </div>
            
            <div class="flex gap-1">
                <button 
                    class="btn-icon"
                    onclick="ui.handleToggleFavorite(${todo.id})"
                    title="Favoritar"
                >
                    ${todo.favorite ? '⭐' : '☆'}
                </button>
                
                <button 
                    class="btn-icon btn-delete"
                    onclick="ui.handleDeleteTodo(${todo.id})"
                    title="Deletar"
                >
                    <i data-lucide="trash-2" class="w-5 h-5"></i>
                </button>
            </div>
        `;
        
        return li;
    }

    updateStats(stats) {
        document.getElementById('statTotal').textContent = stats.total;
        document.getElementById('statActive').textContent = stats.active;
        document.getElementById('statCompleted').textContent = stats.completed;
        document.getElementById('progressBar').style.width = stats.progress + '%';
        
        this.filterBtns.forEach(btn => {
            const filter = btn.dataset.filter;
            let count = 0;
            
            if (filter === 'all') count = stats.total;
            else if (filter === 'active') count = stats.active;
            else if (filter === 'completed') count = stats.completed;
            else if (filter === 'favorite') count = stats.favorite;
            
            btn.textContent = btn.textContent.split(' (')[0] + ` (${count})`;
        });
    }

    toggleTheme() {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        lucide.createIcons();
    }

    loadTheme() {
        const theme = localStorage.getItem('theme') || 'light';
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        }
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    getTimeAgo(date) {
        const now = new Date();
        const then = new Date(date);
        const seconds = Math.floor((now - then) / 1000);
        
        if (seconds < 60) return 'agora';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m atrás`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h atrás`;
        const days = Math.floor(hours / 24);
        return `${days}d atrás`;
    }
}

let ui;
document.addEventListener('DOMContentLoaded', () => {
    ui = new TodoUI(storage);
    lucide.createIcons();
});