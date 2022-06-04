import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
// eslint-disable-next-line node/no-missing-import
import { Gold } from "../typechain";

describe("GOLD", function () {
  let [accountA, accountB, accountC]: SignerWithAddress[] = [];
  let token: Gold;
  const amount = ethers.utils.parseUnits("100", "ether");
  // const address0 = "0x0000000000000000000000000000000000000000";
  const totalSupply = ethers.utils.parseUnits("1000000", "ether");

  beforeEach(async function () {
    [accountA, accountB, accountC] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("Gold");
    token = await Token.deploy();
    await token.deployed();
  });

  describe("common", function () {
    it("totalSupply should be return right value", async function () {
      expect(await token.totalSupply()).to.be.equal(totalSupply);
    });

    it("balance of account A should return right value", async function () {
      expect(await token.balanceOf(accountA.address)).to.be.equal(totalSupply);
    });

    it("balance of account B should return right value", async function () {
      expect(await token.balanceOf(accountB.address)).to.be.equal(0);
    });

    it("allowance of account A to account B should return right value", async function () {
      expect(
        await token.allowance(accountA.address, accountB.address)
      ).to.be.equal(0);
    });
  });

  describe("pause()", function () {
    it("should revert if not pauser role", async function () {
      await expect(token.connect(accountB).pause()).to.be.reverted; // PAUSER_ROLE declared in where
    });
    it("should revert if contract has been paused", async function () {
      await token.pause();
      await expect(token.pause()).to.be.revertedWith("Pausable: paused"); // ??
    });

    it("should pause contract correctly", async function () {
      const pauseTx = await token.pause();
      await expect(pauseTx).to.emit(token, "Paused").withArgs(accountA.address);
      await expect(token.transfer(accountB.address, amount)).to.be.revertedWith(
        "Pausable: paused"
      );
    });
  });

  describe("unpause()", function () {
    beforeEach(async () => {
      await token.pause();
    });

    it("should revert if not pauser role", async function () {
      await expect(token.connect(accountB).unpause()).to.be.reverted; // PAUSER_ROLE declared in where
    });
    it("should revert if contract has been unpaused", async function () {
      await token.unpause();
      await expect(token.unpause()).to.be.revertedWith("Pausable: not paused"); // ??
    });

    it("should pause contract correctly", async function () {
      const unpauseTx = await token.unpause();
      await expect(unpauseTx)
        .to.emit(token, "Unpaused")
        .withArgs(accountA.address);
      const transferTx = await token.transfer(accountB.address, amount);
      await expect(transferTx) // ??
        .to.emit(token, "Transfer")
        .withArgs(accountA.address, accountB.address, amount);
    });
  });

  describe("addToBlacklist()", function () {
    it("should revert in case add sender to blacklist", async function () {
      await expect(token.addToBlacklist(accountA.address)).to.be.revertedWith(
        "Gold: must not add sender to blacklist"
      );
    });
    it("should revert if account has been added to blacklist", async function () {
      await token.addToBlacklist(accountB.address);
      await expect(token.addToBlacklist(accountB.address)).to.be.revertedWith(
        "Gold: account already in blacklist"
      );
    });
    it("should revert if account not admin role", async function () {
      await expect(
        token.connect(accountB.address).addToBlacklist(accountC.address)
      ).to.be.reverted;
    });
    it("should add To BlackList correctly", async function () {
      token.transfer(accountB.address, amount);
      token.transfer(accountC.address, amount);
      await token.addToBlacklist(accountB.address);
      await expect(
        token.connect(accountB.address).transfer(accountC.address, amount)
      ).to.be.reverted;
      await expect(
        token.connect(accountC.address).transfer(accountB.address, amount)
      ).to.be.reverted;
      // todo test and deploy
      const transferTx = await token.addToBlacklist(accountC.address);

      await expect(transferTx)
        .to.emit(token, "BlacklistAdded")
        .withArgs(accountC.address);
    });
  });

  describe("removeFromBlacklist()", function () {
    beforeEach(async () => {
      token.transfer(accountB.address, amount);
      token.transfer(accountC.address, amount);
      await token.addToBlacklist(accountB.address);
    });

    it("should revert if account has not been added to blacklist", async function () {
      await token.removeFromBlacklist(accountB.address);
      await expect(
        token.removeFromBlacklist(accountB.address)
      ).to.be.revertedWith("Gold: account wasn't in blacklist");
    });

    it("should revert if account not admin role", async function () {
      await expect(
        token.connect(accountB.address).removeFromBlacklist(accountC.address)
      ).to.be.reverted;
    });

    it("should remove From BlackList correctly", async function () {
      const removeTx = await token.removeFromBlacklist(accountB.address);
      await expect(token.transfer(accountB.address, amount))
        .to.emit(token, "Transfer")
        .withArgs(accountA.address, accountB.address, amount);
      await expect(removeTx)
        .to.emit(token, "BlacklistRemoved")
        .withArgs(accountB.address);
    });
  });
});
