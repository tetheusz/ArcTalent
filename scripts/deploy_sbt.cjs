const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying ArcTalentsSBT with account:", deployer.address);

  const ArcTalentsSBT = await ethers.getContractFactory("ArcTalentsSBT");
  const sbt = await ArcTalentsSBT.deploy();

  await sbt.waitForDeployment();

  const address = await sbt.getAddress();
  console.log("ArcTalentsSBT deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
