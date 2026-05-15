import { Router } from "express";
import { createBooking, getAllBookings, getMyBookings } from "../controllers/booking.controller";
import { protect, adminOnly } from "../middlewares/auth.middleware";

const bookingRouter = Router();

// 1. Any logged-in user can request to book a room
bookingRouter.post("/", protect, createBooking);

// 2. Only Admins can see the master list of all bookings
bookingRouter.get("/", protect, adminOnly, getAllBookings);

// 3. A logged-in user can see their own personal bookings
bookingRouter.get("/my-bookings", protect, getMyBookings);

export default bookingRouter;
