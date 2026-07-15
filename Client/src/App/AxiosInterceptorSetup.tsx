import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { setTokenGetter } from './api';

export const AxiosInterceptorSetup = () => {
    const { getToken } = useAuth();

    useEffect(() => {
        // Wire Clerk's getToken into the axios interceptor
        setTokenGetter(getToken);
    }, [getToken]);

    return null;
};
