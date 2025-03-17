import React from 'react'
import DogSearch from './DogSearch'

function Home({handleLogout}: {handleLogout: () => void}) {
  return (
    <div className="dashboard">
    <div className="header">
      <h1>Welcome to the Dog Search Dashboard!</h1>
      <button onClick={handleLogout} className="logoutButton">
        Logout
      </button>
    </div>
    <DogSearch/>
  </div>
  )
}

export default Home