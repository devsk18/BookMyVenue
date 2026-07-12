import './App.css';
import { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import keycloak from './configs/keycloak';

import Layout from './layouts/Layout';
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from './layouts/guards/ProtectedRoute';
import Home from './pages/Home';
import SearchPage from './pages/SearchPage';

const queryClient = new QueryClient();

export default function App() {
  const [isInitializing, setIsInitializing] = useState(true);
  const isRun = useRef(false); 

  useEffect(() => {
    if (isRun.current) return;
    isRun.current = true;

    keycloak
      .init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
        checkLoginIframe: false,
      })
      .then((authenticated) => {
        console.log("Keycloak authenticated:", authenticated);
        setIsInitializing(false);
      })
      .catch((error) => {
        console.error("Keycloak initialization failed:", error);
        setIsInitializing(false);
      });
  }, []);

  if (isInitializing) {
    return <div className="flex h-screen items-center justify-center">Loading Application...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Routes Wrapper */}
          <Route element={<Layout />}>
            
            {/* Common Protected Routes (Both Users and Venue Owners) */}
            <Route element={<ProtectedRoute allowedRoles={['user', 'venue_owner']}/>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/settings" element={<div><h2>Profile Settings</h2></div>} />
            </Route>

            {/* Strict Route: ONLY for Standard Users */}
            <Route element={<ProtectedRoute allowedRoles={['user']} />}>
              <Route path="/saved" element={<div><h2>Saved Venues</h2></div>} />
            </Route>

            {/* Strict Route: ONLY for Venue Owners */}
            <Route element={<ProtectedRoute allowedRoles={['venue_owner']} />}>
              <Route path="/venue" element={<div><h2>Manage My Venues</h2></div>} />
            </Route>

          </Route>
          
          {/* Catch all unmatched routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}