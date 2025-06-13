import React, { Suspense, useEffect } from 'react';
import { Navigate, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { CContainer, CSpinner } from '@coreui/react';

// routes config
import routes from '../routes';
import routesClient from '../routesClient';

const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const admintoken = localStorage.getItem('admintoken');
  const clientToken = localStorage.getItem('jdAirTrans-client-token');

  useEffect(() => {
    if (!admintoken && !clientToken) {
      console.log("no token");
      navigate('/');
    } else if (admintoken && location.pathname === '/') {
      navigate('/dashboard');
    } else if (clientToken && location.pathname === '/') {
      navigate('/client/dashboards');
    }
  }, [admintoken, clientToken, location.pathname, navigate]);

  const renderAdminRoutes = () => {
    return routes.map((route, idx) => {
      return route.element && (
        <Route
          key={idx} 
          path={route.path}
          exact={route.exact}
          name={route.name}
          element={admintoken ? <route.element /> : <Navigate to="/client/dashboards" replace />}
        />
      );
    });
  };

  const renderClientRoutes = () => {
    return routesClient.map((route, idx) => {
      return route.element && (
        <Route
          key={idx}
          path={route.path}
          exact={route.exact}
          name={route.name}
          element={clientToken ? <route.element /> : <Navigate to="/dashboard" replace />}
        />
      );
    });
  };

  return (
    <CContainer>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {admintoken && renderAdminRoutes()}
          {clientToken && renderClientRoutes()}
          <Route path="/" element={<Navigate to={admintoken ? "/dashboard" : "/client/dashboards"} replace />} />
          {/* Adding a catch-all redirect for unauthorized access */}
          <Route path="*" element={<Navigate to={admintoken ? "/dashboard" : "/client/dashboards"} replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  );
};

export default React.memo(AppContent);
