
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const userId = sessionStorage.getItem("userId");

  if (!userId) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;

