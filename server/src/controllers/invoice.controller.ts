import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import Invoice from '../models/invoice.model';
import Notification from '../models/notification.model';
import User from '../models/user.model';
import { sendEmail } from '../utils/email';
import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay with Dummy Keys (You will replace these in your .env later!)
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy_key',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret_key'
});

// 1. Admin generates a bill for a resident
export const generateInvoice = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { user, room, billingMonth, roomFee, utilities, additionalServices, discount, lateFee } = req.body;

        // Math! Calculate the total they owe
        const totalAmount = (roomFee + utilities + additionalServices + lateFee) - discount;

        const newInvoice = await Invoice.create({
            user, room, billingMonth, roomFee, utilities, additionalServices, discount, lateFee, totalAmount
        });

        // --- NEW NOTIFICATION LOGIC ---
        const resident = await User.findById(user);
        
        // 1. In-App Notification
        await Notification.create({
            user,
            title: "New Invoice Generated",
            message: `Your rent bill for ${billingMonth} is ready. Total Amount: ₹${totalAmount}`,
            type: 'billing'
        });

        // 2. Email Notification
        if (resident) {
            await sendEmail(
                resident.email, 
                "Hostel Bill Generated", 
                `Hello ${resident.name},\n\nYour hostel bill for ${billingMonth} has been generated.\nTotal Amount: ₹${totalAmount}.\nPlease log in to the portal to pay.`
            );
        }
        // ------------------------------

        res.status(201).json({ message: "Invoice generated successfully", invoice: newInvoice });
    } catch (error) {
        console.log("Error generating invoice:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// 2. Resident clicks "Pay" -> We ask Razorpay for an Order ID
export const createRazorpayOrder = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { invoiceId } = req.params;
        const invoice = await Invoice.findById(invoiceId);

        if (!invoice) {
            res.status(404).json({ message: "Invoice not found" });
            return;
        }

        // Razorpay expects the amount in PAISE (multiply rupees by 100!)
        const options = {
            amount: invoice.totalAmount * 100,
            currency: "INR",
            receipt: invoiceId as string
        };

        // Tell Razorpay to generate the Order (cast to any to bypass strict TS rules on the SDK)
        const order = await razorpay.orders.create(options) as any;

        // Save the Razorpay Order ID to our database
        invoice.razorpayOrderId = order.id;
        await invoice.save();

        res.status(200).json({ message: "Order Created", order });
    } catch (error) {
        console.log("Error creating Razorpay order:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// 3. Verify the payment was actually successful
export const verifyPayment = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { invoiceId } = req.params;
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

        const invoice = await Invoice.findById(invoiceId);
        if (!invoice) {
            res.status(404).json({ message: "Invoice not found" });
            return;
        }

        // Razorpay Verification Magic: We use crypto to mathematically hash the data with our secret key
        const secret = process.env.RAZORPAY_KEY_SECRET || 'dummy_secret_key';
        const generatedSignature = crypto
            .createHmac('sha256', secret)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest('hex');

        // If the signature from Razorpay matches our generated signature, it is 100% authentic!
        if (generatedSignature === razorpay_signature) {
            invoice.status = 'paid';
            invoice.razorpayPaymentId = razorpay_payment_id;
            await invoice.save();

            res.status(200).json({ message: "Payment verified successfully", invoice });
        } else {
            res.status(400).json({ message: "Invalid payment signature!" });
        }
    } catch (error) {
        console.log("Error verifying payment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
