import { getAuth } from "@clerk/express";
import user from "../models/user.js"
import Message from "../models/message.js";

export async function protectRoute(req,res,next) {
    try{
        const {userId} =getAuth(req);
        if(!userId){
            res.status(400).json({message:"unauthorized"});
            return;
        }
        const user= await user.findOne({clerkId:userId});
        if(!user){
            res.status(400).json({message:"user profile is not synced yet"});
        }
    }catch(error){
        console.log();
        res.status(400).json({message:""});
    }
}