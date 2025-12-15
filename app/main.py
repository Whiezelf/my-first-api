from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from app.security import verify_password, create_access_token, SECRET_KEY, ALGORITHM
from app.schemas import Token, TokenData, UserCreate, UserInDB
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import crud, schemas
from .models import SessionLocal, engine, Base

# Crea le tabelle nel database
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Todo API", description="Una semplice API per gestire todo", version="1.0.0")

# Dipendenza per ottenere la sessione del database
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Credenziali non valide",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = crud.get_user_by_email(db, email=token_data.email)
    if user is None:
        raise credentials_exception
    return user

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/register", response_model=UserInDB)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email già registrata")
    return crud.create_user(db=db, user=user)

@app.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, email=form_data.username)  # FastAPI usa 'username' per l'email
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Email o password errati")
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/")
def read_root():
    return {
        "message": "Benvenuto nella Todo API",
        "docs": "/docs",
        "operations": ["CREATE (POST)", "READ (GET)", "UPDATE (PUT)", "DELETE (DELETE)"]
    }

@app.post("/todos/", response_model=schemas.TodoInDB)
def create_todo(todo: schemas.TodoCreate, db: Session = Depends(get_db), current_user: UserInDB = Depends(get_current_user)):
    return crud.create_todo(db=db, todo=todo, owner_id=current_user.id)

@app.get("/todos/", response_model=list[schemas.TodoInDB])
def read_todos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: UserInDB = Depends(get_current_user)):
    todos = crud.get_todos(db, skip=skip, limit=limit, owner_id=current_user.id)
    return todos

@app.get("/todos/{todo_id}", response_model=schemas.TodoInDB)
def read_todo(todo_id: int, db: Session = Depends(get_db), current_user: UserInDB = Depends(get_current_user)):
    db_todo = crud.get_todo(db, todo_id=todo_id, owner_id=current_user.id)
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo non trovato")
    return db_todo

@app.put("/todos/{todo_id}", response_model=schemas.TodoInDB)
def update_todo(todo_id: int, todo: schemas.TodoUpdate, db: Session = Depends(get_db), current_user: UserInDB = Depends(get_current_user)):
    db_todo = crud.update_todo(db, todo_id=todo_id, todo=todo, owner_id=current_user.id)
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo non trovato")
    return db_todo

@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int, db: Session = Depends(get_db), current_user: UserInDB = Depends(get_current_user)):
    success = crud.delete_todo(db, todo_id=todo_id, owner_id=current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Todo non trovato")
    return {"message": f"Todo con id {todo_id} eliminato"}
