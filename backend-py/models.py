from pydantic import BaseModel, EmailStr, constr, validator
from typing import Optional

class UserProfile(BaseModel):
    first_name: constr(strip_whitespace=True, min_length=1)
    last_name: constr(strip_whitespace=True, min_length=1)
    email: EmailStr
    phone: constr(pattern=r"^\d{10}$")
    age: int
    education: Optional[str] = ""
    experience: Optional[str] = ""
    resume_path: Optional[str] = ""

    @validator("age")
    def validate_age(cls, v):
        if v < 18:
            raise ValueError("Age must be at least 18")
        return v
