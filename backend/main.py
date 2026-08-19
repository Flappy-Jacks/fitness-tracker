from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from database import get_db
import models, schemas
import bcrypt
from routers import users, workout, exercise, workout_exercise, set_log, auth
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(workout.router)
app.include_router(exercise.router)
app.include_router(workout_exercise.router)
app.include_router(set_log.router)
app.include_router(auth.router)

@app.get("/")
async def root():
    return {"message": "Hello, World!"}

def main():
    print("Hello from backend!")

if __name__ == "__main__":
    main()


