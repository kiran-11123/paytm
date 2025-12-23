import express from 'express'
const users_Router = express.Router();
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import zod from 'zod'
dotenv.config();
import jwt from 'jsonwebtoken'
import user_model from '../db.js/userSchema.js';
import Authentication_token from '../middleware/Authentication_token.js';

const JWT_SECRET  =process.env.JWT_SECRET;


const signup_zod = zod.object({
    email : zod.email(),
    firstName :zod.string(),
    lastName :zod.string(),
    password :zod.string()
})

const update_zod  =zod.object({
     password: zod.string().optional(),
     firstName:zod.string().optional(),
     lastName:zpd.string().optional()
})


users_Router.post("/signin" , async(req,res)=>{

    try{

        const {email , password}  = req.body;

       
        
        
        if(!email || !password){
            return res.status(400).json({
                message : "Credentails not found.."
            })
        }

        const email_check = await  user_model.findOne({email : email});

        if(!email_check){
            return res.status(404).json({
                message : 'Email not found please register'
            })
        }

        const password_check = await bcrypt.compare(password , email_check.password);


        if(!password_check){
            return res.status(400).json({
                message : "Password is wrong"
            })
        }

        const details = {"user_id" : email_check._id , "firstName":email_check.firstName , "email" : email_check.email , "lastName" : email_check.lastName}

        const  token = jwt.sign(details , JWT_SECRET , {expiresIn:"1h"})
         res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
           
        });

        return res.status(200).json({
            message : "Login Successfull.",
            token :token
        })
    }
    catch(er){
         
        return res.status(500).json({
            message :"Internal server Error"
        })
    }     
})


users_Router.post("/signup" , async(req,res)=>{
      
    try{

        const success = signup_zod.safeParse(req.body);
        if(!success){
            return res.status(400).json({
                message : 'Email already taken / Incorrect Inputs'
            })
        }

        const {email , firstName , lastName , password} = req.body;

        const find_email = await user_model.findOne({email : email})
        if(find_email){
            return res.status(400).json({
                message : "Email Already present , please Login"
            })


        }

        const hashed_password = await bcrypt.hash(password , 10);

        const new_user =  new user_model({
            email,
            firstName,
            lastName,
            password: hashed_password

        })

        await new_user.save();

        return res.status(200).json({
            message : "User Created Successfully"
        })

    }
    catch(er){
        return res.status(500).json({
            message : "Internal Server Error",
            error:er
        })
    }
})



users_Router.put("/update" , Authentication_token , async(req,res)=>{
      
    try{

        const success = update_zod.safeParse(req.body)

        if(!success){
            return res.status(400).json({
                message :"Error while updating the information"
            })
        }

        await user_model.updateOne(req.body , {
            id :req.user.user_id
        })

        return res.status(200).json({
            message : 'Updated the details successfully'
        })

    }
    catch(er){
        return res.status(500).json({
            message : "Internal Server Error.",
            error:er
        })
    }
})


users_Router.get("/filter" , Authentication_token , async(req,res)=>{
     
    try{

        const filter = req.query.filter | "";

        const users = await user_model.find({
             $or:[{

                firstName : {
                 "$regex":filter
                },
            
             } , {
                 lastName  :{
                     "$regex" :filter
                 }
             }] 
        })

        return res.status(200).json({
            message : "Data fecthed successfully..",
            users_Data : users
        })
    }
    catch(er){
         return res.status(500).json({
            message : "Internal Server Error"
         })
    }
})











export default users_Router;
