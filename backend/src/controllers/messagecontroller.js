import user from "../models/user.js";
import Message from "../models/message.js";
import {hasImageKitConfig,uploadChatMedia} from "../lib/imagekit.js"

export async function getUsersFromSidebar(req,res) {
    try{
        const loggedInUserId=req.user._id;
        const everyone=await user.find({_id:{$ne: loggedInUserId}}).select("-clerkId");
        res.status(200).json(everyone);
    }catch(error){
        res.status(500).json({message:"Internal server error"});
    }
};

export async function getConversationsFromSidebar(req,res) {
    try{
        const loggedInUserId=req.user._id;

        //aggresation pipeline
        const conversation=await Message.aggregate([
            //1. getting only the messages i send or recived
            {$match:{$or:[{senderId:loggedInUserId}, {receiverId:loggedInUserId}]}},
             
            {
                $group:{
                    _id:{ $cond:[{ $eq:["$senderId",loggedInUserId]} ,"$receiverId","$senderId" ]},
                    lastMessageAt:{$max:"$createdAt"}
                },
            },
            {
                $sort:{lastMessageAt:-1},
            },

            {$lookup:{from:"users", localField:"_id",foreignField:"_id",as :"user"}},

            {$replaceRoot:{newRoot:{$first:"$user"}}},

            {$project:{clerkId:0}},

        ]);
        res.status(200).json(conversation);
    }catch(error){
        console.error("error in converstion:",error.message);
        res.status(500).json({message:"server error"});
    }
};

export async function getMessages(req,res){
    try{
        const userToChatid=req.params.id;
        const myId=req.user._id;
        const message=await Message.find({
            $or:[
                {senderId:myId,receiverId:userToChatid},
                {senderId:userToChatid,receiverId:myId},
            ]
        }).sort({createdAt:-1});
        res.status(200).json(message);
    }catch(error){
        console.error("error in converstion:",error.message);
        res.status(500).json({message:"server error"});
    }
};

export async function sendMessage(req,res){
    try{
        const {text}=req.body;
        const receiverId=req.params.id;
        const senderId=req.user._id;
        let imageUrl;
        let videoUrl;
        if(req.file){
            if(!hasImageKitConfig()){
                res.status(500).json({message:"media upload is not configured"});
                return;
            }
            const url=await uploadChatMedia(req.file);
            if(req.file.mimetype.startsWith("video/")) videoUrl=url;
            else imageUrl=url;
        }
        const newMessage=new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl,
            vedio:videoUrl,
        })
        await newMessage.save();
        res.status(201).json(newMessage);
    }catch(error){
         console.error("error in converstion:",error.message);
        res.status(500).json({message:"server error"});
    }
}