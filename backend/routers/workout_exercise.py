from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import models
import schemas
from database import get_db

router = APIRouter(
    prefix="/workout-exercise",
    tags=["Workout-exerise"]
)

@router.get("/{workout_exercise_id}", response_model=schemas.WorkoutExerciseResponse)
def get_workout_exercise(workout_exercise_id: int, db: Session = Depends(get_db)):
    workout_exercise = db.query(models.Workout_exercise).filter(models.Workout_exercise.id == workout_exercise_id).first()
    if not workout_exercise:
        raise HTTPException(status_code=404, detail="Exercise for this workout not found")
    return workout_exercise

@router.post("", response_model=schemas.WorkoutExerciseResponse)
def create_workout_exercise(workout_exercise: schemas.WorkoutExerciseCreate, db: Session = Depends(get_db)):
    new_workout_exercise = models.Workout_exercise(**workout_exercise.dict())
    db.add(new_workout_exercise)
    db.commit()
    db.refresh(new_workout_exercise)
    return new_workout_exercise

@router.delete("/{workout_exercise_id}")
def delete_workout(workout_exercise_id: int, db: Session = Depends(get_db)):
    workout = db.query(models.Workout_exercise).filter(models.Workout_exercise.id == workout_exercise_id).first()
    if not workout:
        raise HTTPException(status_code=404, detail="Workout not found")
    db.delete(workout)
    db.commit()
    return {"detail": "deleted"}