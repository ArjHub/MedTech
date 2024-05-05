import React, { useState, useEffect } from "react";
import '../Styles/Presentdata.css';

const PresentData = ({
  currentProblem,
  setCurrentProblem,
  currentSymptom,
  setCurrentSymptom,
  setSymptoms,
  symptoms,
  setIdealTime,
  setDate,
  setPhone,
  setDuration,
  setProgression, 
  setContractMethod
}) => {

    useEffect(() => {
        const todayDate = getTodayDate();
        setDate(todayDate);
      }, []);

    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const addSymptom = () => {
        setSymptoms([...symptoms, currentSymptom]);
        setCurrentSymptom("");
    };

    return (
    <div class="register-area_">
        <div class="register-container">
            <div class="Problem">
                <div class="Current Problem">
                    <h3>Current Problem :</h3>
                    <input type="text" value={currentProblem} onChange={(e) => setCurrentProblem(e.target.value)} class="register-input" required/>
                </div>
                <div class="Symptoms">
                    <h3>Symptoms for Current Problem :</h3>
                    <input type="text" value={currentSymptom} onChange={(e) => setCurrentSymptom(e.target.value)} class="register-input" required/><br /><br />
                    <button onClick={addSymptom} class="register-button">Add</button>
                </div>
                <div class="Additional Info">
                    <h3>Additional Information:</h3>
                    <label for="ideal-time" class="register-label">Ideal Time for Contact:</label>
                    <input type="text" id="ideal-time" onChange={(e) => setIdealTime(e.target.value)} class="register-input" required/>
                    <br />
                    <label for="date" class="register-label">Date:</label>
                    <input type="date" id="date" value={getTodayDate()} onChange={(e) => setDate(e.target.value)} class="register-input" readOnly />
                    <br />
                    <label for="phone" class="register-label">Phone Number:</label>
                    <input type="text" id="phone" onChange={(e) => setPhone(e.target.value)} class="register-input"/>
                    <br />
                    <label for="duration" class="register-label">How Long has it been going for?</label>
                    <input type="text" id="duration" onChange={(e) => setDuration(e.target.value)} class="register-input"/>
                    <br />
                    <label for="progression" class="register-label">Is this problem getting worse or better? Have You tried anything?</label>
                    <textarea id="progression" onChange={(e) => setProgression(e.target.value)} class="register-input"></textarea>
                    <br />
                    <label for="contract-method" class="register-label">Contact Method Preference:</label>
                    <select id="contract-method" onChange={(e) => setContractMethod(e.target.value)} class="register-select">
                        <option value="none">Select</option>
                        <option value="email">Email</option>
                        <option value="phone">Phone</option>
                        <option value="mail">Mail</option>
                    </select>
                </div>
            </div>
        </div>
    </div>
);
};

export default PresentData;
