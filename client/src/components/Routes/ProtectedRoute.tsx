import { useUserClaimsQuery } from "@app/state/user";
import Loader from "@components/Loaders/Loader";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const userClaims = useUserClaimsQuery();
  if (userClaims.isLoading) {
    return <Loader />;
  }
  if (userClaims.isError) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
