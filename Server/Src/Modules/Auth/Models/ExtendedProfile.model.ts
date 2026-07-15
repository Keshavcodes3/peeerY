import mongoose, { Schema, model, type Document } from "mongoose";

export interface IContributionDay {
  date: string; // YYYY-MM-DD
  count: number;
}

export interface IExperience {
  role: string;
  company: string;
  duration: string;
  description: string;
}

export interface IProfile extends Document {
  authId: mongoose.Schema.Types.ObjectId;
  name: string;
  username: string;
  headline?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  followersCount: number;
  totalContributions: number;
  rank: 'A' | 'B' | 'C' | 'F';
  experience: IExperience[];
  projects: mongoose.Schema.Types.ObjectId[];
  githubWebhookSecret: string;
  contributionHistory: IContributionDay[];
  createdAt: Date;
  updatedAt: Date;
}

const profileSchema = new Schema<IProfile>({
  authId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true, index: true },
  headline: { type: String },
  avatarUrl: { type: String },
  bannerUrl: { type: String },
  followersCount: { type: Number, default: 0 },
  totalContributions: { type: Number, default: 0 },
  rank: { type: String, enum: ['A', 'B', 'C', 'F'], default: 'F' },
  experience: [{
    role: String,
    company: String,
    duration: String,
    description: String
  }],
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
  githubWebhookSecret: { type: String, required: true },
  contributionHistory: [{
    date: { type: String, required: true }, // YYYY-MM-DD
    count: { type: Number, default: 0 }
  }]
}, { timestamps: true });

// Ensure unique date index for contribution history
profileSchema.index({ "contributionHistory.date": 1 });

export default model<IProfile>("Profile", profileSchema);
