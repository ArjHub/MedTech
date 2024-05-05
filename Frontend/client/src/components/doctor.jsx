  import React, { useState, useEffect } from "react";
  import axios from "axios";
  import Web3 from 'web3';
  import medTechABI from '../abis/medTechABI.json';
  import Papa from 'papaparse';
  import { useNavigate, useLocation } from "react-router-dom";
  import "../Styles/doctor.css";
  import logoo from '../Images/logo1.png';

  const web3 = new Web3(window.ethereum);
  const medTechAddress = "0x2A3BD9A67351B37e6Cc90D8ec742b240f375e87C"; // Address of the deployed contract

  const medTechContract = new web3.eth.Contract(medTechABI, medTechAddress);
  const drugEffectData = process.env.PUBLIC_URL + '/drug_effect.csv';
  const drugInteractionData = process.env.PUBLIC_URL + '/reversed_drug_interaction.csv';
  console.log(drugEffectData);

  const Doctor = () => {
    const [walletAddress, setWalletAddress] = useState(""); 
    const [emptyMedicationCIDs, setEmptyMedicationCIDs] = useState([]);
    const [medicationInputs, setMedicationInputs] = useState({});
    const [drugEffectMap, setDrugEffectMap] = useState(new Map());
    const [drugInteractionMap, setDrugInteractionMap] = useState(new Map());
    const [matchedMedications, setMatchedMedications] = useState([]);
    const [matchedInteractions, setMatchedInteractions] = useState([]);

    const location = useLocation();
    const loginAddress = location.state ? location.state.walletAddress : ".";
    const navigate = useNavigate();
    
    useEffect(() => {
      if(loginAddress === "."){
        navigate('/signup');
      }
    }, [loginAddress, navigate]);

    useEffect(() => {
      Papa.parse(drugEffectData, {
        download: true,
        header: true,
        complete: function(results) {
          const tempMap = new Map();
          results.data.forEach(row => {
            const effects = row.effect ? row.effect.split(',').map(effect => effect.trim()) : [];
            const drugLowercase = row.drug ? row.drug.toLowerCase() : null;
            if (tempMap.has(drugLowercase)) {
              tempMap.set(drugLowercase, [...tempMap.get(drugLowercase), ...effects]);
            } else {
              tempMap.set(drugLowercase, effects);
            }
          });
          setDrugEffectMap(tempMap);
        }
      });
      Papa.parse(drugInteractionData, {
        download: true,
        header: true,
        complete: function(results) {
          const tempMap = new Map();
          results.data.forEach(row => {
            if (row.Drug_Name && row.Interaction) {
              const drug = row.Drug_Name.toLowerCase();
              const interaction = row.Interaction.toLowerCase();
          
              if (tempMap.has(interaction)) {
                tempMap.get(interaction).push(drug);
              } else {
                tempMap.set(interaction, [drug]);
              }
            }
          });
          setDrugInteractionMap(tempMap);
        }
      });
    }, []);
    const getRecentProblem = async () => {
      if (!walletAddress) {
        console.log("Please enter a valid wallet address.");
        return;
      }
    
      try {
        console.log("Walletaddr: ",walletAddress);
        const medicationRecords = await medTechContract.methods.getPatientMedicationRecords(walletAddress).call();
        console.log("MEdicationRecords:",medicationRecords);
        let emptyCID = null;
        const filledMedications = [];
    
        for (const cid of medicationRecords) {
          const data = await retrieveDataFromPinata(cid);
          if (data && data.Medications && data.Medications !== "") {
            filledMedications.push({ cid, data });
          } else {
            emptyCID = { cid, data };
          }
        }     
    
        if (emptyCID) {
          setEmptyMedicationCIDs([emptyCID]);
        } else {
          setEmptyMedicationCIDs([]);
        }
    
      } catch (error) {
        console.log(error);
      }
    };  
    
    const checkDrugInteractions = (medication, filledMedications) => {
      const interactions = drugInteractionMap.get(medication?.toLowerCase());
      //console.log(interactions);
      console.log("checking interactions");
      let matchedInteractions = [];
    
      if (interactions && interactions.length > 0) {
        filledMedications.forEach(({ data }) => {
          const filledMedication = data.Medications.toLowerCase();
          //console.log(filledMedication);
          if (interactions.includes(filledMedication)) {
            matchedInteractions.push(filledMedication);
          }
        });
      }
    
      return matchedInteractions;
    };

    const checkEvents = async () => {
    
      try {
        const medicationRecords = await medTechContract.methods.getPatientMedicationRecords(walletAddress).call();
        let emptyCID = null;
        const filledMedications = [];
    
        for (const cid of medicationRecords) {
          const data = await retrieveDataFromPinata(cid);
          if (data && data.Medications && data.Medications !== "") {
            filledMedications.push({ cid, data });
          } else {
            emptyCID = { cid, data };
          }
        }

        if (filledMedications.length === 0) {
          console.log("No medication records found.");
          return;
        }
        const lastRecord = emptyCID;
        const lastSymptoms = lastRecord.data.Symptoms || [];
        const matchedMeds = [];

        // Only compare the last record's symptoms with the drug effects
        filledMedications.forEach(({ data }) => {
          const effects = drugEffectMap.get(data.Medications.toLowerCase());
          if (effects && lastSymptoms) {
            const matchingEffects = effects.filter(effect => {
              // Handle multi-word symptoms
              return lastSymptoms.some(symptom => symptom.toLowerCase().includes(effect.toLowerCase()));
            });
            if (matchingEffects.length > 0) {
              matchedMeds.push({
                medication: data.Medications,
                effects: matchingEffects,
                symptoms: data.Symptoms
              });
            }
          }
        });
        console.log(matchedMeds);
        console.log(medicationInputs);
        // Update to only show the relevant medication
        if (matchedMeds.length > 0) {
          setMatchedMedications([matchedMeds[0]]);
        } else {
          setMatchedMedications([]);
          console.log("No matching medication found for the recent symptoms.");
        }
        const interactions = checkDrugInteractions(medicationInputs[0],filledMedications);
        setMatchedInteractions(interactions);
        console.log(interactions);


      } catch (error) {
        console.log(error);
      }
    };

    const retrieveDataFromPinata = async (cid) => {
      try {
        const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${cid}`);
        return response.data;
      } catch (error) {
        console.log(error);
        return null;
      }
    };

    const handleInputChange = (index, event) => {
      setMedicationInputs({
        ...medicationInputs,
        [index]: event.target.value,
      });
    };

    const handleButtonClick = async (item, index) => {
      try {
        const updatedData = { ...item.data, Medications: medicationInputs[index] || "New Medication", Appointment: medicationInputs[`appointment_${index}`] || "" };
        if (updatedData && updatedData.Medications !== null) {
          const response = await axios.post(
            "https://api.pinata.cloud/pinning/pinJSONToIPFS",
            updatedData,
            {
              headers: {
                "Content-Type": "application/json",
                pinata_api_key: "38690e4d17a7e4820ed6",
                pinata_secret_api_key:
                  "d3199a0a493b914fd974ffa0ba7bb38fbbffc4acd83b6cbc927e42dc8c7cb7ad",
              },
            }
          );
          const newCID = response.data.IpfsHash;
          console.log(newCID);
          const accounts = walletAddress;
          //console.log(walletAddress);
          await medTechContract.methods.registerMedicationRecord(newCID).send({ from: accounts });
    
          getRecentProblem();
        } else {
          console.log("Data or 'Medications' property is null or undefined.");
        }
      } catch (error) {
        console.log(error);
      }
    };
    

    return (
      <div className="doctor-container">
        <br /><br /><br />
        <header className="header">
            <img src={logoo} alt="Logo" className="logoo" onClick={() => navigate("/")}/>
        </header><br /><br />
        <div className="yo-container">
          <h1></h1>
        <input
          type="text"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          className="wallet-field"
          placeholder="Enter patient's wallet address"
        />
        <button onClick={getRecentProblem} className="buttoon">
          Get Recent Problem
        </button>
    
        {(matchedMedications.length > 0 || matchedInteractions.length > 0) && (
          <div className="insight-container">
            <h2 className="insight-title">Doctor's Insight</h2>
            <ul className="insight-list"><h3>Drug-Effect interaction</h3>
              {matchedMedications.map((match, index) => (
                <li key={index} className="insight-item">{`Medication '${match.medication}' matches may be causing the effect: ${match.effects.join(', ')}`}</li>
              ))}
            </ul>
            <h3>Drug- interaction</h3>
            {matchedInteractions.length > 0 ? (
              <ul className="insight-list">
                {matchedInteractions.map((interaction, index) => (
                  <li key={index} className="insight-item">{`${medicationInputs[0]} could have an interaction with ${interaction}`}</li>
                ))}
              </ul>
            ) : (
              <p>No interactions found.</p>
            )}
          </div>
        )}
    
        {emptyMedicationCIDs.length > 0 && (
          <div className="records-container">
          <h2 className="records-title">To be attended:</h2>
          <table className="records-table">
            <thead>
              <tr>
                <th>Problem</th>
                <th>Symptoms</th>
                <th>Ideal Time</th>
                <th>Appointment</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {emptyMedicationCIDs.map((item, index) => (
                !item.data.Medications && (
                  <tr key={index}>
                    <td>{item.data.Problem}</td>
                    <td>
                      <ul>
                        {item.data.Symptoms && item.data.Symptoms.map((symptom, index) => (
                          <li key={index}>{symptom}</li>
                        ))}
                      </ul>
                    </td>
                    <td>{item.data.IdealTime}</td>
                    <td>
                      <input
                        type="text"
                        value={medicationInputs[`appointment_${index}`] || ""}
                        onChange={(e) => setMedicationInputs({
                          ...medicationInputs,
                          [`appointment_${index}`]: e.target.value,
                        })}
                        className="wallet-field"
                        placeholder="Enter appointment"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={medicationInputs[index] || ""}
                        onChange={(e) => handleInputChange(index, e)}
                        className="wallet-field"
                        placeholder="Enter medication"
                      />
                    </td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        
          {emptyMedicationCIDs.map((item, index) => (
            !item.data.Medications && (
              <div key={index} className="prescribe-medication-container"><br />
                 <button onClick={checkEvents} className="buton">Check Events</button><br /><br />
                <button onClick={() => handleButtonClick(item, index)} className="buttton">Prescribe Medication</button>
              </div>
            )
          ))}
        </div>
        )}
      </div>
      </div>
    );  
  };

  export default Doctor;
