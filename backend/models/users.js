import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
        maxLength: [50, "Your name cannot exceed 50 characters"]
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true // Unique constraint here.
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: [6, "Your password must be at least 6 characters"],
        select: false // Do not return this field while querying this Model
    },
    avatar: {
        public_id: String,
        url: String,
    },
    role: {
        type: String,
        default: "user" // Default value here
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
}, { timestamps: true }); // Adds in a createdAt and updatedAt field.

/* 
    This line defines a pre-save middleware for the userSchema. 
    The  pre  method is used to specify middleware that should run
    before a certain operation—in this case, before saving a document.
    Async because, hashing is an Async Operation
*/
userSchema.pre("save", async function(next) {
    // Check if the password has been modified
    if (!this.isModified("password")) {
        return next(); // If not modified, skip hashing and proceed
    }
    
    // Hash the password if it has been modified
    // 10 is the number of Salt Rounds.This is industry standard.
    this.password = await bcrypt.hash(this.password, 10);
    
    // Call next to proceed with saving the document
    next();
});


/* Return JWT of the particular User */
userSchema.methods.getJwtToken = function() {
    return jwt.sign({ id: this._id, name: this.name },process.env.JWT_SECRET , { expiresIn: process.env.JWT_EXPIRE });
}


/* Comparing entered password and hashed password */
userSchema.methods.comparePassword = async function (enteredPassword) {
    console.log(enteredPassword)
    return await bcrypt.compare(String(enteredPassword), this.password)
}

/* Generating a Password Reset Token */
userSchema.methods.getResetPasswordToken = function() {
    const token = crypto.randomBytes(20).toString("hex");
    const hash = crypto.createHash('sha256').update(token).digest('hex');

    //Random Hexadecimal string that is 64 characters long.
    this.resetPasswordToken = hash;
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

    return token;
}


export default mongoose.model("User", userSchema);