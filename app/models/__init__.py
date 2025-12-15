from sqlalchemy import create_engine, Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship

# Crea il 'motore' che si connette al database SQLite (file `todos.db`)
SQLALCHEMY_DATABASE_URL = "sqlite:///./todos.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})

# Crea una 'sessione' per parlare con il database
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base per creare i nostri modelli (le 'tabelle')
Base = declarative_base()

# ====================== MODELLO UTENTE ======================
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)

    # Relazione: Un utente può avere molti todo
    todos = relationship("Todo", back_populates="owner")

# ====================== MODELLO TODO ======================
class Todo(Base):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String, index=True, nullable=True)
    # Nuovo campo: foreign key verso l'utente proprietario
    owner_id = Column(Integer, ForeignKey("users.id"))

    # Relazione: Un todo appartiene a un utente
    owner = relationship("User", back_populates="todos")

# Crea effettivamente le tabelle nel database (se non esistono)
Base.metadata.create_all(bind=engine)