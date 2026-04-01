// Dummy Users (Matching your Admin User Management table)
export const DUMMY_USERS = [
    {
        _id: "u1",
        fullname: "Aditya Sharma",
        username: "aditya_s",
        email: "aditya@streamguard.com",
        role: "admin",
        isActive: true,
        createdAt: "2024-01-15T10:30:00Z"
    },
    {
        _id: "u2",
        fullname: "Sarah Jenkins",
        username: "sjenkins",
        email: "sarah.j@outlook.com",
        role: "editor",
        isActive: true,
        createdAt: "2024-02-10T14:20:00Z"
    },
    {
        _id: "u3",
        fullname: "Michael Chen",
        username: "mchen_viewer",
        email: "m.chen@gmail.com",
        role: "viewer",
        isActive: true,
        createdAt: "2024-03-01T09:45:00Z"
    },
    {
        _id: "u4",
        fullname: "Jessica Williams",
        username: "jess_w",
        email: "jessica.w@techcorp.io",
        role: "viewer",
        isActive: false,
        createdAt: "2024-03-05T11:00:00Z"
    }
];

// Dummy Videos (Matching your Dashboard & StatusBadge logic)
export const DUMMY_VIDEOS = [
    {
        _id: "v1",
        originalName: "Project_Presentation_Q1.mp4",
        status: "completed",
        sensitivity: "safe",
        size: 52428800, // 50MB
        progress: 100,
        assignedUsers: ["u3", "u4"],
        createdAt: "2024-03-20T16:00:00Z"
    },
    {
        _id: "v2",
        originalName: "Marketing_Ad_Draft_v2.mov",
        status: "processing",
        sensitivity: "pending",
        size: 157286400, // 150MB
        progress: 45,
        assignedUsers: [],
        createdAt: "2024-03-21T08:30:00Z"
    },
    {
        _id: "v3",
        originalName: "Internal_Security_Leak_Test.mp4",
        status: "completed",
        sensitivity: "flagged",
        size: 89128960, // 85MB
        progress: 100,
        assignedUsers: ["u1"],
        createdAt: "2024-03-19T12:15:00Z"
    }
];

export const VIDEO_STATUS = {
  UPLOADING: 'uploading',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

export const SENSITIVITY_FLAG = {
  SAFE: 'safe',
  FLAGGED: 'flagged',
  PENDING: 'pending'
};

export const VIDEO_TYPES = [
  'video/mp4',
  'video/quicktime',
  'video/x-msvideo',
  'video/x-matroska',
  'video/webm'
];

export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};