import { useUserClaimsQuery } from "@app/state/user";
import Loader from "@components/Loaders/Loader";
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const userClaims = useUserClaimsQuery();
  useEffect(() => {
    userClaims.refetch();
  }, []);

  if (userClaims.isLoading || userClaims.isRefetching) {
    return <Loader />;
  }

  return userClaims.data?.id ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
