import { Routes, Route, Link } from "react-router-dom";
import LogWorkout from "./pages/LogWorkout";
import History from "./pages/History";
import LoginRegister from "./pages/LoginRegister";
import LogoutButton from "./components/LogoutButton";
import Register from "./pages/Register";

function App() {
  

  return (
    <div className="flex flex-col justify-center items-center">
      <nav className="h-18 shadow-lg w-full flex justify-between items-center px-30">
        LOGO
        
        <div className="flex justify-between max-w-[50%] flex-1">
          <Link to="/log">Logs</Link>
          <Link to="/history">History</Link>
          <Link to="/">Progress</Link>
          <Link to="/">Diet</Link>
          <Link to="/">Coach</Link>
        </div>
        
        <LogoutButton/>
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