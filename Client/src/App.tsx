import { useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth as useClerkAuth, AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import { Analytics } from '@vercel/analytics/react';
import LandingPage from "./Features/landing/LandingPage";
import Register from "./Features/Auth/Pages/Register";
import Login from "./Features/Auth/Pages/Login";
import DiscoverPage from "./Features/Discover/Pages/DiscoverPage";
import BuilderProfilePage from "./Features/Discover/Pages/BuilderProfilePage";
import Dashboard from "./Features/Dashboard/Pages/Dashboard";
import ProjectsPage from "./Features/Projects/Pages/ProjectsPage";
import MyApplicationsPage from "./Features/Projects/Pages/MyApplicationsPage";
import NetworkPage from "./Features/Network/Pages/NetworkPage";
import MessagesPage from "./Features/Messages/Pages/MessagesPage";
import BookmarksPage from "./Features/Bookmarks/Pages/BookmarksPage";
import ProjectWorkspace from "./Features/Projects/Pages/ProjectWorkspace";
import ProfileSettingsPage from "./Features/Auth/Pages/ProfileSettingsPage";
import ProtectedRoute from "./Features/Auth/Components/ProtectedRoute";
import AppLayout from "./App/AppLayout";
import { useAuth } from "./Features/Auth/Hooks/useAuth";
import { AxiosInterceptorSetup } from "./App/AxiosInterceptorSetup";

function App() {
  const { initializeAuth } = useAuth();
  const { isLoaded, isSignedIn } = useClerkAuth();
  const hasInitializedAuth = useRef(false);

  // Initialize auth only once when Clerk is loaded and we haven't initialized yet
  useEffect(() => {
    if (isLoaded && !hasInitializedAuth.current) {
      initializeAuth();
      hasInitializedAuth.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  // Don't render anything until Clerk is loaded to prevent flickering
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <Analytics />
      {/* Injects the Clerk JWT into all axios requests */}
      <AxiosInterceptorSetup />

      <Routes>
        {/* Public */}
        <Route path="/" element={isSignedIn ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
        <Route path="/register" element={isSignedIn ? <Navigate to="/dashboard" replace /> : <Register />} />
        <Route path="/login" element={isSignedIn ? <Navigate to="/dashboard" replace /> : <Login />} />

        {/* Clerk SSO OAuth callback routes */}
        <Route path="/login/sso-callback" element={<AuthenticateWithRedirectCallback />} />
        <Route path="/register/sso-callback" element={<AuthenticateWithRedirectCallback />} />

        {/* Protected — all inside AppLayout (sidebar) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/discover/:id" element={<BuilderProfilePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/my-applications" element={<MyApplicationsPage />} />
            <Route path="/project/:projectId/workspace" element={<ProjectWorkspace />} />
            <Route path="/profile" element={<ProfileSettingsPage />} />
            <Route path="/network" element={<NetworkPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/bookmarks" element={<BookmarksPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
