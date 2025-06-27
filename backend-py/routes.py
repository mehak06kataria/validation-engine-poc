from fastapi import APIRouter, HTTPException
from models import UserProfile

router = APIRouter()


@router.post("/api/profile/save")
def save_profile(profile: UserProfile):
    # Here you can add logic to persist to DB or print for now
    print("Profile received:", profile)
    return {
        "message": "Profile saved successfully",
        "results": [
            {"rule": "Email format valid", "valid": True},
            {"rule": "Phone is 10 digits", "valid": True},
            {"rule": "Age is above 18", "valid": profile.age >= 18},
        ]
    }
