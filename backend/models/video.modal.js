import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    filename: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number,
        required: true
    },
    mimeType: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        default: 0
    },
    resolution: {
        width: { type: Number, default: 0 },
        height: { type: Number, default: 0 }
    },
    status: {
        type: String,
        enum: ['uploading', 'processing', 'completed', 'failed'],
        default: 'uploading'
    },
    processingProgress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    sensitivityFlag: {
        type: String,
        enum: ['safe', 'flagged', 'pending'],
        default: 'pending'
    },
    sensitivityScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    uploadDate: {
        type: Date,
        default: Date.now
    },
    processedDate: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});


videoSchema.index({ userId: 1, status: 1 });
videoSchema.index({ userId: 1, sensitivityFlag: 1 });
videoSchema.index({ title: 'text', description: 'text' });


export const Video = mongoose.models.Video || mongoose.model('Video', videoSchema);
