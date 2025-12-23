import express from 'express'
import mongoose from 'mongoose';
import balance_model from '../db.js/balance.js';
import Authentication_token from '../middleware/Authentication_token';
const Account_Router =express.Router();


Account_Router.post("/transfer" , Authentication_token , async(req,res)=>{
       
    try{

        const fromAccount  = req.body.from;
        const toAccount  = req.body.to;
        const amount = req.body.amount;


        await balance_model.findByIdAndUpdate(fromAccount , {$inc :{balance :amount}});

    }
    catch(er){
         return res.status(500).json({
            message :"Internal Server Error"
         })
    }
})














export default Account_Router;