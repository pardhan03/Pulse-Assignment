import { User } from "../models/user.modal.js";
import { Video } from "../models/video.modal.js";

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');

        return res.json({
            success: true,
            count: users.length,
            data: { users }
        });

    } catch (error) {
        console.error('Get users error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to fetch users',
            error: error.message
        });
    }
};


export const getUserStats = async (req, res) => {
    try {
        const userId = req.user._id;

        const [
            totalVideos,
            processingVideos,
            completedVideos,
            failedVideos,
            safeVideos,
            flaggedVideos
        ] = await Promise.all([
            Video.countDocuments({ userId }),
            Video.countDocuments({ userId, status: 'processing' }),
            Video.countDocuments({ userId, status: 'completed' }),
            Video.countDocuments({ userId, status: 'failed' }),
            Video.countDocuments({ userId, sensitivityFlag: 'safe' }),
            Video.countDocuments({ userId, sensitivityFlag: 'flagged' })
        ]);

        return res.json({
            success: true,
            data: {
                stats: {
                    totalVideos,
                    processingVideos,
                    completedVideos,
                    failedVideos,
                    safeVideos,
                    flaggedVideos
                }
            }
        });

    } catch (error) {
        console.error('Get stats error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to fetch statistics',
            error: error.message
        });
    }
};


export const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const userId = req.params.id;

        if (!['viewer', 'editor', 'admin'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role'
            });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { role },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.json({
            success: true,
            message: 'User role updated successfully',
            data: { user }
        });

    } catch (error) {
        console.error('Update role error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to update user role',
            error: error.message
        });
    }
};