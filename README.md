Prossimi Passi (Roadmap)# My First API - Todo List

Una semplice ma completa API REST per gestire una lista di cose da fare (Todo), costruita con Python, FastAPI e SQLite. Questo progetto è il risultato di un percorso di apprendimento pratico del backend development.

## Funzionalità (CRUD Completo)

- **CREATE** `POST /todos/` - Crea un nuovo todo
- **READ** `GET /todos/` - Lista tutti i todo
- **READ** `GET /todos/{id}` - Ottieni un todo specifico
- **UPDATE** `PUT /todos/{id}` - Aggiorna un todo esistente
- **DELETE** `DELETE /todos/{id}` - Elimina un todo

## Stack Tecnologico

- **Framework:** [FastAPI](https://fastapi.tiangolo.com/)
- **Linguaggio:** Python 3.10+
- **Database:** SQLite (con SQLAlchemy ORM)
- **Validazione dati:** Pydantic
- **Server:** Uvicorn

## Installazione e Avvio Locale

1. **Clona il repository**
   `git clone https://github.com/Whiezelf/my-first-api.git`
   `cd my-first-api`

2. **Crea e attiva un ambiente virtuale**
    `python -m venv venv`
    # Su Windows:
    `venv\Scripts\activate`
    # Su Mac/Linux:
    `source venv/bin/activate`

3. **Installa le dipendenze**
    `pip install fastapi uvicorn sqlalchemy pydantic`

4. **Avvia il server di sviluppo**
    `uvicorn main:app --reload`

5. **Apri il browser all'indirizzo: `http://localhost:8000/docs` per utilizzare l'interfaccia Swagger UI interattiva.**

## Prossimi Passi (Roadmap)

- **Aggiungere autenticazione utente**
- **Implementare test automatici**
- **Containerizzare con Docker**
- **Deploy su servizio cloud (es. Railway, Render)**

## Autore
**Vincenzo Esposito/Whiezelf - https://github.com/Whiezelf**

## **Struttura del Progetto (Aggiornata)**

## Deploy

Questa API è deployata su Render ed è accessibile pubblicamente:
- **URL API:** `https://my-first-api-vtlr.onrender.com`
- **Documentazione Interattiva:** `https://my-first-api-vtlr.onrender.com/docs`

Per deployare la tua istanza:
1.  Crea un account su [Render](https://render.com/)
2.  Connetti il tuo repository GitHub
3.  Render rileverà automaticamente il progetto Python e lo deployerà
