import { Router } from "express";
import { generateInvoice, createRazorpayOrder, verifyPayment } from "../controllers/invoice.controller";
import { protect, adminOnly } from "../middlewares/auth.middleware";


const invoiceRouter = Router();

// 1. Admin generates a bill
invoiceRouter.post("/", protect, adminOnly, generateInvoice);

// 2. Resident clicks "Pay" to get an Order ID
invoiceRouter.post("/:invoiceId/pay", protect, createRazorpayOrder);

// 3. Resident's app sends the success signature to verify the payment
invoiceRouter.post("/:invoiceId/verify", protect, verifyPayment);

export default invoiceRouter;
