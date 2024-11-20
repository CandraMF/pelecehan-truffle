import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { EthContext } from "../contexts/EthContext";

const ProtectedRoute = ({ children }) => {
  const { state } = useContext(EthContext);
  const { accounts, contracts, isAuthenticated } = state;

  if (!accounts || accounts.length === 0) {
    return <Navigate to="/login" replace />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
