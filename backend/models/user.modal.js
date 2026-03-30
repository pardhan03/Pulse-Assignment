import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['viewer', 'editor', 'admin'],
        default: 'editor'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

userSchema.pre('save', async function(next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }

    try {
        const hashedPassword = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, hashedPassword);
        next();
    } catch (error) {
        return next(error);
    }
});

// compare the stored hashed of the user password
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (error) {
        return error;
    }
};

userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

export const User = mongoose.model("User", userSchema);
