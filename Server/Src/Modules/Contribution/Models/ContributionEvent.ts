import mongoose, { Schema, Document } from 'mongoose';

export enum ContributionType {
    TASK_COMPLETED = 'TASK_COMPLETED',
    PROJECT_CREATED = 'PROJECT_CREATED',
    PROJECT_COMPLETED = 'PROJECT_COMPLETED',
    FEATURE_DELIVERED = 'FEATURE_DELIVERED',
    PR_MERGED = 'PR_MERGED',
    REVIEW_GIVEN = 'REVIEW_GIVEN',
    ISSUE_CLOSED = 'ISSUE_CLOSED',
    MILESTONE_COMPLETED = 'MILESTONE_COMPLETED',
    INVITATION_ACCEPTED = 'INVITATION_ACCEPTED',
    TEAM_JOINED = 'TEAM_JOINED',
    ROADMAP_COMPLETED = 'ROADMAP_COMPLETED',
    MENTOR_SESSION = 'MENTOR_SESSION',
    SKILL_VERIFIED = 'SKILL_VERIFIED'
}

export interface IContributionEvent extends Document {
    user: mongoose.Types.ObjectId;
    type: ContributionType;
    project?: mongoose.Types.ObjectId;
    title: string;
    xp: number;
    timestamp: Date;
}

const ContributionEventSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: Object.values(ContributionType), required: true },
    project: { type: Schema.Types.ObjectId, ref: 'Project' },
    title: { type: String, required: true },
    xp: { type: Number, required: true, default: 0 },
    timestamp: { type: Date, default: Date.now, index: true }
}, {
    timestamps: true
});

export const ContributionEvent = mongoose.model<IContributionEvent>('ContributionEvent', ContributionEventSchema);
