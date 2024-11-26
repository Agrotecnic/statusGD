// src/components/LoginButton.js
import React from 'react';
import netlifyIdentity from 'netlify-identity-widget';

const LoginButton = () => {
  const handleLogin = () => {
    console.log("Login button clicked");
    netlifyIdentity.open();
  };

  const handleLogout = () => {
    console.log("Logout button clicked");
    netlifyIdentity.logout();
  };

  return (
    <button 
      onClick={netlifyIdentity.currentUser() ? handleLogout : handleLogin}
      style={{
        backgroundColor: "#4CAF50",
        color: "white",
        padding: "10px 15px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        position: 'fixed',
        top: '20px',
        left: '20px',
        zIndex: 1000
      }}
    >
      {netlifyIdentity.currentUser() ? 'Log Out' : 'Log In'}
    </button>
  );
};

export default LoginButton;