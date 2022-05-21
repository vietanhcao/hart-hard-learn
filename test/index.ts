import { expect } from "chai";
import { ethers } from "hardhat";

describe("Hello World", async function () {
  const message = "Hello, world!";
  it("Should return message correctly", async function () {
    const HelloWorld = await ethers.getContractFactory("HelloWorld");
    const helloWorld = await HelloWorld.deploy(message); // go to constructor contract
    await helloWorld.deployed();
    expect(await helloWorld.printHelloWorld()).to.be.equal(message);
    await helloWorld.updateMessage("vietanh");
    expect(await helloWorld.printHelloWorld()).to.be.equal("vietanh");
  });
});
