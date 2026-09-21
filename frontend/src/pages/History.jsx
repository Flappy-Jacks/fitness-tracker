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

  const getDayName = (str) => {
    const date = new Date(str);
    if (isNaN(date.getTime())) return "Invalid Date";

    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

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
    <div className='flex flex-col'>
      {workoutDates.map((workoutDate) => (
        <button key={workoutDate.id} onClick={() => {handleFetchWorkoutDate(workoutDate.date)}} className='px-5 h-20 w-[250px] bg-slate-200 outline-2 outline-white p-2'>
          <div className='flex flex-col items-start text-black'>
            <p className='font-montserrat font-medium text-lg'>{workoutDate.split}</p>
            <p className='font-montserrat text-xs'>{getDayName(workoutDate.date)}{" "}-{" "}{workoutDate.date}</p>
          </div>
        </button>
      ))}
    </div>
  );
};

export default History;