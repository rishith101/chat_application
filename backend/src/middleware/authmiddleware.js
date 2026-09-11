import { getAuth } from "@clerk/express";
import User from "../models/user.js"


//getAuth - > It knows how to read Clerk's authentication information from the request and returns it in a simple format
// 1. Receives the incoming req object
// 2. Looks for Clerk authentication data on/associated with the request
// 3. Reads the authenticated user's session information
// 4. Returns auth details such as userId


export async function protectRoute(req,res,next) {
    try{
        const {userId}=getAuth(req);
        if(!userId){
            res.status(401).json({message:"unauthorized"});
            return;
        }
        const user= await User.findOne({clerkId:userId});
        if(!user){
            return res.status(404).json({message:"user profile is not synced yet"});
        }
        req.user=user;
        next();
    }catch(error){
        console.log("error at protectroute middleware");
        res.status(500).json({message:"internal server error"});
    }
}