// ====================
// CONFIGURAZIONE
// ====================
const API_BASE_URL = 'https://my-first-api-vtlr.onrender.com';
const API_TODOS_URL = `${API_BASE_URL}/todos/`;
const API_REGISTER_URL = `${API_BASE_URL}/register`;
const API_LOGIN_URL = `${API_BASE_URL}/login`;

// ====================
// STATO DELL'APPLICAZIONE
// ====================
let currentUser = null;
let authToken = localStorage.getItem('authToken') || null;

// ====================
// ELEMENTI DOM
// ====================
// Autenticazione
const authSection = document.getElementById('auth-section');
const appSection = document.getElementById('app-section');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const authMessage = document.getElementById('auth-message');
const logoutBtn = document.getElementById('logout-btn');
const userEmailSpan = document.getElementById('user-email');

// Todo App (esistente)
const todoForm = document.getElementById('todo-form');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const refreshButton = document.getElementById('refresh-btn');
const todosContainer = document.getElementById('todos-container');
const loadingElement = document.getElementById('loading');

// Tabs
const tabButtons = document.querySelectorAll('.tab-btn');
const authForms = document.querySelectorAll('.auth-form');

// ====================
// UTILITY FUNCTIONS
// ====================
function showMessage(element, text, type = 'error') {
    element.textContent = text;
    element.className = `auth-message ${type}`;
    element.style.display = 'block';
    if (type === 'success') {
        setTimeout(() => element.style.display = 'none', 3000);
    }
}

function showLoading() {
    loadingElement.style.display = 'block';
    todosContainer.innerHTML = '';
}

function hideLoading() {
    loadingElement.style.display = 'none';
}

function setAuthToken(token) {
    authToken = token;
    if (token) {
        localStorage.setItem('authToken', token);
    } else {
        localStorage.removeItem('authToken');
    }
}

// ====================
// API FUNCTIONS (AGGIORNATE CON AUTH)
// ====================
async function apiRequest(url, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    // Aggiungi il token JWT se presente
    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(url, {
        ...options,
        headers
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Errore sconosciuto' }));
        throw new Error(error.detail || `HTTP error! Status: ${response.status}`);
    }

    return response.json();
}

async function fetchTodos() {
    showLoading();
    try {
        const todos = await apiRequest(API_TODOS_URL);
        displayTodos(todos);
    } catch (error) {
        console.error('Error fetching todos:', error);
        todosContainer.innerHTML = `
            <li class="todo-item" style="border-left-color: #ff4757;">
                <div class="todo-content">
                    <h3><i class="fas fa-exclamation-triangle"></i> Errore</h3>
                    <p>${error.message}</p>
                </div>
            </li>
        `;
    } finally {
        hideLoading();
    }
}

async function createTodo(title, description) {
    return apiRequest(API_TODOS_URL, {
        method: 'POST',
        body: JSON.stringify({ title, description })
    });
}

async function deleteTodo(id) {
    return apiRequest(`${API_TODOS_URL}${id}`, {
        method: 'DELETE'
    });
}

// ====================
// AUTHENTICATION FUNCTIONS
// ====================
async function loginUser(email, password) {
    // NOTA: FastAPI OAuth2 si aspetta 'username' e 'password' nel form data
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    const response = await fetch(API_LOGIN_URL, {
        method: 'POST',
        body: formData  // Nota: NON usiamo JSON qui, ma FormData
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Credenziali errate' }));
        throw new Error(error.detail || 'Login fallito');
    }

    return response.json();
}

async function registerUser(email, password) {
    return apiRequest(API_REGISTER_URL, {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });
}

// ====================
// UI FUNCTIONS
// ====================
function displayTodos(todos) {
    if (todos.length === 0) {
        todosContainer.innerHTML = `
            <li class="todo-item" style="border-left-color: #ffa502;">
                <div class="todo-content">
                    <h3><i class="fas fa-clipboard-list"></i> Nessun task</h3>
                    <p>Aggiungi il tuo primo task usando il form sopra!</p>
                </div>
            </li>
        `;
        return;
    }

    todosContainer.innerHTML = todos.map(todo => `
        <li class="todo-item" data-id="${todo.id}">
            <div class="todo-content">
                <h3>${todo.title}</h3>
                ${todo.description ? `<p>${todo.description}</p>` : '<p><em>Nessuna descrizione</em></p>'}
            </div>
            <div class="todo-actions">
                <button class="delete-btn" onclick="handleDelete(${todo.id})">
                    <i class="fas fa-trash"></i> Elimina
                </button>
            </div>
        </li>
    `).join('');
}

function showAppSection() {
    authSection.style.display = 'none';
    appSection.style.display = 'block';
    userEmailSpan.textContent = currentUser.email;
    fetchTodos();
}

function showAuthSection() {
    authSection.style.display = 'block';
    appSection.style.display = 'none';
    currentUser = null;
    setAuthToken(null);
}

// ====================
// EVENT HANDLERS
// ====================
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    
    const submitBtn = loginForm.querySelector('button');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Accesso...';
    submitBtn.disabled = true;

    try {
        const data = await loginUser(email, password);
        setAuthToken(data.access_token);
        currentUser = { email };
        showMessage(authMessage, 'Accesso effettuato!', 'success');
        setTimeout(showAppSection, 1500);
    } catch (error) {
        showMessage(authMessage, error.message, 'error');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

async function handleRegister(event) {
    event.preventDefault();
    
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    
    if (password.length < 8) {
        showMessage(authMessage, 'La password deve essere di almeno 8 caratteri', 'error');
        return;
    }

    const submitBtn = registerForm.querySelector('button');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creazione...';
    submitBtn.disabled = true;

    try {
        await registerUser(email, password);
        showMessage(authMessage, 'Account creato! Ora puoi accedere.', 'success');
        
        // Switch automatico al tab login
        document.querySelector('[data-tab="login"]').click();
        document.getElementById('login-email').value = email;
        document.getElementById('login-password').value = '';
        document.getElementById('login-password').focus();
    } catch (error) {
        showMessage(authMessage, error.message, 'error');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

async function handleTodoSubmit(event) {
    event.preventDefault();

    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();

    if (!title) {
        alert('Inserisci un titolo per il task.');
        return;
    }

    const submitButton = todoForm.querySelector('button');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Aggiungo...';
    submitButton.disabled = true;

    try {
        await createTodo(title, description);
        titleInput.value = '';
        descriptionInput.value = '';
        await fetchTodos();
    } catch (error) {
        alert(`Errore: ${error.message}`);
    } finally {
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
}

async function handleDelete(id) {
    if (!confirm('Sei sicuro di voler eliminare questo task?')) {
        return;
    }

    const todoItem = document.querySelector(`.todo-item[data-id="${id}"]`);
    if (todoItem) {
        todoItem.style.opacity = '0.5';
        todoItem.style.pointerEvents = 'none';
    }

    try {
        await deleteTodo(id);
        await fetchTodos();
    } catch (error) {
        alert(`Errore: ${error.message}`);
        if (todoItem) {
            todoItem.style.opacity = '1';
            todoItem.style.pointerEvents = 'auto';
        }
    }
}

function handleLogout() {
    if (confirm('Sei sicuro di voler uscire?')) {
        showAuthSection();
        // Pulisci i form
        document.getElementById('login-email').value = '';
        document.getElementById('login-password').value = '';
        authMessage.style.display = 'none';
    }
}

// ====================
// TAB SWITCHING
// ====================
function switchTab(tabName) {
    // Aggiorna bottoni
    tabButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    // Aggiorna form
    authForms.forEach(form => {
        form.classList.toggle('active', form.id === `${tabName}-form`);
    });

    // Pulisci messaggi
    authMessage.style.display = 'none';
}

// ====================
// INITIALIZATION
// ====================
function init() {
    // Setup tabs
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Setup event listeners
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    todoForm.addEventListener('submit', handleTodoSubmit);
    refreshButton.addEventListener('click', fetchTodos);
    logoutBtn.addEventListener('click', handleLogout);

    // Make handleDelete globally available
    window.handleDelete = handleDelete;

    // Check if user is already logged in
    if (authToken) {
        // Qui potresti fare una chiamata per validare il token
        // Per ora mostriamo direttamente l'app
        currentUser = { email: localStorage.getItem('userEmail') || 'Utente' };
        showAppSection();
    } else {
        showAuthSection();
    }

    console.log('Todo App with Auth initialized!');
    console.log('Backend URL:', API_BASE_URL);
}

// Start the app
document.addEventListener('DOMContentLoaded', init);