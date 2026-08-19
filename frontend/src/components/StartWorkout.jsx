import React from 'react'
import { useState } from "react";
import { apiFetch } from "@/api";

const SPLITS = ["push", "pull", "legs", "upper", "lower", "cardio"];

const StartWorkout = ( {onWorkoutCreated} ) => {
    const user = JSON.parse(localStorage.getItem("user"));  
    const [split, setSplit] = useState("");
    
    function getLocalDateString(d = new Date()) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
        }
    
    async function handleStartWorkout() {
        const response = await apiFetch(`/workouts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id: user.id,
                split: split === "" ? null : split,
                workout_date: getLocalDateString(),//new Date().toISOString().split("T")[0]
            }),
        });

        const newWorkout = await response.json();
        onWorkoutCreated(newWorkout);
    }

    return (
    <>   
        <p>No workout today.</p>
        <select value={split} onChange={(e) => setSplit(e.target.value)}>
            <option value="">No split</option>
            {SPLITS.map((split) => (
                <option key={split} value={split}>{split}</option>
            ))}
        </select>
        <button className="px-2 border" onClick={handleStartWorkout}>Start Workout</button>
    </>
  )
}

export default StartWorkout