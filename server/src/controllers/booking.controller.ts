import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import Booking from '../models/booking.model';

// 1. Create a Booking 
export const createBooking = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { room, checkInDate, checkOutDate } = req.body;

        // Security trick: We don't ask the user for their ID in the JSON body! 
        // We securely grab it straight from the Bouncer's ID check!
        const newBooking = await Booking.create({
            user: req.user.id,
            room,
            checkInDate,
            checkOutDate
        });

        res.status(201).json({ message: "Booking pending approval", booking: newBooking });
    } catch (error) {
        console.log("Error creating booking:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// 2. Get All Bookings (Admins Only)
export const getAllBookings = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
    
        // It reaches into the other collections and replaces the ID strings with the full Data!
        const bookings = await Booking.find()
            .populate('user', 'name email mobileno') // Only grab their name, email, and phone
            .populate('room', 'roomNumber floorNumber isAC'); // Only grab specific room details

        res.status(200).json(bookings);
    } catch (error) {
        console.log("Error fetching bookings:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// 3. Get My Bookings (Residents)
export const getMyBookings = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // Only find bookings where the user ID matches the logged-in person
        const myBookings = await Booking.find({ user: req.user.id })
            .populate('room', 'roomNumber floorNumber isAC pricePerMonth');

        res.status(200).json(myBookings);
    } catch (error) {
        console.log("Error fetching your bookings:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
