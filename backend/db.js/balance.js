import mongoose  from "mongoose";
import user_model from "./userSchema";


const balance_Schema  = new mongoose.Schema({
    user_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref :'Users' 
    },
     balance : {type:Number , default:0}
})

const balance_model = mongoose.model("Account" , balance_Schema);

export default balance_model;