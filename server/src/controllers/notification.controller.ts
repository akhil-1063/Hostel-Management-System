import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import Notification from '../models/notification.model';

// 1. Fetch all notifications for the logged-in user
export const getUserNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // Find notifications for this specific user, sort by newest first!
        const notifications = await Notification.find({ user: req.user?.id }).sort({ createdAt: -1 });
        
        res.status(200).json({ notifications });
    } catch (error) {
        console.log("Error fetching notifications:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// 2. Hide the red dot! Mark as read
export const markAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        
        const notification = await Notification.findByIdAndUpdate(
            id, 
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            res.status(404).json({ message: "Notification not found" });
            return;
        }

        res.status(200).json({ message: "Marked as read", notification });
    } catch (error) {
        console.log("Error updating notification:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
