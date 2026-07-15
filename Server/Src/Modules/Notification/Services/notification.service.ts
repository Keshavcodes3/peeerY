import { NotificationModel } from '../Models/notification.model.js';
import { sendNotificationToUser } from '../../../Sockets/Handlers/notification.handler.js';

export const createNotification = async (recipientId: string, title: string, message: string, type: string) => {
    try {
        const notification = await NotificationModel.create({
            recipientId,
            title,
            message,
            type,
        });

        // Send over socket if connected
        sendNotificationToUser(recipientId, 'notification:received', {
            id: notification._id.toString(),
            title: notification.title,
            message: notification.message,
            type: notification.type
        });

        return notification;
    } catch (error) {
        console.error("Failed to create/send notification", error);
    }
};
