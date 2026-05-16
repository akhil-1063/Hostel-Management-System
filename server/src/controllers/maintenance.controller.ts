import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import Maintenance from '../models/maintenance.model';

// 1. Submit a complaint (Residents)
export const createTicket = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { room, issueDescription, priority } = req.body;

        const ticket = await Maintenance.create({
            user: req.user.id, // Securely grabbed from the Bouncer
            room,
            issueDescription,
            priority
        });

        res.status(201).json({ message: "Maintenance ticket submitted successfully", ticket });
    } catch (error) {
        console.log("Error submitting ticket:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// 2. View all complaints (Admins)
export const getAllTickets = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const tickets = await Maintenance.find()
            .populate('user', 'name mobileno') // Admin needs to know who to call!
            .populate('room', 'roomNumber');   // Admin needs to know what room to go to!

        res.status(200).json(tickets);
    } catch (error) {
        console.log("Error fetching tickets:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// 3. Update the status to 'resolved' (Admins)
export const updateTicketStatus = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params; // Get the ticket ID from the URL (e.g., /api/maintenance/654b1...)
        const { status,assignedStaff } = req.body; // Expecting 'pending', 'in-progress', or 'resolved'

        // Mongoose Superpower: Find the ticket by ID and update it instantly
        const updatedTicket = await Maintenance.findByIdAndUpdate(
            id, 
            { status,assignedStaff},
            { new: true } // This tells Mongoose to return the NEW updated data, not the old data
        );

        if (!updatedTicket) {
            res.status(404).json({ message: "Ticket not found" });
            return;
        }

        res.status(200).json({ message: "Ticket updated!", ticket: updatedTicket });
    } catch (error) {
        console.log("Error updating ticket:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
