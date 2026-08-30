import express from "express";
import "dotenv/config";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import User from "./models/user.js";
import { clerkMiddleware } from '@clerk/express'
import fs from "fs";
import path from "path";
import job from "./lib/cron.js";
import clerkWebhook from "./webhooks/clerk.js";
import authRoutes from "./routes/auth.js";
import messageRoutes from "./routes/messageroutes.js"
const app=express();
const PORT=process.env.PORT ;
const  frontend_url=process.env.FRONTEND_URL;
const publicDir=path.join(process.cwd(),"public");

//what ever the clerk send the request(object) send as it ,  no need to doing parsing
app.use("/api/webhooks/clerk",express.raw({type:"application/json"}),clerkWebhook);

app.use(express.json());
app.use(cors({origin:frontend_url,credentials:true}));
app.use(clerkMiddleware());

app.get("/health", (req, res) => {
  res.status(200).json({ ok: true });
});

app.get("/api/auth",authRoutes);
app.get("/api/auth",messageRoutes); // any time we want to send messages or fetch messages this endpoint is called.


 

//When deploying as a monolith, the same server handles both the frontend and backend.
// The public folder contains the built frontend files, which Express sends to the user's browser.
// The catch-all route ensures frontend pages like /dashboard work correctly.
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



