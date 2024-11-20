const Pelaporan = artifacts.require("Pelaporan");

module.exports = function (deployer) {
  deployer.deploy(Pelaporan);
};
