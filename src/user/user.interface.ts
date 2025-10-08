
import mongoose from "mongoose"
export interface UserInterface {
    _id:mongoose.Schema.Types.ObjectId;
    fullname:string;
    email:string;
    phone:string;
    role:string;
    password:string,
}