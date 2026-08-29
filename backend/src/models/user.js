import mongoose  from "mongoose";
const userSchema=new mongoose.Schema({
    clerkID:{
        type:String,
        require:true,
        unique:true,
    },
    email:{
        type:String,
        require:true,
        unique:true,
    },
    fullName:{
        type:String,
        require:true,
    },
    profilePic:{
        type:String,
        default:""
    },
},
{timestamps:true},);

const User=mongoose.model("User",userSchema);
export default User;