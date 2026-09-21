import { useState, useEffect } from 'react';
import { apiFetch } from "@/api";



const History = ( {handleFetchWorkoutDate, historyRefreshKey, onTodayWorkout} ) => {
  const [workoutDates, setWorkoutDates] = useState([]);
    function getLocalDateString(d = new Date()) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    apiFetch(`/users/workouts/history`)
      .then((res) => res.json())
      .then((data) => {
        setWorkoutDates(data);

        onTodayWorkout(
          data.some(w => w.date === getLocalDateString())
        );
      })
      .catch((error) => console.error(error));
  }, [historyRefreshKey]);

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