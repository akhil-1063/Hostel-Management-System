import dotenv from "dotenv"
dotenv.config();    


const envConfig = {
    port : process.env.PORT || 5000,
    db : process.env.MONGO_URI as string 
}

export default envConfig    