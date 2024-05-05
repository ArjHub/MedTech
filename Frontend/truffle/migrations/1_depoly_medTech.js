const MedTech = artifacts.require("MedTech");


module.exports = function (deployer) {
    deployer.deploy(MedTech).then((instace) => {console.log("contract deployed");
});
    };