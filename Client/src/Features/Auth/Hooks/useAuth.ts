import { useDispatch, useSelector } from 'react-redux';
import { useAuth as useClerkAuth, useUser as useClerkUser, useClerk } from '@clerk/clerk-react';
import type { RootState } from '../../../store';
import { setLoading, setCredentials, logout as logoutAction, setInitialized } from '../Redux/auth.slice';
import authService from '../services/auth.service';
import { useRef } from 'react';

export const useAuth = () => {
    const dispatch = useDispatch();
    const { user, isAuthenticated, isLoading, error, isInitialized } = useSelector(
        (state: RootState) => state.auth
    );
    
    const { isLoaded, isSignedIn } = useClerkAuth();
    const { user: clerkUser } = useClerkUser();
    const { signOut } = useClerk();
    
    // We use a ref to prevent infinite sync loops if getMe keeps failing
    const hasAttemptedSync = useRef(false);

    const logoutUser = async () => {
        try {
            dispatch(setLoading(true));
            await signOut();
        } catch (err) {
            console.error('Logout error', err);
        } finally {
            dispatch(logoutAction());
            dispatch(setLoading(false));
        }
    };

    const initializeAuth = async () => {
        if (!isLoaded) return;

        if (!isSignedIn || !clerkUser) {
            dispatch(setInitialized(true));
            if (isAuthenticated) {
                dispatch(logoutAction());
            }
            return;
        }

        // Avoid repeated sync attempts in a single session if it failed
        if (hasAttemptedSync.current) return;
        hasAttemptedSync.current = true;

        try {
            dispatch(setLoading(true));
            
            // Try fetching the local user
            let response = await authService.getMe().catch(() => null);
            
            // If local user doesn't exist, they need to be synced
            if (!response?.success) {
                const email = clerkUser.primaryEmailAddress?.emailAddress || '';

             // Build a guaranteed-unique username: prefer clerk username, then firstName,
                 // then fall back to the last 8 chars of the clerkId (always unique)
                 const clerkSuffix = clerkUser.id.slice(-8);
                 const username = clerkUser.username
                     || (clerkUser.firstName ? clerkUser.firstName.toLowerCase().replace(/\s+/g, '') : null)
                     || `user${clerkSuffix}`;

                const avatar = clerkUser.imageUrl || '';

                // Clerk returns 'oauth_google', 'oauth_github', etc. — normalize to backend values
                const rawProvider = clerkUser.externalAccounts[0]?.provider || '';
                const stripped = rawProvider.replace('oauth_', '');
                const normalizedProvider: 'local' | 'github' | 'google' =
                    stripped === 'google' ? 'google'
                    : stripped === 'github' ? 'github'
                    : 'local';

                await authService.syncAccount({ email, username, avatar, provider: normalizedProvider });
                response = await authService.getMe();
            }

            if (response?.success) {
                dispatch(setCredentials({ user: response.user }));
            } else {
                dispatch(logoutAction());
                await signOut().catch(() => {});
            }
        } catch (err) {
            console.error("Auth init error:", err);
            dispatch(logoutAction());
            await signOut().catch(() => {});
        } finally {
            dispatch(setInitialized(true));
            dispatch(setLoading(false));
        }
    };

    return {
        user,
        isAuthenticated,
        isLoading,
        error,
        isInitialized,
        isLoaded,
        isSignedIn,
        logout: logoutUser,
        initializeAuth,
    };
};
