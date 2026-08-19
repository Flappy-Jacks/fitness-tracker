from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import models
import schemas
from database import get_db

router = APIRouter(
    prefix="/workouts",
    tags=["Workouts"]
)

@router.get("/{workout_id}", response_model=schemas.WorkoutResponse)
def get_workout(workout_id: int, db: Session = Depends(get_db)):
    workout = db.query(models.Workout).filter(models.Workout.id == workout_id).first()
    if not workout:
        raise HTTPException(status_code=404, detail="Workout not found")
    return workout

@router.post("", response_model=schemas.WorkoutResponse)
def create_workout(workout: schemas.WorkoutCreate, db: Session = Depends(get_db)):
    new_workout = models.Workout(**workout.dict())
    db.add(new_workout)
    db.commit()
    db.refresh(new_workout)
    return new_workout

@router.delete("/{workout_id}")
def delete_workout(workout_id: int, db: Session = Depends(get_db)):
    workout = db.query(models.Workout).filter(models.Workout.id == workout_id).first()
    if not workout:
        raise HTTPException(status_code=404, detail="Workout not found")
    db.delete(workout)
    db.commit()
    return {"detail": "deleted"}