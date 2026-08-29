import express from "express"
import "dotenv/config"
const PORT=process.env.PORT
console.log(process.env.db)
const app=express()
app.listen(PORT,()=>console.log("running on port 3000"));

// node latest version  . no need to nodemon  wecan use --watch in script . so it autmaically restarts the index.js where there are any kind of changes 
