import ffmpeg from 'fluent-ffmpeg';
import path from 'path';

export const extractdata = (videoPath) => {
    return new Promise((resolve) => {
        ffmpeg.ffprobe(videoPath, (err, metadata) => {
            if (err) {
                console.error('FFprobe error:', err);

                return resolve({
                    duration: 0,
                    resolution: { width: 0, height: 0 }
                });
            }

            const videoStream = metadata.streams.find(
                (s) => s.codec_type === 'video'
            );

            resolve({
                duration: metadata.format.duration || 0,
                resolution: {
                    width: videoStream?.width || 0,
                    height: videoStream?.height || 0
                }
            });
        });
    });
};

export const thumbnail = (videoPath, outputPath) => {
    return new Promise((resolve, reject) => {
        ffmpeg(videoPath)
            .screenshots({
                timestamps: ['10%'],
                filename: path.basename(outputPath),
                folder: path.dirname(outputPath),
                size: '320x240'
            })
            .on('end', () => resolve(outputPath))
            .on('error', (err) => reject(err));
    });
};