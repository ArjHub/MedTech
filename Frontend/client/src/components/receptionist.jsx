import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from "react-router-dom";
import Web3 from 'web3';
import medTechABI from '../abis/medTechABI.json';
import "../Styles/receptionist.css";
import logoo from '../Images/logo1.png';

const web3 = new Web3(window.ethereum);
const medTechAddress = "0x2A3BD9A67351B37e6Cc90D8ec742b240f375e87C";
const medTechContract = new web3.eth.Contract(medTechABI, medTechAddress);


function InputForm() {
    const [inputText, setInputText] = useState('');
    const [outputData, setOutputData] = useState([]);

    const location = useLocation();
    const loginAddress = location.state ? location.state.walletAddress : ".";
    const navigate = useNavigate();
    console.log(loginAddress);
    useEffect(() => {
        if(loginAddress === "."){
          navigate('/signup');
        }
      }, [loginAddress, navigate]);

    const handleInputChange = (event) => {
        setInputText(event.target.value);
    };

    const registerMedicationRecord = async (cid) => {
        try {
            console.log("Hlo");
            const accounts = loginAddress;
            console.log(accounts);
            await medTechContract.methods.registerMedicationRecord(cid).send({ from: accounts });
        } catch (error) {
            console.log(error);
        }
    };

    const storeDataInPinata = async (data) => {
        try {
            const transformedData = {
                ... data,
                Symptoms: data.Sign_symptom || [],
                Problem: data.Detailed_description || [],
                Medication: ""
            };

            delete transformedData.Sign_symptom;
            delete transformedData.Detailed_description;

            console.log("Data to be sent to Pinata:", transformedData);
            const response = await axios.post(
                "https://api.pinata.cloud/pinning/pinJSONToIPFS",
                transformedData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        pinata_api_key: "38690e4d17a7e4820ed6",
                        pinata_secret_api_key: "d3199a0a493b914fd974ffa0ba7bb38fbbffc4acd83b6cbc927e42dc8c7cb7ad",
                    },
                }
            );
            const cid = response.data.IpfsHash;
            console.log("CID", cid);
            if (cid) {
                await registerMedicationRecord(cid);
                console.log("Data stored in Pinata and registered in the blockchain.");
            } else {
                console.error("Empty CID returned from Pinata.");
            }
        } catch (error) {
            console.error("Error storing data in Pinata:", error);
        }
    };    

    const handleButtonClick = async () => {
        try {
            const response = await axios.get('http://localhost:5000/receptionist', {
                params: {
                    text: inputText
                }
            });
            setOutputData(response.data.predictions);
            
            const data = {};
            response.data.predictions.forEach(prediction => {
                if (!data[prediction.tag]) {
                    data[prediction.tag] = [];
                }
                data[prediction.tag].push(prediction.entity);
            });

            // Store the data in Pinata
            storeDataInPinata(data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="rece-cont">
            <header className="header">
        <img src={logoo} alt="Logo" className="logoo" onClick={() => navigate("/")}/>
        </header>
        <div className="receptionist-container">
            <h3 className='h3-text'>Conversation box</h3>
        <textarea
            className="receptionist-textarea"
            rows={10}
            cols={50}
            value={inputText}
            onChange={handleInputChange}
        />
        <br /><br />
        <button className="receptionist-button" onClick={handleButtonClick}>Process</button>
        </div>
        </div>
    );
}

export default InputForm;
