const axios = require("axios");

// Storing JSON data
const jsonData = {
  Name: "Arjun",
  Age: 21,
  College: "IIT Bombay",
  Branch: "Computer Science",
  Year: 4,
  CGPA: 8.25,
  Projects: [
    {
      Name: "Project 1",
      Description: "Description 1",
      Link: "Link 1",
    },
  ],
  Friend: {
    Name: "Rahul",
    Age: 21,
    College: "IIT Bombay",
    Branch: "Computer Science",
    Year: 4,
    CGPA: 8.25,
    Projects: [
      {
        Name: "Project 1",
        Description: "Description 1",
        Link: "Link 1",
      },
    ]
  },
};

//String the data on IPFS
const storeData = (data) => {
  axios
    .post("https://api.pinata.cloud/pinning/pinJSONToIPFS", data, {
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: "38690e4d17a7e4820ed6",
        pinata_secret_api_key:
          "d3199a0a493b914fd974ffa0ba7bb38fbbffc4acd83b6cbc927e42dc8c7cb7ad",
      },
    })
    .then(function (response) {
      console.log(response.data.IpfsHash);
    })
    .catch(function (error) {
      console.log(error);
    });
};

//storeData(jsonData);


//Retrieving the data from IPFS
const retrieveData = (cid) => {
  axios
    .get(`https://gateway.pinata.cloud/ipfs/${cid}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
};

const cid = "QmPWuuBAPjMUnp5nC8VWSytCJgibVim8X1qf5YxTi3Mho6";
retrieveData(cid);