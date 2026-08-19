import { useState, useEffect } from "react";
import StartWorkout from "../components/StartWorkout.jsx";
import History from "./History.jsx";
import WorkoutLogs from "../components/WorkoutLogs.jsx";
import { apiFetch } from "@/api";

const API = "http://localhost:8000";

function LogWorkout() {
    
  const [workout, setWorkout] = useState(undefined);
  const [exercises, setExercises] = useState([]);
  const [selectExercise, setSelectedExercise] = useState("");

  useEffect(() => {
    apiFetch("/users/workouts")
      .then((res) => res.json())
      .then((data) => setWorkout(data))
  }, []);

  useEffect(() => {
    fetch(`${API}/exercises`)
      .then((res) => res.json()) // Fixed: added () to json()
      .then((data) => setExercises(data))
      .catch((err) => console.error("Failed to apiFetch exercises:", err));
  }, []);

function handleWorkoutCreated(newWorkout) {
  setWorkout({
    ...newWorkout,
    workout_exercises: [],
  });
}

function handleSetCreated(newSet) {
  setWorkout((prev) => ({
    ...prev,
    workout_exercises: prev.workout_exercises.map((ex) =>
      ex.id === newSet.workout_exercise_id
        ? {
            ...ex,
            set_logs: [...ex.set_logs, newSet],
          }
        : ex
    ),
  }));
}

function handleSetUpdated(updatedSet) {
  setWorkout((prev) => ({
    ...prev,
    workout_exercises: prev.workout_exercises.map((ex) => ({
      ...ex,
      set_logs: ex.set_logs.map((set) =>
        set.id === updatedSet.id ? updatedSet : set
      ),
    })),
  }));
}

function handleSetDeleted(setId) {
  setWorkout((prev) => ({
    ...prev,
    workout_exercises: prev.workout_exercises.map((ex) => ({
      ...ex,
      set_logs: ex.set_logs.filter((set) => set.id !== setId),
    })),
  }));
}

function handleWorkoutExerciseDeleted(workoutExerciseId) {
  setWorkout((prev) => ({
      ...prev,
      workout_exercises: prev.workout_exercises.filter(
        (ex) => ex.id !== workoutExerciseId
      ),
    }));
  };

async function handleDeleteWorkout(){
  await apiFetch(`/workouts/${workout.id}`, {
    method: "DELETE",
  });
  setWorkout(null);
}

async function handleFetchWorkoutDate(workoutDate) {
  const res = await apiFetch(
    `/users/workouts?workout_date=${workoutDate}`
  );
  const data = await res.json();
  setWorkout(data);
}

async function handleAddExercise(){
  const response = await apiFetch(`/workout-exercise`,{
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      workout_id: workout.id,
      exercise_id: selectExercise,
      order_index: 0,
      notes: ""

    })
  });
    // const newWorkoutExercise = await response.json();

    const refresh = await apiFetch(
      `/users/workouts`
    );

    const updatedWorkout = await refresh.json();

    setWorkout(updatedWorkout);
    setSelectedExercise("");
}

  if (workout === undefined) {
    return (
      <>
        <p>Loading...</p>
      </>
    )
  }

  if (workout === null) {
    return (
      <div className="pt-2 justify-center flex gap-5 text-gray-500">
        <History handleFetchWorkoutDate={handleFetchWorkoutDate}></History>
        <div>
          <StartWorkout onWorkoutCreated={handleWorkoutCreated}/>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-2 justify-center flex gap-5 text-gray-500">
      <History handleFetchWorkoutDate={handleFetchWorkoutDate}></History>
      <div>
        <WorkoutLogs
          workout={workout}
          handleDeleteWorkout={handleDeleteWorkout}
          setSelectedExercise={setSelectedExercise}
          selectExercise={selectExercise}
          exercises={exercises}
          handleAddExercise={handleAddExercise}
          handleSetCreated={handleSetCreated}
          handleSetDeleted={handleSetDeleted}
          handleSetUpdated={handleSetUpdated}
          handleWorkoutExerciseDeleted={handleWorkoutExerciseDeleted}
        ></WorkoutLogs>
      </div>
    </div>
  );
}

export default LogWorkout;