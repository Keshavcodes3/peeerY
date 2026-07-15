/**
 * Legacy BuilderProfile shape used by swipe-deck components (BuilderCard,
 * SwipeDeck, RightPanel, MatchQueue, MatchOverlay).  This is separate from
 * DiscoverProfile (the server-side shape) so each component can type-check
 * against the fields it actually uses.
 */
export interface BuilderProfile {
    id: string;
    authId?: string;
    name: string;
    role?: string;
    location?: string;
    availability?: string;
    bio?: string;
    avatarUrl?: string;
    bannerGradient?: string;
    matchPercentage: number;
    stack?: string[];
    tags?: string[];
    building?: string;
    lookingFor?: string;
    openRoles?: string[];
    followers?: number;
}
