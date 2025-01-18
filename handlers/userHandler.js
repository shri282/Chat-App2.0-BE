import User from "../models/user.js";
import jwtUtilities from "../config/jwt.js";
const { generateToken } = jwtUtilities;
import cloudinary from "../config/cloudinary.js";

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    let file = req.file;
    if (!name || !email || !password) {
        return res.status(422).json({ error: "Please fill all the fields" });
    }

    try {
        const userExist = await User.findOne({ email });

        if (userExist) {
            return res.status(422).json({ error: "Email already exists" });
        }

        if(!file) {
          const user = await User.create({ name, email, password });
            if (user) {
                return res.status(201)
                    .json({ 
                        message: "User created successfully", 
                        user: {
                            _id: user._id,
                            name: user.name,
                            email: user.email,
                            pic: user.pic,       
                        }, 
                        token: generateToken(user._id)
                    });
            } else {
                return res.status(400).json({ error: "Failed to create user" });
            }
        }

        cloudinary.uploader.upload(file.path, async (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: "Internal server error" });
            }

            console.log(result.secure_url);
            const pic = result.secure_url;
            const user = await User.create({ name, email, password, pic });
            if (user) {
                return res.status(201)
                    .json({ 
                        message: "User created successfully", 
                        user: {
                            _id: user._id,
                            name: user.name,
                            email: user.email,
                            pic: pic,       
                        }, 
                        token: generateToken(user._id)
                    });
            } else {
                return res.status(400).json({ error: "Failed to create user" });
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}


const loginUser = async (req, res) => {
    const { email, password } = req.query;
    if (!email || !password) {
        return res.status(422).json({ error: "Please fill all the fields" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "Invalid email or password" });
        }
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(404).json({ error: "Invalid email or password" });
        }
        return res.status(200).json({ 
            message: "User logged in successfully", 
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                pic: user.pic,  
            }, 
            token: generateToken(user._id)
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }   
}

const fetchUsers = async (req, res) => {
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
        ]
    } : {};

    try {
        const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
        return res.status(200).json(users);
    } catch(error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }

};


export default { 
    registerUser,
    loginUser,
    fetchUsers
};