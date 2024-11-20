import React, { useState, useContext } from "react";
import { EthContext } from "../../contexts/EthContext";
import AppLayout from "../../layouts/AppLayout";

const Pelaporan = () => {
  const { state } = useContext(EthContext); // Access state from context
  const { contract, accounts } = state;

  const [form, setForm] = useState({
    usernameSocialMedia: "",
    email: "",
    nomorHp: "",
    nik: "",
    buktiMedia: "",
  });

  const [error, setError] = useState(""); // Track errors
  const [success, setSuccess] = useState(""); // Track success message

  // Handle form input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.usernameSocialMedia && !form.email && !form.nomorHp && !form.nik) {
      setError("Username, Email, Nomor HP, dan NIK wajib diisi salah satunya!");
      return;
    }
    setError(""); // Clear error if validation passes

    if (contract) {
      try {
        await contract.methods
          .laporKasus(
            form.usernameSocialMedia,
            form.email,
            form.nomorHp,
            form.nik,
            form.buktiMedia
          )
          .send({ from: accounts[0] });

        setSuccess("Laporan berhasil dikirim!");
        setForm({
          usernameSocialMedia: "",
          email: "",
          nomorHp: "",
          nik: "",
          buktiMedia: "",
        }); // Clear form after success
      } catch (error) {
        console.error("Error submitting report:", error);
        setError("Gagal mengirim laporan. Coba lagi.");
      }
    } else {
      setError("Kontrak tidak tersedia. Pastikan MetaMask terhubung.");
    }
  };

  return (
    <AppLayout>
      <div className="max-w-md mx-auto p-6 text-center font-sans">
        <h1 className="text-2xl font-bold mb-4">Lapor Kasus</h1>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        {success && <p className="text-green-500 mb-2">{success}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="usernameSocialMedia"
            placeholder="Username Social Media"
            value={form.usernameSocialMedia}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="nomorHp"
            placeholder="Nomor HP"
            value={form.nomorHp}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="nik"
            placeholder="NIK"
            value={form.nik}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="buktiMedia"
            placeholder="Bukti Media (opsional)"
            value={form.buktiMedia}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
          />
          <button type="submit" className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Lapor
          </button>
        </form>
      </div>
    </AppLayout>
  );
};

export default Pelaporan;