import mongoose, { Schema, model } from 'mongoose';

const notificationSchema = new Schema(
    {
        // 1. Who is this notification for?
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        // 2. Short bold text (e.g., "Invoice Generated!")
        title: {
            type: String,
            required: true
        },
        // 3. The actual long message details
        message: {
            type: String,
            required: true
        },
        // 4. What category is this? (helps with frontend filtering/icons)
        type: {
            type: String,
            enum: ['maintenance', 'billing', 'general'],
            default: 'general'
        },
        // 5. Has the user seen it yet? 
        isRead: {
            type: Boolean,
            default: false // When they click it, we flip this to true to hide the red dot!
        }
    },
    { timestamps: true }
);

const Notification = model('Notification', notificationSchema);

export default Notification;
