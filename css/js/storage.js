class TodoStorage {
    constructor(storageKey = 'todos') {
        this.storageKey = storageKey;
    }

    getTodos() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Erro ao obter tarefas:', error);
            return [];
        }
    }

    saveTodos(todos) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(todos));
            return true;
        } catch (error) {
            console.error('Erro ao salvar tarefas:', error);
            return false;
        }
    }

    addTodo(todo) {
        const todos = this.getTodos();
        const newTodo = {
            id: Date.now(),
            text: todo.text,
            completed: false,
            favorite: false,
            priority: todo.priority || 'medium',
            dueDate: todo.dueDate || null,
            category: todo.category || 'general',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        todos.push(newTodo);
        this.saveTodos(todos);
        return newTodo;
    }

    updateTodo(id, updates) {
        const todos = this.getTodos();
        const index = todos.findIndex(t => t.id === id);
        
        if (index !== -1) {
            todos[index] = {
                ...todos[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            this.saveTodos(todos);
            return todos[index];
        }
        return null;
    }

    deleteTodo(id) {
        const todos = this.getTodos();
        const filteredTodos = todos.filter(t => t.id !== id);
        this.saveTodos(filteredTodos);
        return filteredTodos;
    }

    toggleComplete(id) {
        const todos = this.getTodos();
        const todo = todos.find(t => t.id === id);
        
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos(todos);
            return todo;
        }
        return null;
    }

    toggleFavorite(id) {
        const todos = this.getTodos();
        const todo = todos.find(t => t.id === id);
        
        if (todo) {
            todo.favorite = !todo.favorite;
            this.saveTodos(todos);
            return todo;
        }
        return null;
    }

    getFilteredTodos(filter) {
        const todos = this.getTodos();
        
        switch(filter) {
            case 'active':
                return todos.filter(t => !t.completed);
            case 'completed':
                return todos.filter(t => t.completed);
            case 'favorite':
                return todos.filter(t => t.favorite);
            default:
                return todos;
        }
    }

    getStats() {
        const todos = this.getTodos();
        const completed = todos.filter(t => t.completed).length;
        
        return {
            total: todos.length,
            active: todos.length - completed,
            completed: completed,
            favorite: todos.filter(t => t.favorite).length,
            progress: todos.length ? Math.round((completed / todos.length) * 100) : 0
        };
    }

    clearAll() {
        localStorage.removeItem(this.storageKey);
        return [];
    }

    searchTodos(query) {
        const todos = this.getTodos();
        return todos.filter(t => 
            t.text.toLowerCase().includes(query.toLowerCase())
        );
    }
}

const storage = new TodoStorage();