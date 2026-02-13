import React, { useState, useEffect, useMemo } from 'react';
import { User, Shield, GraduationCap, X, AlertTriangle, CheckCircle, Ban, Lock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';

/* -------------------------------------------------------------------------- */
/*                               Shared Components                            */
/* -------------------------------------------------------------------------- */

const StatusBadge = ({ status }) => {
    const styles = {
        active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
        blocked: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        suspended: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    };
    return (
        <span className={`px-2 py-1 rounded-lg text-xs font-bold uppercase ${styles[status] || styles.active}`}>
            {status}
        </span>
    );
};

const DataTable = ({ items, cols, empty, actions }) => {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const filtered = useMemo(() => {
        if (!search) return items;
        const lower = search.toLowerCase();
        return items.filter(it => cols.some(c => String(it[c.key] ?? "").toLowerCase().includes(lower)));
    }, [items, search, cols]);

    const totalPages = Math.ceil(filtered.length / pageSize);
    const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex justify-between items-center bg-white/40 backdrop-blur-sm p-3 rounded-xl border border-white/40 dark:bg-slate-900/40 dark:border-slate-800">
                <div className="relative w-full max-w-xs">
                    <input
                        className="w-full bg-transparent text-sm pl-4 pr-4 py-2 focus:outline-none dark:text-slate-200 placeholder:text-slate-500 border-b border-slate-300 dark:border-slate-700 focus:border-indigo-500 transition-colors"
                        placeholder="Search..."
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                    />
                </div>
                <div className="px-3 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    Total: {filtered.length}
                </div>
            </div>

            {/* Table */}
            <div className="glass-card overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-indigo-50/50 dark:bg-slate-800/50 border-b border-indigo-100 dark:border-slate-700">
                            <tr>
                                {cols.map((c) => (
                                    <th key={c.key} className="p-4 text-left font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider text-xs">
                                        {c.label}
                                    </th>
                                ))}
                                <th className="p-4 text-right font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider text-xs">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {paginated.length === 0 && (
                                <tr>
                                    <td className="p-8 text-center text-slate-500 dark:text-slate-400 italic" colSpan={cols.length + 1}>
                                        {search ? "No matches found" : empty}
                                    </td>
                                </tr>
                            )}
                            {paginated.map((it, idx) => (
                                <tr key={idx} className="hover:bg-indigo-50/40 transition-colors dark:hover:bg-slate-800/40">
                                    {cols.map((c) => (
                                        <td key={c.key} className="p-4 text-slate-700 dark:text-slate-300 font-medium">
                                            {c.render ? c.render(it[c.key], it) : (it[c.key] ?? "-")}
                                        </td>
                                    ))}
                                    <td className="p-4 text-right">
                                        {actions(it)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                    <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 text-xs font-semibold rounded-lg border disabled:opacity-50 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition">Prev</button>
                    <span className="px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 rounded-lg dark:bg-slate-800">Page {page} of {totalPages}</span>
                    <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-4 py-2 text-xs font-semibold rounded-lg border disabled:opacity-50 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition">Next</button>
                </div>
            )}
        </div>
    );
};

/* -------------------------------------------------------------------------- */
/*                              Block Modal                                   */
/* -------------------------------------------------------------------------- */

const BlockModal = ({ isOpen, onClose, user, onConfirm }) => {
    const [reason, setReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen || !user) return null;

    const handleConfirm = async () => {
        if (!reason.trim()) {
            toast.error("Please provide a reason.");
            return;
        }
        setIsSubmitting(true);
        await onConfirm(user, reason);
        setIsSubmitting(false);
        setReason("");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in duration-300">
                <div className="flex items-center gap-3 mb-4 text-red-600 dark:text-red-500">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                        <AlertTriangle className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold">Block User Access</h3>
                </div>

                <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Are you sure you want to block <strong>{user.name}</strong> ({user.u_id})? This will immediately respond their session.
                </p>

                <div className="mb-6">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Reason for blocking <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none dark:bg-slate-800 dark:text-white"
                        rows="3"
                        placeholder="e.g., Violation of policy, unpaid fees..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition">Cancel</button>
                    <button
                        onClick={handleConfirm}
                        disabled={isSubmitting}
                        className="px-4 py-2 rounded-xl text-sm font-bold bg-red-600 text-white hover:bg-red-700 transition shadow-lg shadow-red-600/20 flex items-center gap-2 disabled:opacity-70"
                    >
                        {isSubmitting ? "Blocking..." : <><Ban className="h-4 w-4" /> Confirm Block</>}
                    </button>
                </div>
            </div>
        </div>
    );
};


/* -------------------------------------------------------------------------- */
/*                              Main Component                                */
/* -------------------------------------------------------------------------- */

const UserManagement = ({ api, currentUserRole }) => {
    const [activeTab, setActiveTab] = useState('faculty');
    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [blockTarget, setBlockTarget] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, [activeTab]);

    const fetchUsers = async () => {
        setLoading(true);
        const data = await api.getUsers(activeTab);
        if (data.error) {
            toast.error(data.error);
            if (data.error.includes("Permission")) {
                // maybe redirect or show empty
                setUserList([]);
            }
        } else {
            setUserList(data || []);
        }
        setLoading(false);
    };

    const handleBlock = (user) => {
        setBlockTarget(user);
    };

    const confirmBlock = async (user, reason) => {
        const res = await api.blockUser(activeTab, user.u_id, reason);
        if (res.ok) {
            toast.success(`${user.name} has been blocked.`);
            fetchUsers(); // Refresh
        } else {
            toast.error(res.error || "Failed to block user");
        }
    };

    const handleUnblock = async (user) => {
        if (!window.confirm(`Unblock ${user.name}? This will restore access immediately.`)) return;

        const res = await api.unblockUser(activeTab, user.u_id);
        if (res.ok) {
            toast.success(`${user.name} has been unblocked.`);
            fetchUsers();
        } else {
            toast.error(res.error || "Failed to unblock user");
        }
    };

    const cols = [
        { key: 'u_id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> },
    ];

    const renderActions = (user) => {
        // Logic: 
        // Admin cannot block Admin (handled backend but good to hide button)
        // Super Admin can block anyone except self? Backend handles exact logic

        const isBlocked = user.status === 'blocked';

        if (isBlocked) {
            return (
                <button
                    onClick={() => handleUnblock(user)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition border border-emerald-200"
                >
                    <CheckCircle className="h-3 w-3" /> Unblock
                </button>
            );
        }

        return (
            <button
                onClick={() => handleBlock(user)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-red-600 hover:bg-red-50 transition border border-red-200 shadow-sm"
            >
                <Ban className="h-3 w-3" /> Block
            </button>
        );
    };

    return (
        <div className="space-y-6">

            {/* Header & Tabs */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Shield className="h-6 w-6 text-indigo-600" /> User Management
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400">Manage user access and block permissions.</p>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
                <button
                    onClick={() => setActiveTab('faculty')}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'faculty' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600'}`}
                >
                    <User className="h-4 w-4" /> Faculty
                </button>
                <button
                    onClick={() => setActiveTab('student')}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'student' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600'}`}
                >
                    <GraduationCap className="h-4 w-4" /> Students
                </button>

                {currentUserRole === 'super_admin' && (
                    <button
                        onClick={() => setActiveTab('admin')}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'admin' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600'}`}
                    >
                        <Shield className="h-4 w-4" /> Admins
                    </button>
                )}
            </div>


            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <DataTable
                        items={userList}
                        cols={cols}
                        actions={renderActions}
                        empty={`No ${activeTab} records found.`}
                    />
                </div>
            )}

            <BlockModal
                isOpen={!!blockTarget}
                onClose={() => setBlockTarget(null)}
                user={blockTarget}
                onConfirm={confirmBlock}
            />
        </div>
    );
};

export default UserManagement;
