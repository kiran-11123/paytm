import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './db.js/mongodb.js';
dotenv.config();
const app =express();
connectDB();
app.use(express.json());









app.listen(5000 , ()=>{
     console.log("Server is running.")
})