import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupPage from './components/signup';
import RegisterPage from './components/register';
import LoginPage from './components/login';
import DoctorPage from './components/doctor';
import PatientPage from './components/patient';
import ReceptionistPage from './components/receptionist';
import HomePage from './components/home';

function App() {
  return (
    <Router>
      <div className="App">        
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/doctor" element={<DoctorPage />} />
          <Route path="/patient" element={<PatientPage />} />
          <Route path="/receptionist" element={<ReceptionistPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;