import React, { useEffect, useState } from 'react';
import { Upload, Play, AlertTriangle, CheckCircle, Loader2, Edit3, Check, X } from 'lucide-react';
import UploadModal from './UploadModal';
import { useAuth } from '../../context/AuthProvider';
import VideoPlayer from './VideoPlayer';
import StatsOverview from '../Dashboard/StatsOverview';
import VideoFilters from '../common/VideoFilter';
import { LiveMonitor } from '../Dashboard/LiveMonitor';
import { useSocket } from '../../context/SocketProvider';
import { deleteVideo, editVideo, getAllVideos } from '../../api/axios';

const StatusBadge = ({ status, sensitivity }) => {
    if (status === 'processing') {
        return (
            <div className="flex items-center text-yellow-500 text-xs bg-yellow-500/10 px-2 py-1 rounded-full w-fit">
                <Loader2 size={12} className="mr-1" />
                Processing
            </div>
        );
    }

    if (status === 'completed' && sensitivity === 'flagged') {
        return (
            <div className="flex items-center text-red-500 text-xs bg-red-500/10 px-2 py-1 rounded-full w-fit">
                <AlertTriangle size={12} className="mr-1" />
                Flagged
            </div>
        );
    }

    if (status === 'completed' && sensitivity === 'safe') {
        return (
            <div className="flex items-center text-green-500 text-xs bg-green-500/10 px-2 py-1 rounded-full w-fit">
                <CheckCircle size={12} className="mr-1" />
                Safe
            </div>
        );
    }
    // Default case for other statuses
    return (
        <div className="flex items-center text-slate-400 text-xs bg-slate-500/10 px-2 py-1 rounded-full w-fit">
            {status}
        </div>
    );
};

const Dashboard = () => {
    const { authUser } = useAuth();
    const { processingUpdates } = useSocket();
    const [videos, setVideos] = useState([]);
    const [filters, setFilters] = useState({});

    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const [isUploadModalOpen, setUploadModalOpen] = useState(false);
    const [playingVideo, setPlayingVideo] = useState(null);

    const [processingVideos, setProcessingVideos] = useState([]);

    const filteredVideos = videos.filter((video) => {
        const searchMatch =
            !filters.search ||
            video.originalName?.toLowerCase().includes(filters.search.toLowerCase()) ||
            video.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
            video._id?.toLowerCase().includes(filters.search.toLowerCase());

        const statusMatch =
            !filters.status || video.status === filters.status;

        const sensitivityMatch =
            !filters.sensitivity || video.sensitivityFlag === filters.sensitivity;

        return searchMatch && statusMatch && sensitivityMatch;
    });

    const handleGetAllVideos = async () => {
        try {
            const res = await getAllVideos()
            if (res?.data) {
                setVideos(res?.data?.data?.videos)
            }
        } catch (error) {
            console.log('Error while fetching videos:', error)
        }
    }

    const startEditing = (video) => {
        setEditingId(video._id);
        setEditValue(video.description || "");
    };

    const handleSaveDescription = async (id) => {
        try {
            setIsUpdating(true);
            await editVideo(id, { description: editValue });
            setVideos((prev) =>
                prev.map((v) => v._id === id ? { ...v, description: editValue } : v)
            );
            setEditingId(null);
        } catch (error) {
            console.error("Failed to update description", error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            setDeletingId(id);
            await deleteVideo(id)
            setVideos((prev) => prev.filter((v) => v._id !== id));
        } catch (error) {
            console.log('Error While delete the video:', error)
        } finally {
            setDeletingId(null);
        }
    }

    useEffect(() => {
        const videos = Object.entries(processingUpdates).map(([videoId, update]) => ({
            videoId,
            ...update
        }));
        setProcessingVideos(videos);
    }, [processingUpdates]);

    useEffect(() => {
        handleGetAllVideos()
    }, [])

    const canEdit = authUser?.role === "admin" || authUser?.role === "editor";
    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Video Library</h2>
                        <p className="text-slate-400">Manage and monitor your uploaded content</p>
                    </div>
                    <button
                        onClick={() => setUploadModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                    >
                        <Upload size={18} />
                        <span>Upload Video</span>
                    </button>
                </div>
                <StatsOverview />
                <VideoFilters filters={filters} onFilterChange={setFilters} />
                {processingVideos?.length !== 0 ?
                    <LiveMonitor processingVideos={processingVideos} />
                    : null
                }
                <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-900 text-slate-400 uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-6 py-4">Video Name</th>
                                <th className="px-6 py-4">Description</th>
                                <th className="px-6 py-4">Upload Date</th>
                                <th className="px-6 py-4">Status</th>
                                {authUser?.role === "admin" && (
                                    <th className="px-6 py-4 text-right">Actions</th>
                                )}

                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {videos?.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center text-slate-400 py-6">
                                        No videos uploaded yet.
                                    </td>
                                </tr>
                            ) : (
                                filteredVideos?.map((video) => (
                                    <tr key={video._id} className="hover:bg-slate-700/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <button onClick={() => setPlayingVideo(video)} className="text-slate-400 hover:text-white p-1">
                                                    <Play size={16} />
                                                </button>
                                                <span className="font-medium text-white">{video?.originalName}</span>
                                                {canEdit && editingId !== video._id && (
                                                    <button
                                                        onClick={() => startEditing(video)}
                                                        className="text-slate-500 hover:text-blue-400 transition-colors"
                                                    >
                                                        <Edit3 size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {editingId === video._id ? (
                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        autoFocus
                                                        value={editValue}
                                                        onChange={(e) => setEditValue(e.target.value)}
                                                        className="bg-slate-900 border border-blue-500 text-white text-xs px-2 py-1 rounded outline-none w-full"
                                                    />
                                                    <button
                                                        onClick={() => handleSaveDescription(video._id)}
                                                        disabled={isUpdating}
                                                        className="text-green-500 hover:text-green-400"
                                                    >
                                                        {isUpdating ? <Loader2 size={14} className="animate-spin" /> : <Check size={16} />}
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingId(null)}
                                                        className="text-red-500 hover:text-red-400"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-slate-300">
                                                    {video?.description || <em className="text-slate-600">No description</em>}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-slate-400">
                                            {new Date(video.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge
                                                status={video.status}
                                                sensitivity={video.sensitivityFlag}
                                                progress={video.progress}
                                            />
                                        </td>
                                        {authUser?.role === "admin" && (
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    disabled={deletingId === video._id}
                                                    className="group p-2 rounded-lg hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
                                                    onClick={() => handleDelete(video._id)}
                                                >
                                                    {deletingId === video._id ? "Deleting..." : "🗑️"}
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isUploadModalOpen && (
                <UploadModal
                    onClose={() => setUploadModalOpen(false)}
                />
            )}
            {playingVideo && (
                <VideoPlayer video={playingVideo} onClose={() => setPlayingVideo(null)} />
            )}
        </>
    );
};

export default Dashboard;
