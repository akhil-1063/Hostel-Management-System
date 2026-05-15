import express from "express";
import envConfig from "./config/envConfig";
import connectDB from "./config/dbConnection";
import authRouter from "./routes/auth.routes";
import roomRouter from "./routes/room.routes";
import bookingRouter from "./routes/booking.routes"; 


const app =express() ;
app.use(express.json());
app.use("/api/auth",authRouter);
app.use("/api/rooms",roomRouter);
app.use("/api/bookings",bookingRouter);


 (async ()=>{
    try {
        await connectDB()
        await app.listen(envConfig.port)
        console.log(` 🚀 Server Started on port ${envConfig.port}`)
        console .log(`Here's the Url  http://localhost:${envConfig.port}`);
        
    } catch (error) {
        console.log("Server Not Started",error)
    }
 })()