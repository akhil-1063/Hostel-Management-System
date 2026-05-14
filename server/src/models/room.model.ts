import mongoose, { Schema ,model } from 'mongoose';

const roomSchema = new Schema(
    {
        roomNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        floorNumber: {
            type: Number,
            required: true
        },
        capacity: {
            // Represents the number of beds in the room (e.g., 2 or 3)
            type: Number, 
            required: true,
            min: 1
        },
        currentOccupants: {
            type: Number,
            default: 0 
        },
        isAC: {
            // true = AC, false = Non-AC
            type: Boolean,
            required: true,
            default: false
        },
        pricePerMonth: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ['available', 'full', 'maintenance'],
            default: 'available'
        }
    },
    { timestamps: true }
);

const Room = model('Room', roomSchema);

export default Room;
