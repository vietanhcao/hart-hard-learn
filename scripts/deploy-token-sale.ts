// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy

  // const Gold = await ethers.getContractFactory("Gold");
  // const gold = await Gold.deploy();
  // await gold.deployed();

  // console.log("Gold deployed to:", gold.address);
  const TOKEN_ADDRESS = "0x612113f42f14b636084fd5eDd444E729ea0F9a7d";
  const gold = await ethers.getContractAt("Gold", TOKEN_ADDRESS);

  const TokenSale = await ethers.getContractFactory("TokenSale");
  const tokenSale = await TokenSale.deploy(
    "0x612113f42f14b636084fd5eDd444E729ea0F9a7d"
  );
  await tokenSale.deployed();

  const transferTx = await gold.transfer(
    tokenSale.address,
    ethers.utils.parseEther("10000")
  );
  await transferTx.wait();

  console.log("tokenSale balances:", await gold.balanceOf(tokenSale.address));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
