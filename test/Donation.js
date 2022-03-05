
const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("Donation", function () {

  let Token;
  let hardhatToken;
  let owner;
  let addr1;
  let addr2;


  beforeEach(async function () {
    Token = await ethers.getContractFactory("Donation");
    [owner, addr1, addr2] = await ethers.getSigners();

    hardhatToken = await Token.deploy();
    await hardhatToken.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await hardhatToken.owner()).to.equal(owner.address);
    });
  });

  describe("Transactions", function () {
    it("Gather donations", async function () {

      const t1 = await hardhatToken.connect(addr1).GatherDonation({
        value: 100,
      });

      await  expect (() => t1).to.changeEtherBalances([addr1, hardhatToken], [-100, 100])

      const t2 = await hardhatToken.connect(addr1).GatherDonation({
        value: 100,
      });

      await  expect (() => t2).to.changeEtherBalances([addr1, hardhatToken], [-100, 100])

      const t3 = await hardhatToken.connect(addr2).GatherDonation({
        value: 100,
      });

      await  expect (() => t3).to.changeEtherBalances([addr2, hardhatToken], [-100, 100])

    });

    it("Should fail donation with 0 eth", async function () {
      
      await expect(
        hardhatToken.connect(addr1).GatherDonation({
        value: 0,
      })
      ).to.be.revertedWith('You are trying send 0 eth');

    });

    it("Addr1 should fail transfer ether to addr2", async function () {
      const provider = waffle.provider;
      const InitialAddr2Balance = await provider.getBalance(addr2.address);

      await expect(
        hardhatToken.connect(addr1).TransferTo(addr2.address, 100)
      ).to.be.revertedWith('You are not owner');

      expect(
        await provider.getBalance(addr2.address)
      ).to.equal(InitialAddr2Balance);

    });

    it("Owner should transfer ether to addr2", async function () {
      const provider = waffle.provider;

      await hardhatToken.connect(addr2).GatherDonation({
        value: 100,
      });

      const t1 = await hardhatToken.TransferTo(addr2.address, 100);

      await  expect (() => t1).to.changeEtherBalance(addr2, +100);

      await t1.wait();

      expect( await provider.getBalance(hardhatToken.address)).to.equal(0);

    });

    it("Should get donators and sum of donations of addr1", async function () {
      const provider = waffle.provider;

      await hardhatToken.connect(addr1).GatherDonation({
        value: 100,
      });

      await hardhatToken.connect(addr1).GatherDonation({
        value: 100,
      });

      await hardhatToken.connect(addr2).GatherDonation({
        value: 100,
      });

      expect(
        await hardhatToken.connect(addr1).GetDonators()
      );

      expect(
        await hardhatToken.connect(addr1).GetSum(addr1.address)
      );

    });

  });
});