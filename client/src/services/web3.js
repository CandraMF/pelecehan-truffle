import Web3 from "web3";
import PelaporanContract from "../contracts/Pelaporan.json";

let web3;
let pelaporanInstance;

const initWeb3 = async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
    } else {
        console.log("Non-Ethereum browser detected. Please install MetaMask!");
    }
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = PelaporanContract.networks[networkId];
    pelaporanInstance = new web3.eth.Contract(
        PelaporanContract.abi,
        deployedNetwork && deployedNetwork.address
    );
};

export { initWeb3, pelaporanInstance, web3 };
