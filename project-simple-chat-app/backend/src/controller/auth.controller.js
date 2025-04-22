// import express from "express";
import User from "../model/auth.model.js"
import { generateToken } from "../lib/util.js";
import bcrypt from "bcryptjs"
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req,res) => {
    // const { fullname, username, email, password } = req.body;
    const fullname = req.body.fullname;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const profilePic = req.body.profilePic;
    try {
        if(password<6){
            return res.status(400).json({message:"Password should be of length at least 6 "})
        }

        const user = await User.findOne({email:email});

        if(user){
            return res.status(403).message({message:"User does exist already . please login to continue."})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new User({
            username:username,
            fullname:fullname,
            email:email, 
            password:hashedPassword
        })

        if(newUser){
            generateToken(newUser._id,res);
            await newUser.save();

            return res.status(200).json({
                _id:newUser._id,
                username:newUser.username,
                fullname:newUser.fullname,
                email:newUser.email,
                profilePic:newUser.profilePic||""
            })
        }else{
            return res.status(400).json({message:"user details no valid!"})
        }

    } catch (error) {
        console.log(`error in the server in registering new user(singup func):   ${error}`)
        return res.status(500).json({
            message:"Server error",
            error:error
        })
    }
}
export const login = async(req,res) => {
    const { username,email, password } = req.body;
  try {
    const user = await User.findOne({$or: [{email},{username}] });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
export const logout = (req,res) => { try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }}

  export const updateProfile = async (req, res) => {
    try {
      const { profilePic } = req.body;
      const userId = req.user._id;
  
      if (!profilePic) {
        return res.status(400).json({ message: "Profile pic is required" });
      }
  
      const uploadResponse = await cloudinary.uploader.upload(profilePic);
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: uploadResponse.secure_url },
        { new: true }
      );
  
      res.status(200).json(updatedUser);
    } catch (error) {
      console.log("error in update profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  export const checkAuth = (req, res) => {
    try {
      res.status(200).json(req.user);
    } catch (error) {
      console.log("Error in checkAuth controller", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  