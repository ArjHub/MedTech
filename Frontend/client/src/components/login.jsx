import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../Styles/login.css';

function LoginPage() {
  const [walletAddress, setWalletAddress] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(`Logging in with wallet address: ${walletAddress} and password: ${password}`);
    try {
      const response = await axios.post('http://localhost:3001/login', {
        walletAddr: walletAddress.toLowerCase(),
        password: password
      });
  
      if (response.data.success) {
        const { designation } = response.data;
        
        switch (designation) {
            case '0':
                navigate('/doctor' ,{ state: { walletAddress } });
                break;
            case '1':
                navigate('/patient',{ state: { walletAddress } });
                break;
            case '2':
                navigate('/receptionist',{ state: { walletAddress }});
                break;
        }
      }else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  return (
    <div class="login-area">
    <div class="login-container">
      <h2 class="login-heading">Login</h2>
      <form class="login-form" onSubmit={handleSubmit}>
        <label class="login-label">
          Wallet Address<br />
          <input class="login-input" type="text" value={walletAddress} onChange={e => setWalletAddress(e.target.value)} required />
        </label><br />
        <label class="login-label">
          Password<br />
          <input class="login-input" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </label><br />
        <button class="login-button" type="submit">Login</button>
        <p>Your first time here? <Link to="/register" className='linkk'>Signup</Link></p>
      </form>
    </div>
  </div>
  

  );
}

export default LoginPage;