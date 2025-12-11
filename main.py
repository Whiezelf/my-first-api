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