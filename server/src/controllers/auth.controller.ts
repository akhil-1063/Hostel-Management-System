import { Request, Response } from "express";
import User from "../models/user.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import envConfig from "../config/envConfig";
//Registering a USer if they don't exist


export const registerUser = async (req: Request, res: Response): Promise<void> => {

    try {

        // Checking for exisitng User
        const { name, email, password, role,phone,emergencyContactName,emergencyContactPhone,address } = req.body;

        const exisitingUser = await User.findOne({ email });

        if (exisitingUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }

        //Creating the New User

        const newUser = await User.create({ name, email, password,phone, role,emergencyContactName,emergencyContactPhone,address });
        console.log("New user registered Successfully");
        res.status(201).json({ message: "user registered successfully", user: newUser });



    } catch (error) {
        console.log("Error while registering user", error);
        res.status(500).json({ message: "internal server error" });
    }



}

// Generating a Jwt Token if the email already exisits 

export const loginUser = async (req: Request, res: Response): Promise<void> => {

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            res.status(401).json({ message: "Invalid Credentials" });
            return;
        }

        const token = jwt.sign({ id: user._id, role: user.role }, envConfig.jwt, { expiresIn: "1h" })
        console.log("User logged in successfully");
        res.status(200).json({ message: "user logged in successfully", token });




    }
    catch (error) {
        console.log("Error while logging in user", error);
        res.status(500).json({ message: "internal server error" });

    }



}
