import { Routes, Route, Link } from "react-router-dom";
import LogWorkout from "./pages/LogWorkout";
import History from "./pages/History";
import LoginRegister from "./pages/LoginRegister";


function App() {
  return (
    <div className="pt-4 flex justify-center grid">
      <nav>
        <Link to="/">Log Workout</Link> | <Link to="/history">History</Link> | <Link to="/login">Login</Link>
      </nav>

      <Routes>
        <Route path="/" element={<LogWorkout/>}/>
        <Route path="/history" element={<History/>}/>
        <Route path="/login" element={<LoginRegister/>}/>
      </Routes>
    </div>
  );
}

export default App;