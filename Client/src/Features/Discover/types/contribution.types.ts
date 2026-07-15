export interface HeatmapDay {
    date: string;
    level: number;
    score: number;
    xp: number;
    events: number;
    tasks: number;
    projects: number;
    reviews: number;
    features: number;
}

export interface TimelineEvent {
    icon: string;
    title: string;
    project: string;
    xp: number;
    time: string;
    type: string;
}

export interface ContributionSummary {
    currentStreak: number;
    longestStreak: number;
    totalXp: number;
    activityScore: number;
    collabScore: number;
    level: number;
    projectsCompleted: number;
}

export interface HeatmapResponse {
    success: boolean;
    data: HeatmapDay[];
}

export interface TimelineResponse {
    success: boolean;
    data: TimelineEvent[];
}

export interface SummaryResponse {
    success: boolean;
    data: ContributionSummary;
}
