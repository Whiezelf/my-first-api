# Todo App Full-Stack con Autenticazione JWT

![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

Una moderna applicazione full-stack per la gestione di liste di cose da fare (Todo), completa di **autenticazione utente**, frontend interattivo e deployment cloud. Questo progetto dimostra competenze complete in backend Python, API REST, sicurezza JWT e sviluppo frontend.

## **Funzionalità Principali**

### **Backend (FastAPI)**
- **Autenticazione JWT** completa con registrazione e login
- **Endpoint RESTful** protetti (CRUD completo per i Todo)
- **Validazione dati** con Pydantic
- **Database relazionale** con SQLAlchemy ORM
- **CORS configurato** per sicurezza cross-origin
- **Deploy automatico** su Render

### **Frontend (HTML/CSS/JavaScript Vanilla)**
- **Interfaccia responsive** e moderna
- **Gestione stati** (login/logout) con localStorage
- **Form di login/registrazione** con validazione
- **Operazioni CRUD in tempo reale** sui Todo
- **Design system** con CSS custom e Font Awesome

## **Architettura del Progetto**
my-first-api/
├── app/ # Backend FastAPI
│ ├── main.py # Entrypoint principale e routing
│ ├── models/ # Modelli SQLAlchemy (User, Todo)
│ ├── schemas/ # Schemi Pydantic per validazione
│ ├── crud/ # Operazioni database (CRUD)
│ └── security.py # Autenticazione JWT e hash password
├── frontend/ # Frontend statico
│ ├── index.html # Interfaccia utente principale
│ ├── style.css # Stili CSS
│ └── app.js # Logica JavaScript
├── requirements.txt # Dipendenze Python
├── render.yaml # Configurazione deploy Render
└── README.md # Questa documentazione

## **Deployment Live**

L'applicazione è completamente deployata e accessibile pubblicamente:

- **Frontend (Interfaccia Utente):** [https://my-first-api-frontend.onrender.com](https://my-first-api-frontend.onrender.com)
- **Backend (API REST):** [https://my-first-api-vtlr.onrender.com](https://my-first-api-vtlr.onrender.com)
- **Documentazione API (Swagger UI):** [https://my-first-api-vtlr.onrender.com/docs](https://my-first-api-vtlr.onrender.com/docs)

## **Stack Tecnologico**

| Componente       | Tecnologia                           | Scopo                                  |
|------------------|--------------------------------------|----------------------------------------|
| **Backend**      | FastAPI + Python 3.10+               | Framework API moderno e veloce         |
| **Database**     | SQLite + SQLAlchemy ORM              | Persistenza dati e modelli             |
| **Autenticazione**| JWT (python-jose) + bcrypt           | Sicurezza e gestione utenti            |
| **Frontend**     | HTML5 + CSS3 + JavaScript ES6        | Interfaccia utente interattiva         |
| **Hosting**      | Render (Web Service + Static Site)   | Deployment gratuito e scalabile        |
| **Versioning**   | Git + GitHub                         | Controllo versione e CI/CD             |

# **Installazione e Esecuzione Locale**

### Prerequisiti
- Python 3.10 o superiore
- Git
- Browser moderno


## 1. **Clona il repository**
`git clone https://github.com/Whiezelf/my-first-api.git`
`cd my-first-api`

## 2. **Crea e attiva un ambiente virtuale**
`python -m venv venv`
### Su Windows:
`venv\Scripts\activate`
### Su Mac/Linux:
`source venv/bin/activate`
### Installa le dipendenze
`pip install -r requirements.txt`

## 3. **Avvia il server backend**
`python run.py`

## 4. **Avvia il Frontend**
Apri semplicemente il file frontend/index.html nel tuo browser, oppure usa un server locale:
### Con Python
`python -m http.server 3000 --directory frontend`

### Con Node.js (se installato)
`npx serve frontend`

## Deployment su Render
**Backend (Web Service)**
1. Crea un account su render.com
2. Clicca "New +" → "Web Service"
3. Connetti il tuo repository GitHub
4. Configura:
    * Runtime: Python 3
    * Build Command: pip install -r requirements.txt
    * Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
5. Aggiungi variabili d'ambiente:
    - KEY (genera una chiave casuale sicura)
## Frontend (Static Site)
1. Clicca "New +" → "Static Site"
2. Connetti lo stesso repository
3. Configura:
    * Build Command: (lascia vuoto)
    * Publish Directory: frontend

# Prossimi Sviluppi (Roadmap)
+ **Test automatici con pytest per backend**
+ **Dark mode toggle nel frontend**
+ **Ricerca e filtri per i todo**
+ **Drag & drop per riordinare i task**
+ **Notifiche push per scadenze**
+ **Containerizzazione con Docker**
+ **CI/CD pipeline con GitHub Actions**

## Autore
Vincenzo Esposito/Whiezelf - Sviluppatore Full-Stack in formazione - GitHub [https://github.com/Whiezelf]

Progetto parte di un percorso di apprendimento intensivo in sviluppo web
