import Mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email : {
        type: String,
        required: true,
        unique: true,
    },
    pic: {
        type: String,
        default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
},
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

const User = Mongoose.model("User", userSchema);

export default User;