import mongoose, { Schema, model } from 'mongoose';

const invoiceSchema = new Schema(
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
        billingMonth: {
            type: String, // e.g., "June 2024"
            required: true
        },
        
        // --- THE MONEY BREAKDOWN --- //
        roomFee: { type: Number, required: true },
        utilities: { type: Number, default: 0 },
        additionalServices: { type: Number, default: 0 },
        discount: { type: Number, default: 0 },
        lateFee: { type: Number, default: 0 },
        
        // This is the final calculated total
        totalAmount: { type: Number, required: true },

        status: {
            type: String,
            enum: ['pending', 'paid', 'overdue'],
            default: 'pending'
        },
        
        // --- RAZORPAY FIELDS --- //
        razorpayOrderId: {
            type: String,
            default: null // Generated when they click "Pay Now"
        },
        razorpayPaymentId: {
            type: String,
            default: null // Generated after successful payment
        }
    },
    { timestamps: true }
);

const Invoice = model('Invoice', invoiceSchema);

export default Invoice;
