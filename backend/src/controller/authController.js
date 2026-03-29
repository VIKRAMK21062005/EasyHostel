import { User } from "../model/UserModel.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const registerController=async(req,res)=>{
    try {
        const {name,email,password,phone,role,address}=req.body;

        if(!name || !email ||!password ||!phone || !role ||!address){
            return res.status(400).json({
                message:"All the fields need to enter"
            })
        }

        const existUser=await User.findOne({email});

        if(existUser){
            return res.status(400).json({
                message:"User already exist"
            })
        }
        const salt=await bcrypt.genSalt(10)

        const hashedPassword=await bcrypt.hash(password,salt)

        const user=await User.create({
            name,email,password:hashedPassword,phone,role,address
        })

        res.status(201).json({
            message:"User created successfully"
        })

    } catch (error) {
        console.log("Error in register",error)
        res.status(500).json({
            message:"Server Error"
        })
    }
}

export const loginController=async(req,res)=>{
    try {
        const {email,password}=req.body;

        if(!email || !password){
            return res.status(400).json({
                message:"Invalid credientials"
            })
        }
        const existUser=await User.findOne({email}).select("+password");
        if(!existUser){
            return res.status(400).json({
                message:"User does not exist !!,Please register"
            })
        }

        const isMatch=await bcrypt.compare(password,existUser.password)

        if(!isMatch){
            return res.status(401).json({
                message:"Password is incorrect"
            })
        }

        const token=jwt.sign({id:existUser._id,role:existUser.role},process.env.JWT_SECRET_KEY,{expiresIn: "1d"})

        res.status(200).json({
           message:"Login successfull",
           token,
           user:existUser
        })

    } catch (error) {
        console.log("Error in login",error)
    }
}