const hre = require('hardhat')
const ethers = hre.ethers

async function main()
{
    const [owner] = await ethers.getSigners()

    const Donation = await ethers.getContractFactory('Donation', owner)
    const donation = await Donation.deploy()
    await donation.deployed()
    console.log(donation.address)
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});