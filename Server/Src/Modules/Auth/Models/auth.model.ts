import mongoose, { Schema, model, type Document } from 'mongoose'

import type { AuthRegister } from "../../../Types/Auth.Types.ts"

export interface IRegister extends AuthRegister, Document {
  clerkId?: string;
  createdAt: Date,
  updatedAt: Date,
  isDisabled: boolean
}

const authSchema = new Schema<IRegister>({
  clerkId: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  password: {
    type: String,
    required: false,
    select: false,
    minLen: 8,
    maxLen: 30
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  provider: {
    type: String,
    enum: ['local', 'google', 'github'],
    default: 'local'
  },
  isDisabled: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  versionKey: false
})

const authModel = model("user", authSchema);
model("User", authSchema);

export default authModel;
