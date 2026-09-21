from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import models
import schemas
from database import get_db
from auth import get_current_user

router = APIRouter(
    prefix="/workout-exercise",
    tags=["Workout-exerise"]
)

@router.patch("/{workout_exercise_id}/note", response_model=schemas.WorkoutExerciseResponse)
def update_workout_exercise_note(
    workout_exercise_id: int,
    payload: schemas.WorkoutExerciseNoteUpdate,
    current_user: models.Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    we = db.query(models.Workout_exercise).filter(models.Workout_exercise.id == workout_exercise_id).first()
    if not we:
        raise HTTPException(status_code=404, detail="Workout exercise not found")
    if we.workout.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your workout")

    we.notes = payload.notes
    db.commit()
    db.refresh(we)
    return we

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