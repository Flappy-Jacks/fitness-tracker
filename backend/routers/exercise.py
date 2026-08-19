from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import bcrypt

import models
import schemas
from database import get_db

router = APIRouter(
    prefix="/exercises",
    tags=["Exercises"]
)

@router.get("", response_model=list[schemas.ExerciseResponse])
def list_exercises(db: Session = Depends(get_db)):
    return db.query(models.Exercise).all()

# @router.post("", response_model=schemas.WorkoutResponse)
# def create_workout(workout: schemas.WorkoutCreate, db: Session = Depends(get_db)):
#     new_workout = models.Workout(**workout.dict())
#     db.add(new_workout)
#     db.commit()
#     db.refresh(new_workout)
#     return new_workout