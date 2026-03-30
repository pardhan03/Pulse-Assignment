import jwt from 'jsonwebtoken';
import { User } from "../models/user.modal.js";

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });
};

export const register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        };

        const user = await User.create({
            username,
            email,
            password,
            role: role || 'editor'
        });

        const token = generateToken(user._id);

        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            }
        });

    } catch (error) {
        console.error('Register error:', error);

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Email or username already exists'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error.message
        });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const token = generateToken(user._id);

        return res.json({
            success: true,
            message: 'Login successfull',
            data: {
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            }
        });

    } catch (error) {
        console.error('Login error:', error);

        return res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
};


// export const getCurrentUser = async (req, res) => {
//     try {
//         return res.json({
//             success: true,
//             data: {
//                 user: {
//                     id: req.user._id,
//                     username: req.user.username,
//                     email: req.user.email,
//                     role: req.user.role
//                 }
//             }
//         });
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: 'Did not get user data',
//             error: error.message
//         });
//     }
// };