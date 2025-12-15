from pydantic import BaseModel, field_validator, EmailStr
from typing import Optional

# ====================== SCHEMA PER GLI UTENTI ======================
class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

    @field_validator('password')
    @classmethod
    def password_length(cls, v: str) -> str:
        if len(v) > 72:
            raise ValueError('La password non può superare i 72 caratteri per bcrypt')
        if len(v) < 8:
            raise ValueError('La password deve essere di almeno 8 caratteri')
        return v

class UserInDB(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True  # Ex `orm_mode=True`

# ====================== SCHEMA PER I TOKEN ======================
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# ====================== SCHEMA PER I TODO ======================
class TodoBase(BaseModel):
    title: str
    description: Optional[str] = None

class TodoCreate(TodoBase):
    pass

class TodoUpdate(TodoBase):
    pass

class TodoInDB(TodoBase):
    id: int
    owner_id: int

    class Config:
        from_attributes = True  # Ex `orm_mode=True`