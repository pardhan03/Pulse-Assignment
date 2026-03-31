import { useMemo } from "react";
import StatsCard from "../common/StatsCard";

export const DUMMY_USERS = [
    {
        _id: "u101",
        fullname: "Aryan Malhotra",
        username: "aryan_admin",
        email: "aryan.m@streamguard.io",
        role: "admin",
        isActive: true,
        joinedDate: "2023-11-12",
        avatarColor: "bg-purple-500",
        lastLogin: "2 hours ago"
    },
    {
        _id: "u102",
        fullname: "Sanya Iyer",
        username: "sanya_edit",
        email: "s.iyer@content.com",
        role: "editor",
        isActive: true,
        joinedDate: "2024-01-05",
        avatarColor: "bg-green-500",
        lastLogin: "5 mins ago"
    },
    {
        _id: "u103",
        fullname: "Rohan Das",
        username: "rohan_v",
        email: "rohan.das@gmail.com",
        role: "viewer",
        isActive: true,
        joinedDate: "2024-02-20",
        avatarColor: "bg-yellow-500",
        lastLogin: "Yesterday"
    },
    {
        _id: "u104",
        fullname: "Ishaan Verma",
        username: "iverma_7",
        email: "ishaan.v@enterprise.in",
        role: "admin",
        isActive: true,
        joinedDate: "2023-12-01",
        avatarColor: "bg-blue-500",
        lastLogin: "1 day ago"
    },
    {
        _id: "u105",
        fullname: "Ananya Reddy",
        username: "ananya_r",
        email: "ananya.reddy@media.co",
        role: "editor",
        isActive: false, // Testing the "Inactive" UI state
        joinedDate: "2024-03-10",
        avatarColor: "bg-pink-500",
        lastLogin: "3 weeks ago"
    },
    {
        _id: "u106",
        fullname: "Kabir Singh",
        username: "ksingh_view",
        email: "kabir.s@outlook.com",
        role: "viewer",
        isActive: true,
        joinedDate: "2024-03-15",
        avatarColor: "bg-orange-500",
        lastLogin: "Just now"
    }
];

export const DUMMY_VIDEOS = [
    {
        _id: "v201",
        originalName: "Security_Protocol_Brief.mp4",
        status: "completed",
        sensitivity: "safe",
        size: 45200000, // 43.1 MB
        progress: 100,
        createdAt: "2024-03-25T10:00:00Z",
        uploader: "Sanya Iyer"
    },
    {
        _id: "v202",
        originalName: "Raw_Footage_Unit_B.mov",
        status: "processing",
        sensitivity: "pending",
        size: 125000000, // 119.2 MB
        progress: 65,
        createdAt: "2024-03-28T14:30:00Z",
        uploader: "Ananya Reddy"
    },
    {
        _id: "v203",
        originalName: "Leaked_Internal_Demo.mp4",
        status: "completed",
        sensitivity: "flagged",
        size: 82000000, // 78.2 MB
        progress: 100,
        createdAt: "2024-03-27T09:15:00Z",
        uploader: "Sanya Iyer"
    }
];

const StatsOverview = () => {
    const stats = useMemo(() => {
        // if (type === "user") {
        //     return [
        //         { key: "total", title: "Total Users", value: DUMMY_USERS.length, footer: "Registered accounts" },
        //         { key: "admin", title: "Admins", value: DUMMY_USERS.filter(u => u.role === 'admin').length },
        //         { key: "editor", title: "Editors", value: DUMMY_USERS.filter(u => u.role === 'editor').length },
        //         { key: "viewer", title: "Viewers", value: DUMMY_USERS.filter(u => u.role === 'viewer').length },
        //     ];
        // }
        
        // Video Stats (Matches your 1st image)
        return [
            { key: "total", title: "Total Videos", value: DUMMY_VIDEOS.length, icon: 'Video' },
            { key: "processing", title: "Processing", value: DUMMY_VIDEOS.filter(v => v.status === 'processing').length, icon: 'Settings' },
            { key: "completed", title: "Completed", value: DUMMY_VIDEOS.filter(v => v.status === 'completed').length, icon: 'CheckCircle' },
            { key: "failed", title: "Failed", value: 0, icon: 'XCircle' }, // Default 0
            { key: "safe", title: "Safe", value: DUMMY_VIDEOS.filter(v => v.sensitivity === 'safe').length, icon: 'Shield' },
            { key: "flagged", title: "Flagged", value: DUMMY_VIDEOS.filter(v => v.sensitivity === 'flagged').length, icon: 'AlertTriangle' },
        ];
    }, []);

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {stats.map((stat, index) => (
                <StatsCard
                    key={index}
                    themeKey={stat.key}
                    title={stat.title}
                    value={stat.value}
                    footer={stat.footer}
                    trending={stat.trending}
                />
            ))}
        </div>
    );
};

export default StatsOverview;