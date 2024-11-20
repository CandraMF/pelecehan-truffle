import React, { useEffect, useState, useContext } from "react";
import { EthContext } from "../../contexts/EthContext";
import AppLayout from "../../layouts/AppLayout";

const Validasi = () => {
    const { state } = useContext(EthContext);
    const { contract, accounts } = state;

    const [reports, setReports] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchReports = async () => {
        if (contract) {
            try {
                setError("");
                setLoading(true); // Start loading
                const reportCount = await contract.methods.jumlahLaporan().call();
                const fetchedReports = [];

                for (let i = 0; i < reportCount; i++) {
                    const report = await contract.methods.laporanKasus(i).call();
                    fetchedReports.push({ id: i, ...report });
                }

                setReports(fetchedReports);
            } catch (err) {
                console.error("Error fetching reports:", err);
                setError("Gagal memuat laporan.");
            } finally {
                setLoading(false); // Stop loading
            }
        } else {
            setError("Kontrak belum tersedia. Pastikan MetaMask terhubung.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, [contract]);

    const handleValidate = async (id) => {
        try {
            setError("");
            await contract.methods.updateStatus(id, 2).send({ from: accounts[0] }); // 2 untuk status 'Confirmed'
            fetchReports();
        } catch (err) {
            console.error("Error validating report:", err);
            setError("Gagal memvalidasi laporan.");
        }
    };

    const handleInvalidate = async (id) => {
        try {
            setError("");
            await contract.methods.updateStatus(id, 3).send({ from: accounts[0] }); // 3 untuk status 'NotConfirmed'
            fetchReports();
        } catch (err) {
            console.error("Error invalidating report:", err);
            setError("Gagal membatalkan validasi laporan.");
        }
    };

    if (loading) {
        return <p className="text-center text-gray-500">Memuat laporan...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }



    return (
        <AppLayout>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold text-center mb-6">Validasi Kasus</h1>
                <div className="overflow-x-auto">
                    {reports.length === 0 ? (
                        <p className="text-center text-gray-500">Belum ada laporan.</p>
                    ) : (
                        <table className="table-auto w-full border-collapse border border-gray-200 shadow-lg">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-200 px-4 py-2 text-left">#</th>
                                    <th className="border border-gray-200 px-4 py-2 text-left">NIK</th>
                                    <th className="border border-gray-200 px-4 py-2 text-left">Username Sosial Media</th>
                                    <th className="border border-gray-200 px-4 py-2 text-left">Nomor HP</th>
                                    <th className="border border-gray-200 px-4 py-2 text-left">Email</th>
                                    <th className="border border-gray-200 px-4 py-2 text-left">Deskripsi</th>
                                    <th className="border border-gray-200 px-4 py-2 text-left">Status</th>
                                    <th className="border border-gray-200 px-4 py-2 text-left">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reports.map((report, index) => (
                                    <tr
                                        key={index}
                                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                                    >
                                        <td className="border border-gray-200 px-4 py-2">{index + 1}</td>
                                        <td className="border border-gray-200 px-4 py-2">{report.nik}</td>
                                        <td className="border border-gray-200 px-4 py-2">{report.usernameSocialMedia}</td>
                                        <td className="border border-gray-200 px-4 py-2">{report.nomorHp}</td>
                                        <td className="border border-gray-200 px-4 py-2">{report.email}</td>
                                        <td className="border border-gray-200 px-4 py-2">{report.deskripsi}</td>
                                        <td className={`border border-gray-200 px-4 py-2 ${report.status === "0" ? "text-yellow-500" : report.status === "1" ? "text-blue-500" : report.status === "2" ? "text-green-500" : "text-red-500"}`}>
                                            {report.status === "0" ? "Pending" : report.status === "1" ? "Investigating" : report.status === "2" ? "Confirmed" : "Not Confirmed"}
                                        </td>
                                        <td className="border border-gray-200 px-4 py-2">
                                            {report.status === "2" ? (
                                                <button
                                                    className="bg-red-500 text-white px-4 py-2 rounded"
                                                    onClick={() => handleInvalidate(report.id)}
                                                >
                                                    Batalkan Konfirmasi
                                                </button>
                                            ) : (
                                                <button
                                                    className="bg-green-500 text-white px-4 py-2 rounded"
                                                    onClick={() => handleValidate(report.id)}
                                                >
                                                    Konfirmasi
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </AppLayout >
    );
};

export default Validasi;