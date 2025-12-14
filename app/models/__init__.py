from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Crea il 'motore' che si connette al database SQLite (file `todos.db`)
SQLALCHEMY_DATABASE_URL = "sqlite:///./todos.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})

# Crea una 'sessione' per parlare con il database
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base per creare i nostri modelli (le 'tabelle')
Base = declarative_base()

# Definizione della Tabella 'Todo' come una Classe Python
class Todo(Base):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String, index=True, nullable=True)

# Crea effettivamente le tabelle nel database (se non esistono)
Base.metadata.create_all(bind=engine)