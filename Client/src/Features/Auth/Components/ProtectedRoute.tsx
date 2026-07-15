import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";
import { useAuth as useClerkAuth } from "@clerk/clerk-react";

/**
 * Route guard. Waits for both Clerk to load AND the local sync to finish,
 * then either renders the nested routes or redirects to /login.
 */
const ProtectedRoute = () => {
    const { isAuthenticated, isInitialized } = useSelector((state: RootState) => state.auth);
    const { isLoaded, isSignedIn } = useClerkAuth();
    const location = useLocation();

    // Wait for Clerk to initialise AND for our local sync to complete
    if (!isLoaded || !isInitialized) {
        return (
            <div className="grid min-h-screen place-items-center bg-zinc-950 text-zinc-400">
                <div className="flex items-center gap-3">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-600 border-t-blue-500" />
                    Loading…
                </div>
            </div>
        );
    }

    // Not signed in to Clerk OR not synced locally → go to login
    if (!isSignedIn || !isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
