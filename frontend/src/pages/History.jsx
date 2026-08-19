import { useState, useEffect } from 'react';
import { apiFetch } from "@/api";



const History = ( {handleFetchWorkoutDate} ) => {
  const [workoutDates, setWorkoutDates] = useState([]);

  useEffect(() => {
    apiFetch(`/users/workouts/history`)
      .then((res) => res.json())
      .then((data) => setWorkoutDates(data))
      .catch((error) => console.error("Error fetching workout history:", error));
  }, []);

  return (
    <div>
      <h3 className='font-bold'>History</h3>

      <div className='grid'>
        {workoutDates.map((workoutDate) => (
          <button key={workoutDate.id} onClick={() => {handleFetchWorkoutDate(workoutDate.date)}} className='border p-2 mb-2'>
            {workoutDate.date}
          </button>
        ))}
      </div>
    </div>
  );
};

export default History;