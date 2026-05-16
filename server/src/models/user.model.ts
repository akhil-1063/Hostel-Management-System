import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ['resident', 'admin', 'staff'],
            default: 'resident'
        }, 
        
         phone: { 
            type: String, 
            required: true 
        },
        emergencyContactName: { 
            type: String, 
            required: true 
        },
        emergencyContactPhone: { 
            type: String, 
            required: true 
        },
        address: { 
            type: String, 
            required: true 
        }
    },
    { timestamps: true },

);

//pre-save hook for encryping Passwords 

userSchema.pre('save',async function () {

    if(!this.isModified('password')){

        return ;
        
        
        
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password , salt);
           
})


const User = mongoose.model('User', userSchema);

export default User;
