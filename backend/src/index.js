import express from "express";
import "dotenv/config";
import { connectDB } from "./lib/db.js";
import User from "./models/User.js";
import { clerkMiddleware } from '@clerk/express'

const PORT=process.env.PORT ;
console.log(process.env.db);
const app=express();
app.use(clerkMiddleware());
app.listen(PORT,()=>{
    connectDB();
    console.log("running on port 3000")
});

// node latest version  . no need to nodemon  wecan use --watch in script . so it autmaically restarts the index.js where there are any kind of changes 



