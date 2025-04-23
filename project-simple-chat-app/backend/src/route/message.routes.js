import {protectRoute} from "../middleware/auth.middleware.js"
import { getMessages, getUsersForSidebar, sendMessage } from "../controller/message.controller.js";
import {Router} from "express";

const router = Router();

router.get("/users",protectRoute,getUsersForSidebar);
router.get("/:otherUserId",protectRoute,getMessages);
router.post("/send/:receiverId",protectRoute,sendMessage);