import React from 'react';
import Web3 from 'web3';
import { useNavigate } from 'react-router-dom';
import '../Styles/home.css';

const Home = () => {
  const navigate = useNavigate();

  const connectWallet = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      navigate('/signup');
    } else {
      alert('Please install MetaMask to use this dApp!');
    }
  };

  return (
    <div className="container">
      <div className="logo-background">
        <p className='tagline'>WHERE EVERY SYMPTOM TELLS A STORY</p>
      </div>
      
      <div className="login-section">
        <div className="welcome-text">
          <h1>Welcome to MedTech</h1>
          <p>Revolutionizing healthcare communication. Patients share<br /> symptoms with doctors, securely stored on blockchain. Doctors use<br /> ADE detectors to detect medication issues and prescribe safely.<br /> NLP aids receptionists in symptom extraction for accurate diagnosis.</p><br />
        </div>
        <div className="login-button-container">
          <button onClick={connectWallet}>Connect with your wallet</button>
        </div>
      </div>
    </div>
  );
};
export default Home;


