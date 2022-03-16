const Tether = artifacts.require('Tether');


module.exports = async function(_deployer) {
  // Use deployer to state migration tasks.
  await _deployer.deploy(Tether);
};
