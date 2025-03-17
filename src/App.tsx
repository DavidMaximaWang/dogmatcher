import { useState } from 'react'
import './App.css'
import Home from './components/Home'
import Login from './components/Login'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const handleLogin = () => {
    setIsLoggedIn(true)
  }
  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  return (
    <>
   {!isLoggedIn ? (<Login handleLogin={handleLogin}/>):(<Home handleLogout={handleLogout}/>)}
    </>
  )
}

export default App
