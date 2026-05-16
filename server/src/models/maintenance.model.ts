import mongoose, { Schema, model } from 'mongoose';

const maintenanceSchema = new Schema(
    {
        // 1. Who is complaining?
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        // 2. What room is the issue in?
        room: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room',
            required: true
        },
        // 3. What is the actual problem?
        issueDescription: {
            type: String,
            required: true,
            trim: true
        },
        // 4. How bad is the problem?
        priority: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'low'
        },
        // 5. Is it fixed yet?
        status: {
            type: String,
            enum: ['pending', 'in-progress', 'resolved'],
            default: 'pending' // Starts as pending when the resident submits it
        }
    },
    { timestamps: true }
);

const Maintenance = model('Maintenance', maintenanceSchema);

export default Maintenance;
