// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract MedTech {
    string public name;
    mapping(address => string) public patientIPNSAddresses; // Store IPNS addresses instead of CIDs

    constructor() public {
        name = "medTech";
    }

    function registerPatientIPNS(string memory _ipnsAddress) public {
        require(msg.sender != address(0));
        require(bytes(_ipnsAddress).length > 0);
        address _addr = msg.sender;

        patientIPNSAddresses[_addr] = _ipnsAddress;
    }

    function getPatientIPNS(address _patientAddr) public view returns (string memory) {
        return patientIPNSAddresses[_patientAddr];
    }
}
