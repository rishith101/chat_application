import express from "express";
import {getUsersFromSidebar , getConversationsFromSidebar,getMessages ,sendMessage } from  "../controllers/messagecontroller.js";
import { protectRoute } from "../middleware/authmiddleware.js";
import  {upload}  from "../middleware/uploadmiddleware.js";


const router=express.Router();

router.use(protectRoute);

router.get("/users",getUsersFromSidebar);

router.get("/conversations",getConversationsFromSidebar);

router.get("/:id",getMessages);

router.post("/send/:id",upload.array("media",5),sendMessage);


export default router;