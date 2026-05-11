import express from "express";
import envConfig from "./config/envConfig";
import connectDB from "./config/dbConnection";


const app =express() ;

 (async ()=>{
    try {
        await connectDB()
        await app.listen(envConfig.port)
        console.log(` 🚀 Server Started on port ${envConfig.port}`);
        
    } catch (error) {
        console.log("Server Not Started",error)
    }
 })()