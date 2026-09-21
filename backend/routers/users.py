from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
import bcrypt
from datetime import date
import models
import schemas
from database import get_db
from fastapi import Query
from auth import get_current_user

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.get("/workouts/history")
def get_user_workout_history(current_user: models.Users = Depends(get_current_user), db: Session = Depends(get_db)):
    workouts = (
        db.query(models.Workout.id, models.Workout.workout_date, models.Workout.split)
        .filter(models.Workout.user_id == current_user.id)
        .order_by(models.Workout.workout_date.desc())
        .all()
    )

    return [
        {"id": workout.id, "date": workout.workout_date, "split": workout.split.value if workout.split else None}
        for workout in workouts
    ]

@router.get("/workouts", response_model=schemas.WorkoutFullDetail | None)
def get_user_workouts_full(
    workout_date: date | None = None,
    current_user: models.Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if workout_date is None:
        workout_date = date.today()

    workout = (
        db.query(models.Workout)
        .filter(models.Workout.user_id == current_user.id)
        .filter(models.Workout.workout_date == workout_date)
        .options(
            joinedload(models.Workout.workout_exercises)
            .joinedload(models.Workout_exercise.exercise),
            joinedload(models.Workout.workout_exercises)
            .joinedload(models.Workout_exercise.set_logs),
        )
        .first()
    )
    return workout


@router.get("/{user_id}", response_model=schemas.UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    users = db.query(models.Users).filter(models.Users.id == user_id).first()
    if not users:
        raise HTTPException(status_code=404, detail="User not found")
    return users


@router.post("", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    hashed = bcrypt.hashpw(
        user.password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    new_user = models.Users(
        name=user.name,
        email=user.email,
        password_hash=hashed
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

@router.get("/{user_id}/workouts-range")
def get_workouts_range(user_id: int, start: date, end: date, db: Session = Depends(get_db)):
    workouts = (
        db.query(models.Workout)
        .filter(models.Workout.user_id == user_id)
        .filter(models.Workout.workout_date.between(start, end))
        .all()
    )
    return workouts

@router.get("/{user_id}/workouts-full", response_model=list[schemas.WorkoutFullDetail])
def get_user_workouts_full(user_id: int, db: Session = Depends(get_db)):
    workouts = (
        db.query(models.Workout)
        .filter(models.Workout.user_id == user_id)
        .options(
            joinedload(models.Workout.workout_exercises)
            .joinedload(models.Workout_exercise.exercise),
            joinedload(models.Workout.workout_exercises)
            .joinedload(models.Workout_exercise.set_logs),
        )
        .all()
    )
    if not workouts:
        raise HTTPException(status_code=404, detail="Failed to fetch this user's workouts")
    return workouts