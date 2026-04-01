import fs from 'fs';

export const analyzeVideo = async (videoPath, metadata) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    let score = 0;
    let flag = 'safe';
    const randomScore = Math.random() * 100;

    const stats = fs.statSync(videoPath);
    const fileSizeMB = stats.size / (1024 * 1024);

    if (fileSizeMB > 50) {
        score += 30;
    }

    if (metadata.duration > 600) { // 10 minutes
        score += 20;
    }

    score += randomScore * 0.5;
    flag = score > 70 ? 'flagged' : 'safe';

    return {
        flag,
        score: Math.round(Math.min(score, 100))
    };
};