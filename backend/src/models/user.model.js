import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },

        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6,
        },

       avatar: {
            url: {
                type: String,
                default: "",
            },
            publicId: {
                type: String,
                default: "",
            },
        },

        coverImage: {
            url: {
                type: String,
                default: "",
            },
            publicId: {
                type: String,
                default: "",
            },
        },

        bio: {
            type: String,
            default: "",
        },

        githubUsername: {
            type: String,
            default: "",
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },

        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },

        refreshToken: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function (next){
    if(!this.isModified("password")){
        return ;
    }

    this.password=await bcrypt.hash(this.password, 10)
    
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};

const User=mongoose.model("User", userSchema)
export default User;