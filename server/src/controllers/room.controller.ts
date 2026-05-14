import {Response,Request} from "express";;
import Room from "../models/room.model";

//1. CREATING A NEW ROOM  (admin only bruh) 

export const createRoom = async (req: Request, res: Response): Promise<void> => {
    try {
        const { roomNumber, floorNumber, capacity, isAC, pricePerMonth } = req.body;
        // Check if room already exists
        const existingRoom = await Room.findOne({ roomNumber });
        if (existingRoom) {
            res.status(400).json({ message: "Room number already exists" });
            return;
        }

          const newRoom = await Room.create({
            roomNumber,
            floorNumber,
            capacity,
            isAC,
            pricePerMonth
        });
        res.status(201).json({ message: "Room created successfully", room: newRoom });
    } catch (error) {
        console.log("Error creating room:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


//Logiv to Fetch all the Rooms 


export const getAllRooms = async (req: Request, res: Response): Promise<void> => {
    try {
        // Fetch every single room from the database
        const rooms = await Room.find({});
        res.status(200).json(rooms);
    } catch (error) {
        console.log("Error fetching rooms:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};