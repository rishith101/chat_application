import express from "express";
import user  from "./models/user";
import {verifyWebhook } from "@clerk/backend/webhooks";
 
//This creates a smaller router to organize routes: Then connect it to the main app:
const router=express.Router()

router.post("/",async (req,res) =>{
    //secret key used to verify that webhook requests really came from Clerk.
    try{
        const signingSecret=process.env.CLERK_WEBHOOK_SIGNING_SECRET;
        if(!signingSecret){
            res.status(503).json({message:" webhook secret is not provided"});
            return;
        }
        const payload = Buffer.isBuffer(req.body) ? req.body.toString("utf8") : String(req.body);
        const request = new Request("http://internal/webhooks/clerk", {
            method: "POST",
            headers: new Headers (req.headers),
            body: payload,
        });
        const evt = await verifyWebhook (request, { signingSecret });
        if (evt.type === "user.created" || evt.type === "user.updated") {
            const u = evt.data;
            const email =u.email_addresses?.find((e) => e.id === u.primary_email_address_id)?.email_address ??u.email_addresses?. [0]?.email_address;
            const fullName = [u.first_name, u.last_name].filter(Boolean).join("") || u.username || email?.split("@")[0] || "Clerk User";

            await user.findOneAndUpdate({clerkId:u.id},
                {clerkId:u.id,email,fullName,profilePic:u.image_url},
                { new:true ,upset:true ,setDefaultOnInsert:true},
            );
        }

        if(evt.type==="user.deleted"){
            if(evt.data.id) await user.findOneAndDelete({clerkId:evt.data.id});
        }
        res.status(200).json({received:true});
    }catch(error){
        console.error("error in clerk webhook",error);
        res.status(400).json({ message:"Webhook verifcation failed"});
    }
})

export default router;