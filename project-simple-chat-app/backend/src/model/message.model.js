import mongoose from "mongoose";
import User from "../model/auth.model.js"

const messageSchema = new mongoose.Schema({
  sender: {
    type:mongoose.Schema.Types.ObjectId,
    ref:User,
    required:true
  },
  receiver: {
    type:mongoose.Schema.Types.ObjectId,
    ref:User,
    required:true
  },
  text: {
    type:String,
    required:true,
  },
  picture:{
    type:String
  }
},{
    timestamps:true
})

const Message = mongoose.model("Message",messageSchema);
export default Message;