var DorlinkGateway = artifacts.require("./DorlinkGateway.sol");

module.exports = function(deployer) {
    deployer.deploy(DorlinkGateway);
};
