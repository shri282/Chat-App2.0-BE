import jwt from "jsonwebtoken";
import User from "../models/user.js";

const authUser = async (req, res, next) => {
    const token = req.header("Authorization");
    if(token && token.startsWith("Bearer")) {
        try {
            const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select("-password");
            req.user = user;
            next();
        } catch (error) {
            res.status(401).json({ error: "Not authorized, token failed" });
        }
    } else {
        res.status(401).json({ error: "Not authorized, token failed" });
    }
}

export default authUser;