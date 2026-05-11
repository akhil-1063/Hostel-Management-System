import mongoose from "mongoose";
import envConfig from "./envConfig";



const connectDB = async () =>{
    
try {
    await mongoose.connect(envConfig.db)
    console.log("DB Connected");

} catch (error) {
    console.log("DB Not Connected",error)
}       

}

export default connectDB
