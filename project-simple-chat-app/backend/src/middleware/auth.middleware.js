import User from "../model/auth.model.js"
import jwt, { decode } from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            console.log(`inside middleware , token variable has:${token}`);

            return res.status(401).json({ message: "Unauthorized - No Token Provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            console.log(`inside middleare , decoded variable has:${decoded}`);
            return res.status(401).json({ message: "Unauthorized - Invalid Token" });
        }

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            console.log(`inside middleare , user variable has:${user}`);
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;

        next()
    } catch (error) {
        console.log("Error in protectRoute middleware: ", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }

    ;
}