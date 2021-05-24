// @dev For testing purposes only!
const hre = require("hardhat");

deployTokenContractAndMintTokens()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

async function deployTokenContractAndMintTokens() {
    // Get and deploy contract
    const tokenFactorey = await hre.ethers.getContractFactory("Token");
    let tokenContract = await tokenFactorey.deploy();
    await logContractDetails(tokenContract)
    await tokenContract.deployed();

    // Mint tokens - for test purposes
    for (const address of addressArray) {
        await tokenContract.mint(address, "10000000000000000000000")
        const totalSupply = await tokenContract.totalSupply()
        console.log("Total supply is now: " + totalSupply.toString() / 100000000000000000)
        console.log("100000 TOKEN tokens for: " + address)
    }
}

async function logContractDetails(contract) {
    const name = await contract.name();
    const symbol = await contract.symbol();
    const decimals = await contract.decimals();

    console.log("")
    console.log("+--------------------------------------------------------------------------------------------+")
    console.log("   Token name:        " + name);
    console.log("   Token symbol:      " + symbol);
    console.log("   Token address:     " + contract.address)
    console.log("   Token decimals:    " + decimals);
    console.log("   Creation hash:     " + contract.deployTransaction.hash)
    console.log("+--------------------------------------------------------------------------------------------+")
    console.log("")
}

// The addresses you want your token to be minted to.
const addressArray = [
    '[ADDRESS_1]',
    '[ADDRESS_2]',
    '[ETC...]'
];