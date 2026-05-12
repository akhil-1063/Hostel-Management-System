import {Request ,Response } from "express";
import User from "../models/user.model";

//Registering a USer if they don't exist


export const registerUser = async  (req : Request ,res: Response ) :Promise<void> => {

try {

    // Checking for exisitng User
const {name,email,password,mobileno,role} =req.body;

const exisitingUser = await User.findOne({email});

if(exisitingUser) {
    res.status(400).json({message:"User already exists"});
    return;
}

//Creating the New User

const newUser = await User.create ({name,email,password,mobileno,role});
console.log("New user registered Successfully");
res.status(201).json({message:"user registered successfully", user : newUser});



} catch (error) {
    console.log("Error while registering user",error);
    res.status(500).json({message:"internal server error"});
}

    

}

