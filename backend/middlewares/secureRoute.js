import jwt from 'jsonwebtoken';
import { User } from '../models/user.modal.js';

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No Authentication'
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error('secure route error:', error.message);
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

export default auth;
