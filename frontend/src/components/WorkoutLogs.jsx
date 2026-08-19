import React from 'react'
import WorkoutExerciseCard from './WorkoutExerciseCard'

const WorkoutLogs = ( {workout, handleDeleteWorkout, setSelectedExercise, selectExercise, exercises, handleAddExercise, handleSetCreated, handleSetDeleted, handleSetUpdated, handleWorkoutExerciseDeleted } ) => {
  return (
    <div className="pt-2 justify-center grid text-gray-500">
      <div className="flex justify-between">
        <h3 className="font-bold ">Today's Workout</h3>
        <button className="border" onClick={handleDeleteWorkout}>delete workout</button>
      </div>
      <p>date: {workout.workout_date}</p>
      <div>
        <p>add exercise</p>
        <select className="border" value={selectExercise.id} onChange={(e) => setSelectedExercise(e.target.value)}>
            <option value="">select exercise</option>
          {exercises.map((exercise) => (
            <option value={exercise.id}>{exercise.name}</option>
          ))}
        </select>
        <button className="px-2 border" onClick={handleAddExercise}>add exercise</button>
      </div>
      <p>exercises:</p>
      {workout.workout_exercises.map((ex) => (
        <WorkoutExerciseCard 
          key={ex.id}
          name={ex.exercise.name} 
          set_logs={ex.set_logs} 
          notes={ex.notes}
          workoutExerciseId = {ex.id}
          onSetCreated = {handleSetCreated}
          onSetDeleted = {handleSetDeleted}
          onSetUpdated = {handleSetUpdated}
          onWorkoutExerciseDeleted = {handleWorkoutExerciseDeleted}
        />
      ))}

    </div>
  )
}

export default WorkoutLogs