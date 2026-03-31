import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthProvider";
import { Save, X, UserCog, ShieldCheck } from "lucide-react";

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

const Admin = () => {
    const { authUser } = useAuth();
    const [users, setUsers] = useState(DUMMY_USERS);
    const [videos, setVideos] = useState(DUMMY_VIDEOS);
    const [loadingUsers, setLoadingUsers] = useState(false);

    const [pendingRoles, setPendingRoles] = useState({});
    const [savingUserId, setSavingUserId] = useState(null);

    const roles = useMemo(() => ["viewer", "editor", "admin"], []);

    // Handle dropdown change
    const handleRoleChange = (userId, newRole) => {
        const originalUser = users.find(u => u._id === userId);

        if (originalUser.role === newRole) {
            // If they changed it back to original, remove from pending
            const newPending = { ...pendingRoles };
            delete newPending[userId];
            setPendingRoles(newPending);
        } else {
            setPendingRoles({ ...pendingRoles, [userId]: newRole });
        }
    };

    const cancelChange = (userId) => {
        const newPending = { ...pendingRoles };
        delete newPending[userId];
        setPendingRoles(newPending);
    };

    const saveRoleUpdate = async (userId) => {
        const newRole = pendingRoles[userId];
        setSavingUserId(userId);

        try {
            // Replace with your actual API call
            // await axios.patch(`/api/v1/admin/users/${userId}/role`, { role: newRole });

            toast.success("Role updated successfully");

            // Update local state to reflect change
            setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
            cancelChange(userId);
        } catch (error) {
            toast.error("Failed to update role");
        } finally {
            setSavingUserId(null);
        }
    };

    if (!authUser || authUser.role?.toLowerCase() !== "admin") {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
                <ShieldCheck size={48} className="mb-4 opacity-20" />
                <p className="text-xl font-semibold text-white">Access Denied</p>
                <p className="text-sm">Admin privileges are required to view this portal.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header>
                <h2 className="text-3xl font-bold text-white">Management Portal</h2>
                <p className="text-slate-400">Configure user permissions and system access levels.</p>
            </header>

            {/* Users Section */}
            <section className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
                <div className="p-6 border-b border-slate-700/50 flex items-center space-x-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                        <UserCog size={20} />
                    </div>
                    <div>
                        <h3 className="text-white font-bold">User Directory</h3>
                        <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Role Management</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-900/50 text-slate-400 uppercase text-[10px] font-bold tracking-widest">
                            <tr>
                                <th className="px-6 py-4">Full Name</th>
                                <th className="px-6 py-4">Email Address</th>
                                <th className="px-6 py-4">Current Role</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {users?.map((u) => {
                                const isEdited = pendingRoles[u._id] !== undefined;
                                const currentDisplayRole = pendingRoles[u._id] || u.role;

                                return (
                                    <tr key={u._id} className={`transition-colors ${isEdited ? 'bg-blue-500/5' : 'hover:bg-slate-700/30'}`}>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-200">{u.fullname || u.username}</div>
                                            <div className="text-[10px] text-slate-500 font-mono italic">ID: {u._id}</div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400 font-light">{u.email}</td>
                                        <td className="px-6 py-4">
                                            <div className="relative w-fit">
                                                <select
                                                    value={currentDisplayRole}
                                                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                                    disabled={savingUserId === u._id}
                                                    className={`appearance-none bg-slate-900 text-xs font-semibold rounded-lg px-4 py-2 pr-8 border transition-all cursor-pointer outline-none
                            ${isEdited
                                                            ? 'border-blue-500 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                                                            : 'border-slate-700 text-slate-300 hover:border-slate-500'}`}
                                                >
                                                    {roles.map((r) => (
                                                        <option key={r} value={r} className="bg-slate-900 text-white capitalize">
                                                            {r}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                                                    <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {isEdited ? (
                                                <div className="flex justify-end items-center space-x-2 animate-in slide-in-from-right-2">
                                                    <button
                                                        onClick={() => saveRoleUpdate(u._id)}
                                                        disabled={savingUserId === u._id}
                                                        className="p-2 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white rounded-lg transition-all"
                                                        title="Save Changes"
                                                    >
                                                        {savingUserId === u._id ? <div className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin rounded-full" /> : <Save size={16} />}
                                                    </button>
                                                    <button
                                                        onClick={() => cancelChange(u._id)}
                                                        className="p-2 bg-slate-700/50 text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-all"
                                                        title="Cancel"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-slate-600 text-xs italic font-medium">No changes</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Video Assignments section stays similar, but styled to match... */}
        </div>
    );
};

export default Admin;