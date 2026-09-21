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
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);
  const [hasTodayWorkout, setHasTodayWorkout] = useState(false);

  useEffect(() => {
    apiFetch("/users/workouts")
      .then((res) => res.json())
      .then((data) => setWorkout(data))
  }, []);

  useEffect(() => {
    fetch(`${API}/exercises`)
      .then((res) => res.json())
      .then((data) => setExercises(data))
      .catch((err) => console.error("Failed to apiFetch exercises:", err));
  }, []);

function handleWorkoutCreated(newWorkout) {
  setWorkout({
    ...newWorkout,
    workout_exercises: [],
  });
  setHistoryRefreshKey((k) => k + 1); // tell History something changed
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
  await apiFetch(`/workouts/${workout.id}`, { method: "DELETE" });
  setWorkout(null);
  setHistoryRefreshKey((k) => k + 1); // tell History something changed
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

    const res = await apiFetch(
      `/users/workouts?workout_date=${workout.workout_date}`
    );

    const data = await res.json();
    setWorkout(data);
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
      <div className="min-h-screen w-full py-6 flex flex-row justify-between">
        <div className="w-64 shrink-0">
          <History handleFetchWorkoutDate={handleFetchWorkoutDate} historyRefreshKey={historyRefreshKey} onTodayWorkout={setHasTodayWorkout}></History>
        </div>
        <div className="flex-1 px-8">
          <StartWorkout onWorkoutCreated={handleWorkoutCreated}/>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full py-6 flex flex-row justify-between">
      
      {/* history bar: rightmost */}
      <div className="w-64 shrink-0">
        <History 
          handleFetchWorkoutDate={handleFetchWorkoutDate}
          historyRefreshKey={historyRefreshKey} 
          onTodayWorkout={setHasTodayWorkout}>  
        </History>
      </div>

      {/* log section: center */}
      <div className="flex-1 px-8">
      {!hasTodayWorkout && (
        <div className="mb-4">
          <p>Viewing {workout.workout_date} — not today's workout.</p>
          <StartWorkout onWorkoutCreated={handleWorkoutCreated} />
        </div>
      )}
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