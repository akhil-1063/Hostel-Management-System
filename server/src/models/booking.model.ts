import mongoose, { Schema, model } from 'mongoose';

const bookingSchema = new Schema(
    {
        
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
    
        room: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room',
            required: true
        },

        checkInDate: {
            type: Date,
            required: true
        },
        checkOutDate: {
            type: Date,
            required: true
        },

        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected', 'completed'],
            default: 'pending' // When a resident first clicks 'book', it pends for Admin approval
        }
    },
    { timestamps: true }
);

const Booking = model('Booking', bookingSchema);

export default Booking;
