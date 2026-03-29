import mongoose from "mongoose"

const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:3
    },
    email:{
        type:String,
        lowercase:true,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true,
        minlength:6,
        Selection:false,
    },
    phone:{
        type:String,
        required:true,
        minlength:10,
        maxlength:10
    },
    role:{
        type:String,
        enum:["Student","Admin"],
        default:"Student"
    },
    address:{
        type:String,
        required:true
    }
},{timestamps:true})

export const User=mongoose.model("User",UserSchema);