import Web3 from "web3";

let web3;
if (typeof web3 !== "undefined") {
    web3 = new Web3(web3.currentProvider);
} else {
    web3 = new Web3(
        new Web3.providers.HttpProvider("http://localhost:8545")
    );
}

function getCurrentProvider() {
    return web3.currentProvider;
}

const myWeb3 = web3;
export default myWeb3;