import { Router } from "express";
import { getOccupancyStats, getFinancialStats, getRecentActivity } from "../controllers/dashboard.controller";
import { protect, adminOnly } from "../middlewares/auth.middleware";

const dashboardRouter = Router();

// 1. Get Occupancy Rates
dashboardRouter.get("/occupancy", protect, adminOnly, getOccupancyStats);

// 2. Get Financial Stats (Revenue vs Expenses)
dashboardRouter.get("/financials", protect, adminOnly, getFinancialStats);

// 3. Get Recent Activity Feed
dashboardRouter.get("/activity", protect, adminOnly, getRecentActivity);

export default dashboardRouter;
