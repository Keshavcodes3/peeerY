import mongoose, { Schema, Document } from 'mongoose';

export interface IContributionDay extends Document {
    user: mongoose.Types.ObjectId;
    date: string; // YYYY-MM-DD
    level: number; // 0-5
    score: number;
    totalXp: number;
    counts: {
        events: number;
        tasks: number;
        projects: number;
        reviews: number;
        features: number;
        others: number;
    };
}

const ContributionDaySchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: String, required: true, index: true },
    level: { type: Number, required: true, default: 0, min: 0, max: 5 },
    score: { type: Number, required: true, default: 0 },
    totalXp: { type: Number, required: true, default: 0 },
    counts: {
        events: { type: Number, default: 0 },
        tasks: { type: Number, default: 0 },
        projects: { type: Number, default: 0 },
        reviews: { type: Number, default: 0 },
        features: { type: Number, default: 0 },
        others: { type: Number, default: 0 }
    }
}, {
    timestamps: true
});

// Compound index for fast queries by user and date
ContributionDaySchema.index({ user: 1, date: 1 }, { unique: true });

export const ContributionDay = mongoose.model<IContributionDay>('ContributionDay', ContributionDaySchema);
