import { Video } from "../models/video.modal.js";
import fs from 'fs';
import fsPromises from 'fs/promises';
import { getSocketInstance } from "../SocketIO/socket.js";
import { analyzeVideo } from '../services/videoAnalyzer.js';
import { extractdata } from '../services/videoEngine.js';
import jwt from 'jsonwebtoken';

export const uploadVideoHandler = async (req, res) => {
    console.log('called teh upload video handler of the ')
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No video file uploaded'
            });
        }

        const { title, description } = req.body;

        const video = await Video.create({
            title: title || req.file.originalname,
            description: description || '',
            filename: req.file.filename,
            originalName: req.file.originalname,
            filePath: req.file.path,
            fileSize: req.file.size,
            mimeType: req.file.mimetype,
            userId: req.user._id,
            status: 'processing'
        });

        res.status(201).json({
            success: true,
            message: 'Video uploaded successfully',
            data: { video }
        });

        // async processing
        processVideoJob(video._id, req.user._id.toString());

    } catch (error) {
        console.error('Upload error:', error);

        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({
            success: false,
            message: 'Video upload failed',
            error: error.message
        });
    }
};

export const processVideoJob = async (videoId, userId) => {
    const io = getSocketInstance();

    try {
        const video = await Video.findById(videoId);
        if (!video) return;

        // Step 1: Metadata
        io.to(userId).emit('processing-update', {
            videoId,
            progress: 25,
            status: 'Extracting metadata...'
        });

        const metadata = await extractdata(video.filePath);

        video.duration = metadata.duration;
        video.resolution = metadata.resolution;
        video.processingProgress = 25;
        await video.save();

        // Step 2: Sensitivity
        io.to(userId).emit('processing-update', {
            videoId,
            progress: 50,
            status: 'Analyzing content...'
        });

        const sensitivityResult = await analyzeVideo(video.filePath, metadata);

        video.sensitivityFlag = sensitivityResult.flag;
        video.sensitivityScore = sensitivityResult.score;
        video.processingProgress = 50;
        await video.save();

        // Step 3: Optimization (mock)
        io.to(userId).emit('processing-update', {
            videoId,
            progress: 75,
            status: 'Optimizing video...'
        });

        await new Promise(resolve => setTimeout(resolve, 1000));

        video.processingProgress = 75;
        await video.save();

        // Step 4: Complete
        video.status = 'completed';
        video.processingProgress = 100;
        video.processedDate = new Date();
        await video.save();

        io.to(userId).emit('processing-complete', {
            videoId,
            video
        });

    } catch (error) {
        console.error('Processing error:', error);

        const video = await Video.findById(videoId);
        if (video) {
            video.status = 'failed';
            await video.save();

            io.to(userId).emit('processing-failed', {
                videoId,
                message: 'Video processing failed'
            });
        }
    }
};

export const getVideosHandler = async (req, res) => {
    try {
        const { status, sensitivityFlag, search } = req.query;

        const query = { userId: req.user._id };

        if (status) query.status = status;
        if (sensitivityFlag) query.sensitivityFlag = sensitivityFlag;

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const videos = await Video.find(query)
            .sort({ createdAt: -1 })
            .select('-filePath');

        res.json({
            success: true,
            count: videos.length,
            data: { videos }
        });

    } catch (error) {
        console.error('Get videos error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch videos',
            error: error.message
        });
    }
};

export const getVideoByIdHandler = async (req, res) => {
    try {
        const video = await Video.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!video) {
            return res.status(404).json({
                success: false,
                message: 'Video not found'
            });
        }

        res.json({
            success: true,
            data: { video }
        });

    } catch (error) {
        console.error('Get video error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch video'
        });
    }
};

export const streamVideoHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const token = req.query.token;
        if (!token) {
            return res.status(401).json({ message: 'Token required' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const video = await Video.findOne({
            _id: id,
        });

        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        if (video.status !== 'completed') {
            return res.status(400).json({ message: 'Video still processing' });
        }

        const stat = await fsPromises.stat(video.filePath);
        const fileSize = stat.size;
        const range = req.headers.range;

        if (!range) {
            res.writeHead(200, {
                'Content-Length': fileSize,
                'Content-Type': video.mimeType,
            });

            return fs.createReadStream(video.filePath).pipe(res);
        }

        const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
        const start = parseInt(startStr, 10);
        const end = endStr ? parseInt(endStr, 10) : fileSize - 1;

        const chunkSize = end - start + 1;

        const stream = fs.createReadStream(video.filePath, { start, end });

        res.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': video.mimeType,
        });

        stream.pipe(res);

    } catch (error) {
        console.error('Stream error:', error);
        res.status(500).json({ message: 'Streaming failed' });
    }
};

export const deleteVideoHandler = async (req, res) => {
    try {
        const video = await Video.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!video) {
            return res.status(404).json({ success: false, message: 'Video not found' });
        }

        if (fs.existsSync(video.filePath)) {
            await fsPromises.unlink(video.filePath);
        }

        await video.deleteOne();

        res.json({
            success: true,
            message: 'Video deleted successfully'
        });

    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ success: false, message: 'Delete failed' });
    }
};

export const updateVideoHandler = async (req, res) => {
    try {
        const { description } = req.body;

        const video = await Video.findOne({
            _id: req.params.id,
        });

        if (!video) {
            return res.status(404).json({ success: false, message: 'Video not found' });
        }

        if (description) video.description = description;

        await video.save();

        res.json({
            success: true,
            message: 'Video updated successfully',
            data: { video }
        });

    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({ success: false, message: 'Update failed' });
    }
};