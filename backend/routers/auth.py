from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from pydantic import BaseModel
from database import get_db
import models
from auth import create_access_token
from datetime import datetime
import hashlib


router = APIRouter(prefix="/auth")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class LoginRequest(BaseModel):
    email: str
    password: str

@router.get("/verify-email")
def verify_email(token: str, db: Session = Depends(get_db)):
    token_hash = hashlib.sha256(token.encode()).hexdigest()

    verification = (
        db.query(models.EmailVerificationToken)
        .filter(
            models.EmailVerificationToken.token_hash == token_hash,
            models.EmailVerificationToken.used == False,
        )
        .first()
    )

    if not verification:
        raise HTTPException(
            status_code=400,
            detail="Invalid or already used verification token"
        )

    if verification.expires_at < datetime.utcnow():

        raise HTTPException(
            status_code=400,
            detail="Verification token has expired"
        )

    user = db.query(models.Users).filter(
        models.Users.id == verification.user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=400,
            detail="User not found"
        )

    user.email_verified = True
    verification.used = True

    db.commit()

    return {"message": "Email verified successfully"}

@router.post("/login")
def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.Users).filter(
        models.Users.email == credentials.email
    ).first()

    if not user or not pwd_context.verify(
        credentials.password,
        user.password_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not user.email_verified:
        raise HTTPException(
            status_code=403,
            detail="Please verify your email before logging in"
        )

    # Your existing token code continues here
    token = create_access_token(user.id)

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email
        }
    }