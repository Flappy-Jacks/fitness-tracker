from pydantic import BaseModel
from datetime import date
from typing import Optional
from decimal import Decimal

class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        from_attributes = True

class WorkoutCreate(BaseModel):
    user_id: int
    workout_date: date
    split: str | None = None    

class WorkoutResponse(WorkoutCreate):
    id: int

    class Config:
        from_attributes = True

class ExerciseCreate(BaseModel):
    name: str
    muscle_group: str

class ExerciseResponse(ExerciseCreate):
    id: int


    class Config:
        from_attributes = True

class WorkoutExerciseCreate(BaseModel):
    workout_id: int
    exercise_id: int
    order_index: int
    notes: Optional[str] = None

class WorkoutExerciseResponse(WorkoutExerciseCreate):
    id: int

    class Config:
        from_attributes = True

class WorkoutExerciseDetail(BaseModel):
    id: int
    order_index: int
    notes: Optional[str] = None
    exercise: ExerciseResponse
    set_logs: list[SetlogResponse] = []
    class Config:
        from_attributes = True

class SetlogCreate(BaseModel):
    workout_exercise_id: int
    set_number: int
    reps: int
    weight: Optional[Decimal] = None

class SetlogResponse(SetlogCreate):
    id: int
    class Config:
        from_attributes = True

class SetlogUpdate(BaseModel):
    reps: int
    weight: Optional[Decimal] = None

class WorkoutFullDetail(BaseModel):
    id: int
    workout_date: date
    workout_exercises: list[WorkoutExerciseDetail] = []
    class Config:
            from_attributes = True


