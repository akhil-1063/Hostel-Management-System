import { Router } from "express";
import { getUserNotifications, markAsRead } from "../controllers/notification.controller";
import { protect } from "../middlewares/auth.middleware";

const notificationRouter = Router();

// 1. Fetch all notifications for the logged-in user
notificationRouter.get("/", protect, getUserNotifications);

// 2. When they click a notification, mark it as read to hide the red dot
notificationRouter.patch("/:id/read", protect, markAsRead);

export default notificationRouter;
