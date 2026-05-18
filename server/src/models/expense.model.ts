import { Schema, model } from 'mongoose';

const expenseSchema = new Schema(
    {
        category: {
            type: String,
            enum: ['maintenance', 'utility', 'salary', 'inventory', 'other'],
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        dateIncurred: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

const Expense = model('Expense', expenseSchema);
export default Expense;
