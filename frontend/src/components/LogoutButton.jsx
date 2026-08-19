import React from 'react'
import { useNavigate } from "react-router-dom"

const LogoutButton = () => {
    const navigate = useNavigate()
    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    }
    return (
    <button onClick={handleLogout}>Log out</button>
  )
}

export default LogoutButton