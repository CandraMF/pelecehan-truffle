
import { Route, Routes } from "react-router-dom";
import { EthProvider } from "./contexts/EthContext";
import Pelaporan from "./pages/Pelapor/Pelaporan";
import Pencarian from "./pages/Home/Pencarian";
import Validasi from "./pages/Admin/Validasi";
import Register from "./pages/Register";
import Login from "./pages/Login";

function App() {
  return (
    <EthProvider>
      <Routes>
        <Route path="/" element={<Pelaporan />} />
        <Route path="/validasi" element={<Validasi />} />
        <Route path="/pelaporan" element={<Pelaporan />} />
        <Route path="/pencarian" element={<Pencarian />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </EthProvider>
  );
}


export default App;
