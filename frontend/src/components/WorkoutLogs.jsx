import React from 'react'
import WorkoutExerciseCard from './WorkoutExerciseCard'

const WorkoutLogs = ( {workout, handleDeleteWorkout, setSelectedExercise, selectExercise, exercises, handleAddExercise, handleSetCreated, handleSetDeleted, handleSetUpdated, handleWorkoutExerciseDeleted } ) => {
  
  const getDayName = (str) => {
    const date = new Date(str);
    if (isNaN(date.getTime())) return "Invalid Date";

    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  
  return (
    <div className="w-full flex flex-col gap-5">
      {/* Date and delete */}
      <div className="flex justify-between">
        <div className='flex-col'>
          <h3 className="font-montserrat font-black text-5xl text-black uppercase"><span className='text-primary'>{workout.split}</span>{" "}day</h3>
          <p className='text-black text-sm'>{getDayName(workout.workout_date)}{" - "}{workout.workout_date}</p>
        </div>
        <button className="border rounded-lg px-3 h-8 bg-primary text-white" onClick={handleDeleteWorkout}>delete</button>
      </div>
      
      
      {/* Plan */}
      <div>
        <p>Plan</p>
        <select className="border" value={selectExercise.id} onChange={(e) => setSelectedExercise(e.target.value)}>
            <option value="">select exercise</option>
          {exercises.map((exercise) => (
            <option value={exercise.id}>{exercise.name}</option>
          ))}
        </select>
        <button className="px-2 border" onClick={handleAddExercise}>+</button>
      </div>
      
      {/* Logs */}
      <p>Logs</p>
      <div className="
        grid
        grid-cols-1
        sm:grid-cols-1
        md:grid-cold-2
        lg:grid-cols-4
        gap-3
      ">

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
    </div>
  )
}

export default WorkoutLogs