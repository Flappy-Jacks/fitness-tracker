from backend.database import SessionLocal
from backend.models import Set_log, Users, Exercise, Workout, Workout_exercise
from backend.scripts.seed import seed_database

db = SessionLocal()

try:
    db.query(Set_log).delete()
    db.query(Workout_exercise).delete()
    # db.query(Exercise).delete()
    db.query(Workout).delete()
    db.query(Users).delete()

    db.commit()
    print("database cleared")

finally:
    db.close()

seed_database()