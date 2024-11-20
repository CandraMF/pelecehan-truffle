import React, { useContext, useState } from "react";
import { EthContext } from "../../contexts/EthContext";
import AppLayout from "../../layouts/AppLayout";

const Pencarian = () => {
    const { state } = useContext(EthContext);
    const { contract } = state;

    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        if (contract) {
            try {
                const laporanArray = await contract.methods
                    .cariSemuaKasus(query)
                    .call();

                // Format hasil pencarian
                const formattedResults = laporanArray.map((laporan) => ({
                    id: laporan.id,
                    status: laporan.status,
                    username: laporan.usernameSocialMedia,
                    email: laporan.email,
                    nomorHp: laporan.nomorHp,
                    nik: laporan.nik,
                }));

                setResults(formattedResults);
                setError(null);
            } catch (err) {
                console.error("Error searching for cases:", err);
                setError("Gagal mencari data. Coba lagi.");
                setResults([]);
            }
        } else {
            setError("Kontrak tidak tersedia. Pastikan MetaMask terhubung.");
        }
    };

    return (
        <AppLayout>
            <div className="flex justify-center items-center bg-gray-100">
                <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
                    <h1 className="text-2xl font-bold text-center mb-6">Cari Data Pelaku</h1>
                    <div className="mb-4">
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Masukkan Username, Email, Nomor HP, atau NIK"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handleSearch}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
                    >
                        Cari
                    </button>
                    {results.length > 0 && (
                        <div className="mt-4">
                            <h2 className="text-lg font-bold text-center mb-4">Hasil Pencarian</h2>
                            <ul className="space-y-4">
                                {results.map((result) => (
                                    <li
                                        key={result.id}
                                        className="p-4 border rounded-lg bg-gray-50 shadow-sm"
                                    >
                                        <p><strong>ID:</strong> {result.id}</p>
                                        <p><strong>Username:</strong> {result.username}</p>
                                        <p><strong>Email:</strong> {result.email}</p>
                                        <p><strong>Nomor HP:</strong> {result.nomorHp}</p>
                                        <p><strong>NIK:</strong> {result.nik}</p>
                                        <p
                                            className={`font-bold ${result.status === "0"
                                                    ? "text-yellow-500"
                                                    : result.status === "1"
                                                        ? "text-blue-500"
                                                        : result.status === "2"
                                                            ? "text-green-500"
                                                            : "text-red-500"
                                                }`}
                                        >
                                            <strong>Status:</strong>{" "}
                                            {result.status === "0"
                                                ? "Pending"
                                                : result.status === "1"
                                                    ? "Investigating"
                                                    : result.status === "2"
                                                        ? "Confirmed"
                                                        : "Not Confirmed"}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {error && (
                        <p className="mt-4 text-center text-red-500">
                            {error}
                        </p>
                    )}
                </div>
            </div>
        </AppLayout>
    );
};

export default Pencarian;
