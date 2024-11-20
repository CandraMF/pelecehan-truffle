import { useContext } from "react";
import { EthContext } from "../EthContext";

const useBlockchainLogin = () => {
    const { state } = useContext(EthContext);
    const { contract, accounts } = state;

    const login = async (nik, password) => {
        if (!contract || !accounts) throw new Error("Blockchain tidak terhubung.");
        try {
            const result = await contract.methods.login(nik, password).call({ from: accounts[0] });
            return result;
        } catch (error) {
            console.error("Error in blockchain login:", error);
            throw new Error("Gagal login melalui blockchain.");
        }
    };

    return { login };
};

export default useBlockchainLogin;
