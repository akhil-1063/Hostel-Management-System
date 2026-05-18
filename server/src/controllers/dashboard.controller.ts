import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import Room from '../models/room.model';
import Invoice from '../models/invoice.model';
import Expense from '../models/expense.model';
import Maintenance from '../models/maintenance.model';
import Booking from '../models/booking.model';

// 1. Get Occupancy Rates
export const getOccupancyStats = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const totalRooms = await Room.countDocuments();
        const occupiedRooms = await Room.countDocuments({ isOccupied: true });
        
        // Math to calculate percentage (avoiding divide by zero!)
        const occupancyRate = totalRooms === 0 ? 0 : Math.round((occupiedRooms / totalRooms) * 100);

        res.status(200).json({ totalRooms, occupiedRooms, occupancyRate });
    } catch (error) {
        console.log("Error fetching occupancy stats:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// 2. Get Financial Stats (Revenue vs Expenses)
export const getFinancialStats = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // Mongoose Aggregation: Sum up ALL 'totalAmount' from Paid Invoices
        const revenueResult = await Invoice.aggregate([
            { $match: { status: 'paid' } },
            { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

        // Mongoose Aggregation: Sum up ALL 'amount' from Expenses
        const expenseResult = await Expense.aggregate([
            { $group: { _id: null, totalExpense: { $sum: '$amount' } } }
        ]);
        const totalExpense = expenseResult.length > 0 ? expenseResult[0].totalExpense : 0;

        const profit = totalRevenue - totalExpense;

        res.status(200).json({ totalRevenue, totalExpense, profit });
    } catch (error) {
        console.log("Error fetching financial stats:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// 3. Get Recent Activity Feed
export const getRecentActivity = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // Grab the 3 newest bookings and 3 newest maintenance tickets for the dashboard feed
        const recentBookings = await Booking.find().sort({ createdAt: -1 }).limit(3).populate('user', 'name').populate('room', 'roomNumber');
        const recentMaintenance = await Maintenance.find().sort({ createdAt: -1 }).limit(3).populate('user', 'name');

        res.status(200).json({ recentBookings, recentMaintenance });
    } catch (error) {
        console.log("Error fetching recent activity:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
