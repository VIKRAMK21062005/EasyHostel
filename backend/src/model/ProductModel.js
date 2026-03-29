import mongoose from "mongoose";

const ProductSchema=new mongoose.Schema({
    product:{
        type:String,
        required:true,
        minlength:1
    },
    price:{
        type:Number,
        required:true,
        min:0
    },
    image:{
        type:String,
        required:true
    }
},{timestamps:true})

export const Product=mongoose.model("Product",ProductSchema)