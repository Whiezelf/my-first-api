from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List

# Importa il database che abbiamo creato
from database import engine, SessionLocal, Todo

# Crea le tabelle nel database (assicurati che esistano)
from database import Base
Base.metadata.create_all(bind=engine)

app = FastAPI()

# --- MODELLI PYDANTIC (lo 'schema' dei dati in entrata/uscita) ---
class TodoCreate(BaseModel):
    title: str
    description: Optional[str] = None

class TodoResponse(TodoCreate):
    id: int

    class Config:
        orm_mode = True  # Importante: dice a Pydantic di leggere dall'ORM

# --- DIPENDENZA PER IL DATABASE (magia che fornisce una sessione ad ogni richiesta) ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- ENDPOINT (le nostre API vere e proprie) ---
@app.post("/todos/", response_model=TodoResponse)
def create_todo(todo: TodoCreate, db: Session = Depends(get_db)):
    """
    Crea un nuovo Todo.
    """
    db_todo = Todo(title=todo.title, description=todo.description)
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)  # Per ottenere l'id generato dal database
    return db_todo

@app.get("/todos/", response_model=List[TodoResponse])
def read_todos(db: Session = Depends(get_db)):
    """
    Legge tutti i Todo.
    """
    todos = db.query(Todo).all()
    return todos

@app.get("/todos/{todo_id}", response_model=TodoResponse)
def read_todo(todo_id: int, db: Session = Depends(get_db)):
    """
    Legge un singolo Todo per ID.
    """
    todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo non trovato")
    return todo

@app.put("/todos/{todo_id}", response_model=TodoResponse)
def update_todo(todo_id: int, todo_update: TodoCreate, db: Session = Depends(get_db)):
    """
    Aggiorna un Todo esistente.
    """
    # 1. Cerca il Todo nel database
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo non trovato")
    
    # 2. Aggiorna solo i campi che ci vengono passati
    if todo_update.title is not None:
        db_todo.title = todo_update.title
    if todo_update.description is not None:
        db_todo.description = todo_update.description
    
    # 3. Salva le modifiche nel database
    db.commit()
    db.refresh(db_todo)  # Ricarica l'oggetto dal database per avere i dati aggiornati
    return db_todo

@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    """
    Elimina un Todo.
    """
    # 1. Cerca il Todo nel database
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo non trovato")
    
    # 2. Eliminalo dal database
    db.delete(db_todo)
    db.commit()
    
    # 3. Restituisci una conferma semplice (senza corpo, solo status 200 OK)
    return {"message": f"Todo con id {todo_id} eliminato con successo"}

@app.get("/")
def read_root():
    """
    Health Check endpoint.
    Returns basic API information.
    """
    return {
        "message": "Benvenuto nella Todo API",
        "version": "1.0",
        "docs": "/docs",
        "operations": ["CREATE (POST)", "READ (GET)", "UPDATE (PUT)", "DELETE (DELETE)"]
    }