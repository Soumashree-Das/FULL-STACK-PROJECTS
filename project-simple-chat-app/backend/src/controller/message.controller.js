import cloudinary from "../lib/cloudinary";
import User from "../model/auth.model";
import Message from "../model/message.model";

export const getUsersForSidebar = async (req,res) => {
    try {
        const userId = req.user._id;
        const filteredUser = await User.find({_id:{$ne:userId}}).select("-password");
        return res.status(200).json(filteredUser);
    } catch (error) {
        console.log(`error:${error}`)
        return res.status(500).json({
            Message:"error while fetching contacts of logged in user!",
            error:error
        })
    }
}

export const getMessages = async (req,res) => {
    try {
        const {otherUserId:otherUserId} = req.params;
        const myId = req.user._id;

        console.log(`myId:${myId},other user id :${otherUserId}`)
        
        const messages = await Message.find({
            $or:[
                {sender:myId,receiver:otherUserId},
                {receiver:myId,sender:otherUserId},
            ]
        })
        return res.status(200).json(messages)

    } catch (error) {
        console.log(`error:${error}`)
        return res.status(500).json({
            Message:"error while fetching messages!",
            error:error
        })
    }
}

export const sendMessage = async (req,res) => {
    try {
        const {text,image} = req.body;
        const {receiverId:receiverId} = req.params;
        const senderId = req.user._id;

        let imaegUrl 
        if(image)
        {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imaegUrl = uploadResponse.secure_url;
        }

        const message = new Message({
            sender:senderId,
            receiver:receiverId,
            text,
            image:imaegUrl
        })

        await message.save();

        //realtime functionality using socket io goes in here

        return res.status(200).json(message);

    } catch (error) {
        console.log(`error:${error}`)
        return res.status(500).json({
            Message:"error while sending messages!",
            error:error
        })
    }
}