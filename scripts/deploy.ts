// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { EtherscanProvider } from "@ethersproject/providers";
import { ethers, network } from "hardhat";
import config from "../config";

const currentNetwork = network.name;

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  console.log("Deploying to network:", currentNetwork);

  console.log("Deploying WBNB ...");

  const WBNB = await ethers.getContractFactory("WBNB");
  const wbnb = await WBNB.deploy();
  await wbnb.deployed();

  const PancakeFactory = await ethers.getContractFactory("PancakeFactory");
  const pancakeFactory = await PancakeFactory.deploy(config.feeToSetter);
  await pancakeFactory.deployed();

  const INIT_CODE_PAIR_HASH = await pancakeFactory.INIT_CODE_PAIR_HASH();
  console.log("INIT_CODE_PAIR_HASH: ", INIT_CODE_PAIR_HASH);

  const PancakeRouter01 = await ethers.getContractFactory("PancakeRouter01");
  const pancakeRouter01 = await PancakeRouter01.deploy(
    pancakeFactory.address,
    wbnb.address
  );

  // PancakeRouter = MainRouter
  const PancakeRouter = await ethers.getContractFactory("PancakeRouter");
  const pancakeRouter = await PancakeRouter.deploy(
    pancakeFactory.address,
    wbnb.address
  );

  console.log("WBNB is deployed to: ", wbnb.address);
  console.log("PancakeFactory is deployed to: ", pancakeFactory.address);
  console.log("PancakeRouter01 is deployed to: ", pancakeRouter01.address);
  console.log("PancakeRouter is deployed to: ", pancakeRouter.address);

  // // We get the contract to deploy
  // const Greeter = await ethers.getContractFactory("Greeter");
  // const greeter = await Greeter.deploy("Hello, Hardhat!");

  // await greeter.deployed();

  // console.log("Greeter deployed to:", greeter.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
