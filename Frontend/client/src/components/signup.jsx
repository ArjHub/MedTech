import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/signup.css'; // Import the CSS file for styling

function Signup() {
  const navigate = useNavigate();

  return (
    <div className="form-area"> {/* Apply background styling */}
      <div className="signup-box"> {/* Apply background and border-radius styling */}
        <h2>SIGNUP</h2>
        <div className="button-container">
          <div className="button-wrapper">
            <p>Hello there, Welcome Back</p>
            <button className="button-login" onClick={() => navigate('/login')}>Login</button>
          </div>
          <div className="button-wrapper">
            <p>Get On Board</p>
            <button className="button-signup" onClick={() => navigate('/register')}>Signup</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
