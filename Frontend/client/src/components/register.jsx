import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Styles/register.css';
import { Link } from 'react-router-dom';

const DoctorForm = ({ setSpecialization }) => (
  <div>
    <label className="register-label">
      Specialization<br />
      <input className="register-input" type="text" onChange={e => setSpecialization(e.target.value)} required />
    </label>
    <label className="register-label">
      Employee ID<br />
      <input className="register-input" type="text" required />
    </label>
  </div>
);

const PatientForm = () => (
  <div>
  </div>
);

const ReceptionistForm = () => (
  <div>
    <label className="register-label">
      Department<br />
      <input className="register-input" type="text" required />
    </label>
    <label className="register-label">
      Employee ID<br />
      <input className="register-input" type="text" required />
    </label>
  </div>
);

function RegisterPage() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [password, setPassword] = useState('');
  const [designation, setDesignation] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [gender, setGender] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
          }
        });
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(`Registering with name: ${walletAddress}, age: ${password}, and designation: ${designation}`);
    try {
      const response = await axios.post('http://localhost:3001/adduser', {
        walletAddr: walletAddress,
        password,
        designation,
        specialization // Include specialization in the data sent to the backend
      });

      console.log(response.data); // Log the response from your backend

      navigate('/login'); // Navigate to the login page after successful registration
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  const renderAdditionalFields = () => {
    switch (designation) {
      case '0': // Doctor
        return <DoctorForm setSpecialization={setSpecialization} />;
      case '1': // Patient
        return <PatientForm />;
      case '2': // Receptionist
        return <ReceptionistForm />;
      default:
        return null;
    }
  };

  return (
    <div className="register-area">
      <div className="register-container">
        <h2 className="register-heading">Register</h2>
        <p className="connected-wallet">Connected Wallet Address</p>
        <p className="wallet_addr">{walletAddress}</p>
        <form className="register-form" onSubmit={handleSubmit}>
          <label className="register-label">
            Name<br />
            <input className="register-input" type="text" value={name} onChange={e => setName(e.target.value)} required />
          </label>
          <label className="register-label">
            Age<br />
            <input className="register-input" type="number" value={age} onChange={e => setAge(e.target.value)} required />
          </label>
          <label className="register-label">
            Gender<br />
            <input className="register-radio" type="radio" name="gender" value="male" checked={gender === 'male'} onChange={e => setGender(e.target.value)} required /> Male
            <input className="register-radio" type="radio" name="gender" value="female" checked={gender === 'female'} onChange={e => setGender(e.target.value)} required /> Female
          </label>
          <label className="register-label">
            Password<br />
            <input className="register-input" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </label>
          <label className="register-label">
            Designation<br />
            <select className="register-select" value={designation} onChange={e => setDesignation(e.target.value)} required>
              <option value="">Select...</option>
              <option value="0">Doctor</option>
              <option value="1">Patient</option>
              <option value="2">Receptionist</option>
            </select>
          </label>
          {renderAdditionalFields()}<br />
          <button className="register-button" type="submit">Register</button>
          <p>Did this already? <Link to="/login" className='linkk'>login</Link></p>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
