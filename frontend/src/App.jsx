import { Routes, Route, Link } from "react-router-dom";
import LogWorkout from "./pages/LogWorkout";
import History from "./pages/History";
import LoginRegister from "./pages/LoginRegister";
import LogoutButton from "./components/LogoutButton";
import Register from "./pages/Register";

function App() {
  

  return (
    <div className="pt-4 flex justify-center grid">
      <nav>
        <Link to="/log">Log Workout</Link> | <Link to="/history">History</Link> | <Link to="/">Login</Link> | <LogoutButton/>
      </nav>

      <Routes>
        <Route path="/" element={<LoginRegister/>}/>
        <Route path="/history" element={<History/>}/>
        <Route path="/log" element={<LogWorkout/>}/>
        <Route path="/register" element={<Register/>}/>
      </Routes>
    </div>
  );
}

export default App;