// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

pragma experimental ABIEncoderV2;

contract MedTech {
    string public name;

    struct Patient {
        string[] medicationRecords;
    }

    mapping(address => Patient) private patients; 

    constructor() public {
        name = "medTech";
    }

    function registerMedicationRecord(string memory _cid) public {
        require(msg.sender != address(0));
        require(bytes(_cid).length > 0);
        
        patients[msg.sender].medicationRecords.push(_cid);
    }

    function getPatientMedicationRecords(address _patientAddr) public view returns (string[] memory) {
        return patients[_patientAddr].medicationRecords;
    }
}