import React from 'react'
import netlifyIdentity from 'netlify-identity-widget'

function Login() {
  const handleLogin = () => {
    netlifyIdentity.open('login')
  }

  const handleLogout = () => {
    netlifyIdentity.logout()
  }

  return (
    <div>
      <button onClick={handleLogin}>Log In</button>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  )
}

export default Login