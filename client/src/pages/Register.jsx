import React, { useState, useContext } from "react";
import { EthContext } from "../contexts/EthContext";

const Register = () => {
    const { state } = useContext(EthContext);
    const { contract, accounts } = state;

    const [nik, setNik] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        try {
            // Panggil fungsi register di kontrak dengan NIK dan password
            await contract.methods.register(nik, password).send({ from: accounts[0] });
            setSuccessMessage("Akun berhasil dibuat!");
            setNik("");
            setPassword("");
        } catch (error) {
            console.error("Error creating account:", error);
            setErrorMessage("Gagal membuat akun. Silakan coba lagi.");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Registrasi Pengguna</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700">NIK:</label>
                    <input
                        type="text"
                        value={nik}
                        onChange={(e) => setNik(e.target.value)}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Kata Sandi:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-600 transition duration-200"
                >
                    Daftar
                </button>
            </form>
            {errorMessage && <p className="mt-4 text-red-500">{errorMessage}</p>}
            {successMessage && <p className="mt-4 text-green-500">{successMessage}</p>}
        </div>
    );
};

export default Register;