import mongoose from "mongoose";


const user_Schema = new mongoose.Schema({
     
    userName :{type:String , required:true},
    firstName :{type:String , required:true},
    lastName :{type:String , required: true},
    password : {type:String , required :true}

})


const user_model = mongoose.model("Users" , user_Schema);


export default user_model;