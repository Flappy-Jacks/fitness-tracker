from backend.database import SessionLocal
from backend.models import Set_log, Users, Exercise, Workout, Workout_exercise
from datetime import date

def seed_database():
    db = SessionLocal()

    try:
        demo_users = [
            Users(
                name="1 Demo User",
                email="1_demo1@example.com",
                password_hash="1_hashed_password_here"
            ),
            Users(
                name="2 Demo User ",
                email="2_demo@example.com",
                password_hash="2_hashed_password_here"
            )
        ]
        db.add_all(demo_users)
        db.commit()
        for demo_user in demo_users:
            db.refresh(demo_user)

        # exercises = [
        #     Exercise(name="Bench Press", muscle_group="Chest"),
        #     Exercise(name="Chest Press", muscle_group="Chest"),
        #     Exercise(name="Squat", muscle_group="Legs"),
        #     Exercise(name="Bulgarian Split Squats", muscle_group="Legs"),
        #     Exercise(name="Deadlift", muscle_group="Back"),
        #     Exercise(name="Chest Supported Machine Rows", muscle_group="Back"),
        # ]

        # db.add_all(exercises)
        # db.commit()
        # for exercise in exercises:
        #     db.refresh(exercise)

        workouts = [
            Workout(user_id=demo_users[0].id, workout_date = date.today()),
            Workout(user_id=demo_users[0].id, workout_date = date(2026, 1, 2)),
            Workout(user_id=demo_users[0].id, workout_date = date(2026, 1, 3)),
        ]
        db.add_all(workouts)
        db.commit()
        for workout in workouts:
            db.refresh(workout)

        workout_exercises = [
            Workout_exercise(
                workout_id = workouts[0].id,
                exercise_id = 58,
                order_index = 1,
                notes = "Good Bench, move up",
            ),
            Workout_exercise(
                workout_id = workouts[0].id,
                exercise_id = 59,
                order_index = 2,
                notes = "Good press, move up",
            )
        ]
        db.add_all(workout_exercises)
        db.commit()
        for workout_exercise in workout_exercises:
            db.refresh(workout_exercise)


        set_logs = [
            Set_log(
                workout_exercise_id = workout_exercises[0].id,
                set_number = 1,
                reps = 9,
                weight = 30
            ),
            Set_log(
                workout_exercise_id = workout_exercises[0].id,
                set_number = 2,
                reps = 8,
                weight = 40
            )
        ]
        db.add_all(set_logs)
        db.commit()
        for set_log in set_logs:
            db.refresh(set_log)

        print("Database seeded!")

    finally:
        db.close()