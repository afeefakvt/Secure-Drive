import { Request,Response } from "express";
import { hashPassword,comparePassword } from '../utils/passwordHash'
import { User } from "../models/userModel"
import { HTTP_STATUS } from "../constants/httpStatus";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt";
 


export const register = async(req:Request,res:Response):Promise<void>=>{
    try {        
        const {name,email,password} = req.body

        const existingUser = await User.findOne({email});
        if(existingUser){
            res.status(HTTP_STATUS.BAD_REQUEST).json({message:'User already exists'})
            return;
        }

        const hashedPassword = await hashPassword(password)
        const user = new User({
            name,
            email,
            password:hashedPassword
        })
        await user.save()
        res.status(HTTP_STATUS.CREATED).json({messgae:"User registered successfully"})
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({message:"registration failed",error})
        
    }
}



export const login = async(req:Request,res:Response):Promise<void>=>{
    try {
        const {email,password} = req.body;

        const user = await User.findOne({email})
        if(!user){
            res.status(HTTP_STATUS.UNAUTHORIZED).json({message:"Invalid email "})
            return;
        }
        const isMatch = await comparePassword(password,user.password);
        if(!isMatch){
            res.status(HTTP_STATUS.UNAUTHORIZED).json({message:"Invalid password"})
            return;
        }

        const accessToken = generateAccessToken({id:user._id,email:user.email})
        if(!accessToken){
            res.status(HTTP_STATUS.NOT_FOUND).json({message:"user not found"})
            return;
        }

        const refreshToken = generateRefreshToken({id:user._id})
        res.cookie("refreshToken",refreshToken,{
            httpOnly:true,
            secure:process.env.NODE_ENV==="production",
            sameSite:'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(HTTP_STATUS.OK).json({message:"Login Successful",accessToken,user})
        return;
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({message: "Login failed",error});
        return;
    }
}

export const refreshAccessToken = async(req:Request,res:Response):Promise<void>=>{
    try {
       const refreshToken = req.cookies.refreshToken       
       if(!refreshToken){
        console.error("No refresh token found,logging out")
        res.clearCookie("refreshToken")
        res.status(HTTP_STATUS.UNAUTHORIZED).json({message:"no refresh token found"})
        return;
       } 

       const decoded = verifyRefreshToken(refreshToken) as {id:string}
    //    console.log(decoded,"decode");
       const user = await User.findById(decoded.id)
       if(!user){
        res.clearCookie('refreshToken');
        res.status(HTTP_STATUS.NOT_FOUND).json({message:"User not found"})
        return;
       }
       const newAccessToken = generateAccessToken({
        id:user._id,
        email:user.email
        })
        res.json({token:newAccessToken})
       
    } catch (error) {
        console.log("invalid or expired refresh token:",error);
        res.clearCookie("refreshToken");
        res.status(HTTP_STATUS.FORBIDDEN).json({message:"Invalid refresh token"});
        
    }
}

export const logout = async(req:Request,res:Response):Promise<void>=>{
    try {
        res.clearCookie("refreshToken",{
            httpOnly:true,
            secure:process.env.NODE_ENV==="production",
            sameSite:'none'
        })
        res.status(HTTP_STATUS.OK).json({message:"Logged out successfully"})
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Internal server error", error });
    }
}
