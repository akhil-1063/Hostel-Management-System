import mongoose from "mongoose";
import bycrypt from "bcryptjs";

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
        mobileno : {
            type :String,
            required : true
        }
    },
    { timestamps: true },

);

//pre-save hook for encryping Passwords 

userSchema.pre('save',async function () {

    if(!this.isModified('password')){

        return ;
        
        
        
    }
    const salt = await bycrypt.genSalt(10);
    this.password = await bycrypt.hash(this.password , salt);
           
})


const User = mongoose.model('User', userSchema);

export default User;
