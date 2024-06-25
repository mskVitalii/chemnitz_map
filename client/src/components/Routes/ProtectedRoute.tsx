import { useUserClaimsQuery } from '@app/state/user';
import Loader from '@components/Loaders/Loader';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute() {  
  const userClaims = useUserClaimsQuery();

  if (userClaims.isLoading ) {
    return <Loader />;
  }

  return userClaims.data?.id ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
}

export default ProtectedRoute;
