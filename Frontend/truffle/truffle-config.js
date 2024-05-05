module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 7545,
      network_id: "*",
    },
  },
  solc:{
    optimizer: {
      enabled: true,
      runs: 200
    },   
  },
};