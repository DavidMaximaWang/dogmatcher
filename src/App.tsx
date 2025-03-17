import './App.css'
import Home from './components/Home'
import Login from './components/Login'
import { useAuth } from './context/AuthContext'

function App() {
   const {user} =  useAuth();

  return (
    <>
   {!user ? (<Login />):(<Home />)}
    </>
  )
}

export default App
