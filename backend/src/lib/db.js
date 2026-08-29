import mongoose from "mongoose";
export async function connectDB() {
    try{
        const mongouri=process.env.MONGO_URI;
        if(!mongouri){
            throw new Error("mongouri is required");
        }
        const connection=await mongoose.connect(mongouri);
    }catch(error){
        console.error("mongodb onnection error",error.message);
        process.exit(1);
    }
}
