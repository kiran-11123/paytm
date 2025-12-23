import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './db.js/mongodb.js';
import cookieParser from 'cookie-parser';
import users_Router from './routes/user.js';
dotenv.config();
const app =express();
await connectDB();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api/v1/users" , users_Router);








app.listen(5000 , ()=>{
     console.log("Server is running.")
})