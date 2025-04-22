import express from "express";
// import dotenv from "dotenv";
import { configDotenv } from "dotenv";
configDotenv();

//import routes
import authrouter from "./route/auth.route.js"
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";

const app = express();

//middlewares
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended:true }))

//use routes
app.use("/api/auth",authrouter)



const port = 5000;
app.listen(process.env.PORT,
    ()=>{
        try
        {
            console.log(`server started at http://localhost:${port}`)
            connectDB();
        }catch(e)
        {
            console.log(`error in connection:${e}`);
            
        }
    })