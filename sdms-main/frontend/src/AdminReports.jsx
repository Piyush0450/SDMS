import React, { useState, useEffect, useMemo } from 'react';
import { FileText, Download, Filter, Calendar, BarChart3, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
    PieChart, Pie, LineChart, Line, Legend
} from 'recharts';

/* -------------------------------------------------------------------------- */
/*                               Shared Components                            */
/* -------------------------------------------------------------------------- */

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#10b981', '#f59e0b', '#06b6d4'];

const DataTable = ({ items, cols, empty }) => {
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
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {paginated.length === 0 && (
                                <tr>
                                    <td className="p-8 text-center text-slate-500 dark:text-slate-400 italic" colSpan={cols.length}>
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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

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
/*                              Main Component                                */
/* -------------------------------------------------------------------------- */

const AdminReports = ({ api }) => {
    const [activeTab, setActiveTab] = useState('attendance');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [chartsData, setChartsData] = useState(null);

    // Date Filters for Registrations
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        fetchReport();
    }, [activeTab, startDate, endDate]);

    useEffect(() => {
        // Load chart data once
        api.getCharts().then(res => {
            if (!res.error) setChartsData(res);
        });
    }, []);

    const fetchReport = async () => {
        setLoading(true);
        try {
            let res;
            if (activeTab === 'attendance') {
                res = await api.getAttendanceReport();
            } else if (activeTab === 'performance') {
                res = await api.getPerformanceReport();
            } else if (activeTab === 'registrations') {
                res = await api.getRegistrationsReport(startDate, endDate);
            }

            if (Array.isArray(res)) {
                setData(res);
            } else {
                console.error("Invalid report data:", res);
                setData([]);
            }
        } catch (e) {
            console.error("Failed to fetch report", e);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = (format) => {
        if (format === 'csv') {
            window.location.href = api.getExportUrl(activeTab) + `?start_date=${startDate}&end_date=${endDate}`;
        } else if (format === 'print') {
            window.print();
        } else if (format === 'excel') {
            // Simulating Excel by downloading CSV with .xls extension handled by backend or just CSV
            // Re-using CSV endpoint as Excel can open it.
            window.location.href = api.getExportUrl(activeTab) + `?start_date=${startDate}&end_date=${endDate}`;
        }
    };

    const attendanceCols = [
        { key: 'u_id', label: 'Student ID' },
        { key: 'name', label: 'Name' },
        { key: 'total_classes', label: 'Total Classes' },
        { key: 'present', label: 'Present' },
        { key: 'absent', label: 'Absent' },
        {
            key: 'percentage', label: 'Attendance %', render: (val) => (
                <span className={`px-2 py-1 rounded-lg text-xs font-bold ${val >= 75 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' : val >= 50 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30' : 'bg-red-100 text-red-700 dark:bg-red-900/30'}`}>
                    {val}%
                </span>
            )
        },
    ];

    const performanceCols = [
        { key: 'u_id', label: 'Student ID' },
        { key: 'name', label: 'Name' },
        {
            key: 'subject_marks', label: 'Marks Breakdown', render: (val) => (
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{val}</span>
            )
        },
        { key: 'total_obtained', label: 'Total Obtained' },
        { key: 'total_max', label: 'Total Max' },
        { key: 'percentage', label: 'Percentage', render: (val) => `${val}%` },
        {
            key: 'grade', label: 'Grade', render: (val) => (
                <span className={`px-2 py-1 rounded-lg text-xs font-bold ${val === 'A' ? 'bg-emerald-100 text-emerald-700' : val === 'B' ? 'bg-blue-100 text-blue-700' : val === 'C' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                    {val}
                </span>
            )
        },
    ];

    const registrationCols = [
        { key: 'u_id', label: 'Student ID' },
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'created_at', label: 'Reg. Date', render: (val) => val },
    ];

    return (
        <div className="space-y-8 print:p-0">

            {/* --- Graphical Representations --- */}
            {chartsData && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:hidden">
                    {/* Bar Chart: Students per Subject */}
                    <div className="glass-card p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <h3 className="font-bold mb-4 flex items-center gap-2"><BarChart3 className="h-5 w-5 text-indigo-500" /> Students per Course</h3>
                        <div className="h-48">
                            <ResponsiveContainer>
                                <BarChart data={chartsData.bar_data}>
                                    <XAxis dataKey="subject" fontSize={10} angle={-45} textAnchor="end" height={50} />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Pie Chart: Attendance */}
                    <div className="glass-card p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <h3 className="font-bold mb-4 flex items-center gap-2"><PieChartIcon className="h-5 w-5 text-emerald-500" /> Attendance Dist.</h3>
                        <div className="h-48">
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie data={chartsData.pie_data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
                                        {chartsData.pie_data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.name === 'Present' ? '#10b981' : '#ef4444'} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Line Chart: Registrations */}
                    <div className="glass-card p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <h3 className="font-bold mb-4 flex items-center gap-2"><TrendingUp className="h-5 w-5 text-blue-500" /> Monthly Registrations</h3>
                        <div className="h-48">
                            <ResponsiveContainer>
                                <LineChart data={chartsData.line_data}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                    <XAxis dataKey="month" fontSize={12} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {/* Header & Tabs */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">System Reports</h2>
                    <p className="text-slate-500 dark:text-slate-400">Export and analyze system data.</p>
                </div>

                <div className="flex gap-2 print:hidden">

                    <button onClick={() => handleExport('csv')} className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition font-semibold text-sm">
                        <Download className="h-4 w-4" /> CSV
                    </button>
                    <button onClick={() => handleExport('excel')} className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition font-semibold text-sm">
                        <FileText className="h-4 w-4" /> Excel
                    </button>
                    <button onClick={() => handleExport('print')} className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition font-semibold text-sm">
                        <FileText className="h-4 w-4" /> PDF / Print
                    </button>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit print:hidden">
                <button
                    onClick={() => setActiveTab('attendance')}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'attendance' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600'}`}
                >
                    Attendance Report
                </button>
                <button
                    onClick={() => setActiveTab('performance')}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'performance' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600'}`}
                >
                    Performance Report
                </button>
                <button
                    onClick={() => setActiveTab('registrations')}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'registrations' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600'}`}
                >
                    Date-wise Registrations
                </button>
            </div>

            {/* Filters for Registration */}
            {activeTab === 'registrations' && (
                <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 w-fit animate-in slide-in-from-top-2">
                    <span className="text-sm font-bold text-slate-500 flex items-center gap-2"><Calendar className="h-4 w-4" /> Date Range:</span>
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="border rounded-lg px-2 py-1 text-sm dark:bg-slate-800 dark:border-slate-700" />
                    <span className="text-slate-400">-</span>
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="border rounded-lg px-2 py-1 text-sm dark:bg-slate-800 dark:border-slate-700" />
                </div>
            )}

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {activeTab === 'attendance' && (
                        <DataTable items={data} cols={attendanceCols} empty="No attendance records found." />
                    )}
                    {activeTab === 'performance' && (
                        <DataTable items={data} cols={performanceCols} empty="No performance records found." />
                    )}
                    {activeTab === 'registrations' && (
                        <DataTable items={data} cols={registrationCols} empty="No students found in this date range." />
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminReports;
