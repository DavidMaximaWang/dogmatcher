import React from 'react'

function Home({handleLogout}: {handleLogout: () => void}) {
  return (
    <div className="dashboard">
    <div className="header">
      <h1>Welcome to the Dog Search Dashboard!</h1>
      <button onClick={handleLogout} className="logoutButton">
        Logout
      </button>
    </div>
    <p>Search functionality coming soon...</p>
  </div>
  )
}

export default Home