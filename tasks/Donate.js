const hre = require('hardhat')
const ethers = hre.ethers
const DonationArtifact = require('../artifacts/contracts/Donation.sol/Donation.json');

async function main()
{
    const [sender] = await ethers.getSigners();

    const addr = '0x345828676E02C3C680aa118E017c057b29adD7Fe';
    const Donation = new ethers.Contract(
        addr,
        DonationArtifact.abi,
        sender
    );

    const don = await Donation.GatherDonation({
        value: 10000,
    });
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});