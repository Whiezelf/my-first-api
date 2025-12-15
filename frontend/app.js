// ====================
// CONFIGURATION
// ====================
const API_BASE_URL = 'https://my-first-api-vtlr.onrender.com';
const API_TODOS_URL = `${API_BASE_URL}/todos/`;

// ====================
// DOM ELEMENTS
// ====================
const apiUrlElement = document.getElementById('api-url');
const todoForm = document.getElementById('todo-form');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const refreshButton = document.getElementById('refresh-btn');
const todosContainer = document.getElementById('todos-container');
const loadingElement = document.getElementById('loading');

// ====================
// UTILITY FUNCTIONS
// ====================
function showLoading() {
    loadingElement.style.display = 'block';
    todosContainer.innerHTML = '';
}

function hideLoading() {
    loadingElement.style.display = 'none';
}

function showError(message) {
    todosContainer.innerHTML = `
        <li class="todo-item" style="border-left-color: #ff4757;">
            <div class="todo-content">
                <h3><i class="fas fa-exclamation-triangle"></i> Error</h3>
                <p>${message}</p>
                <p><small>Check if your backend is running at: ${API_BASE_URL}</small></p>
            </div>
        </li>
    `;
}

// ====================
// API FUNCTIONS
// ====================
async function fetchTodos() {
    showLoading();
    try {
        const response = await fetch(API_TODOS_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const todos = await response.json();
        displayTodos(todos);
    } catch (error) {
        console.error('Error fetching todos:', error);
        showError(`Failed to load tasks: ${error.message}. Make sure your backend is deployed and running.`);
    } finally {
        hideLoading();
    }
}

async function createTodo(title, description) {
    try {
        const response = await fetch(API_TODOS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
                description: description
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const newTodo = await response.json();
        return newTodo;
    } catch (error) {
        console.error('Error creating todo:', error);
        alert(`Failed to create task: ${error.message}`);
        throw error;
    }
}

async function deleteTodo(id) {
    try {
        const response = await fetch(`${API_TODOS_URL}${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return true;
    } catch (error) {
        console.error('Error deleting todo:', error);
        alert(`Failed to delete task: ${error.message}`);
        return false;
    }
}

// ====================
// UI FUNCTIONS
// ====================
function displayTodos(todos) {
    if (todos.length === 0) {
        todosContainer.innerHTML = `
            <li class="todo-item" style="border-left-color: #ffa502;">
                <div class="todo-content">
                    <h3><i class="fas fa-clipboard-list"></i> No tasks yet</h3>
                    <p>Add your first task using the form above!</p>
                </div>
            </li>
        `;
        return;
    }

    todosContainer.innerHTML = todos.map(todo => `
        <li class="todo-item" data-id="${todo.id}">
            <div class="todo-content">
                <h3>${todo.title}</h3>
                ${todo.description ? `<p>${todo.description}</p>` : '<p><em>No description</em></p>'}
                <p><small>ID: ${todo.id}</small></p>
            </div>
            <div class="todo-actions">
                <button class="delete-btn" onclick="handleDelete(${todo.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </li>
    `).join('');
}

// ====================
// EVENT HANDLERS
// ====================
async function handleFormSubmit(event) {
    event.preventDefault();

    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();

    if (!title) {
        alert('Please enter a title for your task.');
        return;
    }

    const submitButton = todoForm.querySelector('button');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
    submitButton.disabled = true;

    try {
        await createTodo(title, description);
        // Clear the form
        titleInput.value = '';
        descriptionInput.value = '';
        // Refresh the list
        await fetchTodos();
    } finally {
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
}

async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }

    const todoItem = document.querySelector(`.todo-item[data-id="${id}"]`);
    if (todoItem) {
        todoItem.style.opacity = '0.5';
        todoItem.style.pointerEvents = 'none';
    }

    const success = await deleteTodo(id);
    if (success) {
        await fetchTodos();
    } else if (todoItem) {
        todoItem.style.opacity = '1';
        todoItem.style.pointerEvents = 'auto';
    }
}

// ====================
// INITIALIZATION
// ====================
function init() {
    // Display the API URL in the header
    apiUrlElement.textContent = API_BASE_URL;

    // Fetch and display todos on page load
    fetchTodos();

    // Set up event listeners
    todoForm.addEventListener('submit', handleFormSubmit);
    refreshButton.addEventListener('click', fetchTodos);

    // Make handleDelete available globally for onclick attributes
    window.handleDelete = handleDelete;

    console.log('Todo App Frontend initialized!');
    console.log('Backend URL:', API_BASE_URL);
}

// Start the app when the page loads
document.addEventListener('DOMContentLoaded', init);