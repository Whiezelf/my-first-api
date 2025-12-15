from .user import get_user_by_email, create_user
from sqlalchemy.orm import Session
from app.models import Todo
from app.schemas import TodoCreate, TodoUpdate

def get_todo(db: Session, todo_id: int, owner_id: int):
    return db.query(Todo).filter(Todo.id == todo_id, Todo.owner_id == owner_id).first()

def get_todos(db: Session, owner_id: int, skip: int = 0, limit: int = 100):
    return db.query(Todo).filter(Todo.owner_id == owner_id).offset(skip).limit(limit).all()

def create_todo(db: Session, todo: TodoCreate, owner_id:int ):
    db_todo = Todo(title=todo.title, description=todo.description, owner_id=owner_id)
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

def update_todo(db: Session, todo_id: int, todo: TodoUpdate, owner_id: int):
    db_todo = get_todo(db, todo_id, owner_id)
    if db_todo is None:
        return None
    for key, value in todo.dict(exclude_unset=True).items():
        setattr(db_todo, key, value)
    db.commit()
    db.refresh(db_todo)
    return db_todo

def delete_todo(db: Session, todo_id: int, owner_id: int):
    db_todo = get_todo(db, todo_id, owner_id)
    if db_todo is None:
        return False
    db.delete(db_todo)
    db.commit()
    return True