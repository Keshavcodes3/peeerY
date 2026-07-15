import { model, Schema, Document, Types } from 'mongoose';

export interface INotification extends Document {
    recipientId: Types.ObjectId;
    title: string;
    message: string;
    type: string;
    read: boolean;
    createdAt: Date;
}

const notificationSchema = new Schema<INotification>({
    recipientId: { type: Schema.Types.ObjectId, required: true, ref: 'auth' },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, required: true },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

export const NotificationModel = model<INotification>('Notification', notificationSchema);
