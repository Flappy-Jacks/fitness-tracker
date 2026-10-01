from sqlalchemy import (
    Boolean,
    Column,
    Date,
    Enum,
    ForeignKey,
    Integer,
    Numeric,
    String,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship
import enum
from database import Base
from datetime import datetime
from sqlalchemy import DateTime

class EmailVerificationToken(Base):
    __tablename__ = "email_verification_tokens"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    token_hash = Column(String, nullable=False, unique=True)
    expires_at = Column(DateTime, nullable=False)
    used = Column(Boolean, nullable=False, default=False)

    user = relationship("Users")

class WorkoutSplit(enum.Enum):
    push = "push"
    pull = "pull"
    legs = "legs"
    upper = "upper"
    lower = "lower"
    full = "full"
    cardio = "cardio"


class Users(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(String, nullable=False, unique=True)
    name = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)
    email_verified = Column(Boolean, nullable=False, default=False)

    workouts = relationship("Workout", back_populates="user")


class Workout(Base):
    __tablename__ = "workout"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    workout_date = Column(Date)
    split = Column(Enum(WorkoutSplit), nullable=True)

    __table_args__ = (UniqueConstraint("user_id", "workout_date", name="workout_user_date_unique"),)

    workout_exercises = relationship("Workout_exercise", back_populates="workout", cascade="all, delete-orphan")    
    user = relationship("Users", back_populates="workouts")

class Exercise(Base):
    __tablename__ = "exercise"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    muscle_group = Column(String)


class Workout_exercise(Base):
    __tablename__ = "workout_exercise"

    id = Column(Integer,primary_key=True)
    workout_id = Column(Integer, ForeignKey("workout.id"))
    exercise_id = Column(Integer, ForeignKey("exercise.id"))
    order_index = Column(Integer)
    notes = Column(String, nullable=True)

    workout = relationship("Workout", back_populates="workout_exercises")
    exercise = relationship("Exercise")
    set_logs = relationship("Set_log", back_populates="workout_exercise", cascade="all, delete-orphan")


class Set_log(Base):
    __tablename__ = "set_log"

    id = Column(Integer, primary_key=True)
    workout_exercise_id = Column(Integer, ForeignKey("workout_exercise.id"))
    set_number = Column(Integer)
    reps = Column(Integer)
    weight = Column(Numeric)

    workout_exercise = relationship("Workout_exercise", back_populates="set_logs")