import React from 'react'
import { useState, useEffect } from "react";
import { apiFetch } from "@/api";



const WorkoutExerciseCard = ({ name, set_logs, notes="", workoutExerciseId, onSetCreated, onSetDeleted, onSetUpdated, onWorkoutExerciseDeleted }) => {
    const user = JSON.parse(localStorage.getItem("user"));  
    const [weight, setWeight] = useState("");
    const [reps, setReps] = useState("");
    const [editingSetId, setEditingSetId] = useState(null);
    const [editWeight, setEditWeight] = useState("");
    const [editReps, setEditReps] = useState("");
    

    async function handleSubmit(e) {
    e.preventDefault();

    const response = await apiFetch(`/set-log`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        workout_exercise_id: workoutExerciseId,
        set_number: set_logs.length + 1,
        weight: Number(weight),
        reps: Number(reps),
      }),
    });

    const newSet = await response.json();
    onSetCreated(newSet);
    setWeight("");
    setReps("");
  }

async function handleDeleteSet(setId) {
  await apiFetch(`/set-log/${setId}`, {
    method: "DELETE",
  });

  onSetDeleted(setId);
}

async function handleDeleteWorkoutExercise(workoutExerciseId) {
  await apiFetch(`/workout-exercise/${workoutExerciseId}`, {
    method: "DELETE",
  });

  onWorkoutExerciseDeleted(workoutExerciseId);
}

async function handleSave(setId) {
  const response = await apiFetch(`/set-log/${setId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      weight: Number(editWeight),
      reps: Number(editReps),
    }),
  });

  const updatedSet = await response.json();

  onSetUpdated(updatedSet);

  setEditingSetId(null);
}

 return (
    <div className="border rounded-lg p-5 w-full">
      <div className='flex flex-col gap-2'>
        
        {/* name and delete */}
        <div className='flex justify-between'>
          <p className='font-karla text-md'>{name}</p>
          <button 
            className='border rounded-lg text-white bg-primary px-2 cursor-pointer ' 
            onClick={() => handleDeleteWorkoutExercise(workoutExerciseId)}>
            x
          </button>
        </div>

        {/* input fields */}
        <form onSubmit={handleSubmit} className="flex gap-0">
          <input
            className="px-2 border flex-1 min-w-0"
            type="number"
            placeholder="weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />

          <input
            className="px-2 border flex-1 min-w-0"
            type="number"
            placeholder="reps"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
          />

          <button className="px-2 border shrink-0 cursor-pointer " type="submit">
            +
          </button>
        </form>

        {/* logs */}
        <div className="">
          {set_logs.map((set) => (
            <div key={set.id} className="flex justify-between">
              {/* Set info group */}
              <div>
                {editingSetId === set.id ? (
                  <div className="flex gap-2">
                    <p>Set {set.set_number}:</p>
                    <input
                      type="number"
                      value={editWeight}
                      onChange={(e) => setEditWeight(e.target.value)}
                      className="border px-2 w-16"
                    />

                    <input
                      type="number"
                      value={editReps}
                      onChange={(e) => setEditReps(e.target.value)}
                      className="border px-2 w-16"
                    />
                  </div>
                ) : (
                  <p>
                    Set {set.set_number}: {set.weight} x {set.reps}
                  </p>
                )}
              </div>

              {/* Button group */}
              <div className="flex">
                {editingSetId === set.id ? (
                  <>
                    <button 
                      className="px-2 cursor-pointer "
                      onClick={() => handleSave(set.id)}
                    >
                      Save
                    </button>

                    <button
                      className="px-2 cursor-pointer "
                      onClick={() => setEditingSetId(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="px-2 cursor-pointer "
                      onClick={() => {
                        setEditingSetId(set.id);
                        setEditWeight(set.weight);
                        setEditReps(set.reps);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="px-2 cursor-pointer "
                      onClick={() => handleDeleteSet(set.id)}
                    >
                      x
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>



      <div>{notes}</div>
    </div>
  );
}

export default WorkoutExerciseCard