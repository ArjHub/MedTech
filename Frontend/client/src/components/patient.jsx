import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PresentData from "./PresentData";
import axios from "axios";
import Web3 from 'web3';
import medTechABI from '../abis/medTechABI.json';
import '../Styles/patient.css';
import logoo from '../Images/logo1.png'; 

const web3 = new Web3(window.ethereum);
const medTechAddress = "0x2A3BD9A67351B37e6Cc90D8ec742b240f375e87C"; 

const medTechContract = new web3.eth.Contract(medTechABI, medTechAddress);

const Patient = () => {
    const [currentProblem, setCurrentProblem] = useState("");
    const [currentSymptom, setCurrentSymptom] = useState("");
    const [symptoms, setSymptoms] = useState([]);
    const [retrievedData, setRetrievedData] = useState(null);
    const [medicationRecords, setMedicationRecords] = useState([])
    const [idealTime, setIdealTime] = useState("");
    const [date, setDate] = useState("");
    const [phone, setPhone] = useState("");
    const [duration, setDuration] = useState("");
    const [progression, setProgression] = useState("");
    const [contractMethod, setContractMethod] = useState("");
    const [showMedicationsPage, setShowMedicationsPage] = useState(false);
    const [showAppointments, setShowAppointments] = useState(false);
    const [appointmentData, setAppointmentData] = useState(null); // State to store appointment data

    const location = useLocation();
    const walletAddress = location.state ? location.state.walletAddress : ".";
    const navigate = useNavigate();
    useEffect(() => {
        if(walletAddress === "."){
          navigate('/signup');
        }
      }, [walletAddress, navigate]);

      useEffect(() => {
        const retrieveMedicationRecords = async () => {
            try {
                const records = await medTechContract.methods.getPatientMedicationRecords(walletAddress).call();
                setMedicationRecords(records);
            } catch (error) {
                console.log("Error retrieving medication records:", error);
            }
        };

        retrieveMedicationRecords();
    }, [walletAddress]);

    const storeDataInPinata = async (data) => {
        console.log("Data to be sent to Pinata:", data);
        try {
            const response = await axios.post(
                "https://api.pinata.cloud/pinning/pinJSONToIPFS",
                data,
                {
                    headers: {
                        "Content-Type": "application/json",
                        pinata_api_key: "38690e4d17a7e4820ed6",
                        pinata_secret_api_key:
                            "d3199a0a493b914fd974ffa0ba7bb38fbbffc4acd83b6cbc927e42dc8c7cb7ad",
                    },
                }
            );
            const cid = response.data.IpfsHash;
            console.log(cid);
            await registerMedicationRecord(cid);
        } catch (error) {
            console.log(error);
        }
    };

    const registerMedicationRecord = async (cid) => {
        try {
            await medTechContract.methods.registerMedicationRecord(cid).send({ from: walletAddress });
        } catch (error) {
            console.log(error);
        }
    };

    const retrieveDataFromPinata = async () => {
        try {
            const mr = medicationRecords;
            const allMedicationData = [];
            for (let i = 0; i < mr.length; i++) {
                const cid = mr[i];
                const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${cid}`);
                allMedicationData.push(response.data);
            }

            if (allMedicationData.length > 0) {
                setRetrievedData(allMedicationData);
                setShowMedicationsPage(true);
                setShowAppointments(false);
            } else {
                console.log("No medication records found.");
                setRetrievedData(null);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const retrieveDataFromPinataa = async (cid) => {
        try {
            const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${cid}`);
            return response.data;
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    const recentAppointment = async () => { 
        try {
            const mr = medicationRecords;
            
            for (let i = mr.length-1; i >= 0; i--) {
                const cid = mr[i];
                const data = await retrieveDataFromPinataa(cid);
                if (data && data.Appointment && data.Appointment !== "") {
                    setAppointmentData(data.Appointment);
                    setShowMedicationsPage(false);
                    setShowAppointments(true);
                    break;
                }
            }
           
        }
        catch (error) {
            console.log('Error', error);
        }
    }

    const sendDataToPinata = () => {
        const data = {
            Problem: currentProblem,
            Symptoms: symptoms,
            IdealTime: idealTime,
            Date: date,
            Phone: phone,
            Duration: duration,
            Progression: progression,
            ContractMethod: contractMethod,
            Medication: "",
            Appointment: ""
        };

        console.log(data);
        storeDataInPinata(data);
    };

    const handleHomeButtonClick = () => {
        setShowAppointments(false);
        setShowMedicationsPage(false);
        navigate('/patient', { state: { walletAddress } });
    };

    return (
        <div className="dashboard_container">
            <aside className="sidebar">
                <button className="sidebar-button" onClick={retrieveDataFromPinata}>Show Medications</button>
                <button className="sidebar-button" onClick={recentAppointment}>Appointments</button>
                <button className="sidebar-button" onClick={handleHomeButtonClick}>Home</button>
            </aside>
            <div className="content_area">
                <div className="patient_body">
                    <header className="header">
                        <img src={logoo} alt="Logo" className="logoo" onClick={() => navigate("/")}/>
                    </header>
                    <div className="patient-container">
                        {(!showAppointments && !showMedicationsPage) && (
                            <PresentData
                                className="present-data"
                                currentProblem={currentProblem}
                                setCurrentProblem={setCurrentProblem}
                                currentSymptom={currentSymptom}
                                setCurrentSymptom={setCurrentSymptom}
                                symptoms={symptoms}
                                setSymptoms={setSymptoms}
                                setIdealTime={setIdealTime}
                                setDate={setDate}
                                setPhone={setPhone}
                                setDuration={setDuration}
                                setProgression={setProgression}
                                setContractMethod={setContractMethod}
                            />
                        )}<br /><br /><br />
                        {(!showAppointments && !showMedicationsPage) && (
                            <button className="button-send" onClick={sendDataToPinata}>Send</button>
                        )}
                        {showMedicationsPage && (
                            <div className="retrieved-data">
                                <h2>Retrieved Data:</h2>
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th className="table-heading">Problem</th>
                                            <th className="table-heading">Symptoms</th>
                                            <th className="table-heading">Medications</th>
                                            <th className="table-heading">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {retrievedData && retrievedData.map((data, index) => (
                                            data.Medications && data.Medications.length > 0 && (
                                                <tr key={index} className="data-row">
                                                    <td className="table-data">{data.Problem}</td>
                                                    <td className="table-data">
                                                        <ul className="symptom-list">
                                                            {data.Symptoms.map((symptom, index) => (
                                                                <li key={index} className="symptom-item">{symptom}</li>
                                                            ))}
                                                        </ul>
                                                    </td>
                                                    <td className="table-data">{data.Medications}</td>
                                                    <td className="table-data">{data.Date}</td>
                                                </tr>
                                            )
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {showAppointments && (
                            <div className="appointment-data">
                                <h2>Appointment:</h2>
                                <p>{appointmentData}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Patient;