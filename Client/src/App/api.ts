import axios from 'axios'

export const api = axios.create({
    baseURL: (import.meta.env.VITE_API_URL ?? "http://localhost:3000").replace(/\/$/, ""),
    withCredentials: true
})

// Token getter — set this once from AxiosInterceptorSetup when Clerk is ready
let _getToken: (() => Promise<string | null>) | null = null;

export const setTokenGetter = (fn: () => Promise<string | null>) => {
    _getToken = fn;
};

// Attach the Clerk JWT on every request
api.interceptors.request.use(async (config) => {
    if (_getToken) {
        const token = await _getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Reject errors as-is; Clerk manages its own token lifecycle
api.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
)



export const ENDPOINT = {
    auth: {
        sync: '/api/v1/auth/sync',
        me: "/api/v1/auth/me",
        delete: "/api/v1/auth/delete",
        disable: "/api/v1/auth/disable"
    },
    discover: {
        profiles: '/api/v1/discover/profile',
    },
    profile: {
        get: (profileId: string) => `/api/v1/profile/${profileId}`,
        update: '/api/v1/profile',
    },
    match: {
        like: (userId: string) => `/api/v1/match/like/${userId}`,
        accept: (matchId: string) => `/api/v1/match/${matchId}/accept`,
        reject: (matchId: string) => `/api/v1/match/${matchId}/reject`,
        unmatch: (matchId: string) => `/api/v1/match/${matchId}/unmatch`,
        getAll: '/api/v1/match',
        pending: '/api/v1/match/pending'
    },
    projects: {
        create: '/api/v1/project/create',
        get: (projectId: string) => `/api/v1/project/${projectId}`,
        update: (projectId: string) => `/api/v1/project/${projectId}`,
        delete: (projectId: string) => `/api/v1/project/${projectId}`,
        archive: (projectId: string) => `/api/v1/project/${projectId}/archive`,
        myProjects: '/api/v1/project/myProjects',
        memberships: '/api/v1/project/memberships',
        apply: (projectId: string) => `/api/v1/project/${projectId}/apply`,
        members: (projectId: string) => `/api/v1/project/${projectId}/members`,
        kickMember: (projectId: string, memberId: string) => `/api/v1/project/${projectId}/members/${memberId}`,
        updateMemberRole: (projectId: string, memberId: string) => `/api/v1/project/${projectId}/members/${memberId}/role`,
        leave: (projectId: string) => `/api/v1/project/${projectId}/members/leave`,
        transferOwner: (projectId: string) => `/api/v1/project/${projectId}/transfer-owner`,
        applications: (projectId: string) => `/api/v1/project/${projectId}/applications`,
    },
    applications: {
        myApplications: '/api/v1/applications/me',
        accept: (appId: string) => `/api/v1/applications/${appId}/accept`,
        reject: (appId: string) => `/api/v1/applications/${appId}/reject`,
        withdraw: (appId: string) => `/api/v1/applications/${appId}/withdraw`,
    },
    bookmarks: {
        add: (projectId: string) => `/api/v1/project/${projectId}/bookmark`,
        remove: (projectId: string) => `/api/v1/project/${projectId}/bookmark`,
        getMyBookmarks: '/api/v1/bookmarks/me',
    },
    invitations: {
        getMyInvitations: '/api/v1/invitations/me',
        accept: (invitationId: string) => `/api/v1/invitations/${invitationId}/accept`,
        reject: (invitationId: string) => `/api/v1/invitations/${invitationId}/reject`,
        send: (projectId: string) => `/api/v1/project/${projectId}/invite`,
        withdraw: (invitationId: string) => `/api/v1/invitations/${invitationId}/withdraw`,
    },
    messages: {
        history: (matchId: string) => `/api/v1/messages/${matchId}`,
    }
}