import express from "express";
import "dotenv/config";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import User from "./models/user.js";
import { clerkMiddleware } from '@clerk/express'
import fs from "fs";
import path from "path";


const app=express();
const PORT=process.env.PORT ;
const  frontend_url=process.env.FRONTEND_URL;
const publicDir=path.join(process.cwd(),"public");

app.use(express.json());
app.use(cors({origin:frontend_url,credentials:true}));
app.use(clerkMiddleware());

app.get("/health", (req, res) => {
  res.status(200).json({ ok: true });
});


if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));

  app.get("/{*any}", (req, res, next) => {
    res.sendFile(path.join(publicDir, "index.html"), (err) => next(err));
  });
}

app.listen(PORT,()=>{
    connectDB();
    console.log("running on port 3000");
    if(process.env.NODE_ENV==="production")
    job.start();
});

// node latest version  . no need to nodemon  wecan use --watch in script . so it autmaically restarts the index.js where there are any kind of changes 



