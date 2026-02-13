import React, { useMemo } from 'react';
import {
    BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';
import { motion } from 'framer-motion';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#10b981', '#f59e0b', '#06b6d4'];

const Card = ({ title, children, className = "" }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={`rounded-2xl border border-slate-200/50 bg-white p-6 shadow-lg hover:shadow-xl transition-all dark:bg-slate-900 dark:border-slate-700 ${className}`}
    >
        <h3 className="mb-6 font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
            {title}
        </h3>
        <div className="w-full" style={{ height: '350px' }}>{children}</div>
    </motion.div>
);

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-xl border border-slate-200 bg-white/95 backdrop-blur-sm p-4 shadow-2xl dark:bg-slate-800/95 dark:border-slate-600">
                <p className="font-bold text-slate-800 dark:text-slate-100 mb-2">{label}</p>
                {payload.map((p, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm mt-1">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                        <span className="text-slate-600 dark:text-slate-300 capitalize font-medium">{p.name}:</span>
                        <span className="font-bold text-slate-900 dark:text-slate-50">{p.value}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

// --- Student Dashboard ---
export const StudentDashboard = ({ stats }) => {
    console.log('StudentDashboard received stats:', stats);
    if (!stats) return null;
    const { attendance_percentage, avg_marks, recent_attendance, total_exams } = stats;

    const attendPieData = useMemo(() => [
        { name: 'Present', value: Math.round(attendance_percentage), fill: '#10b981' },
        { name: 'Absent', value: Math.round(100 - attendance_percentage), fill: '#ef4444' }
    ], [attendance_percentage]);

    console.log('Pie data:', attendPieData);
    console.log('Recent attendance:', recent_attendance);

    return (
        <div className="space-y-6">
            {/* Top Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard label="Attendance" value={`${attendance_percentage}%`} color="text-emerald-600" bgColor="bg-emerald-50 dark:bg-emerald-900/20" />
                <MetricCard label="Avg Marks" value={`${avg_marks}%`} color="text-violet-600" bgColor="bg-violet-50 dark:bg-violet-900/20" />
                <MetricCard label="Exams Taken" value={total_exams} color="text-blue-600" bgColor="bg-blue-50 dark:bg-blue-900/20" />
                <MetricCard label="Performance" value="Good" color="text-amber-600" bgColor="bg-amber-50 dark:bg-amber-900/20" />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Attendance Pie Chart */}
                <Card title="📊 Attendance Overview">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={attendPieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={110}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {attendPieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>

                {/* Recent Attendance Line Chart */}
                <Card title="📈 Attendance Trend (Last 7 Days)">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={recent_attendance && recent_attendance.map(r => ({
                            date: r.date.split(' ')[0].slice(5),
                            attendance: r.status.toLowerCase() === 'present' ? 100 : 0,
                            status: r.status
                        }))}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis
                                dataKey="date"
                                stroke="#64748b"
                                style={{ fontSize: '12px' }}
                            />
                            <YAxis
                                domain={[0, 100]}
                                stroke="#64748b"
                                style={{ fontSize: '12px' }}
                            />
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const status = payload[0].payload.status;
                                        return (
                                            <div className="rounded-xl bg-white/95 backdrop-blur-sm p-3 shadow-xl border border-slate-200 dark:bg-slate-800/95 dark:border-slate-600">
                                                <p className="font-semibold text-slate-800 dark:text-slate-100">{payload[0].payload.date}</p>
                                                <div className={`mt-2 px-3 py-1 rounded-lg text-sm font-bold ${status.toLowerCase() === 'present' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'}`}>
                                                    {status.toUpperCase()}
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="attendance"
                                stroke="#6366f1"
                                strokeWidth={3}
                                dot={{ fill: '#6366f1', r: 6 }}
                                activeDot={{ r: 8 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>
            </div>
        </div>
    );
};

// --- Teacher Dashboard ---
export const TeacherDashboard = ({ stats }) => {
    if (!stats) return null;
    const { total_students, classes_count, class_performance } = stats;

    const avgPerformance = class_performance.length > 0
        ? Math.round(class_performance.reduce((acc, c) => acc + c.avg_marks, 0) / class_performance.length)
        : 0;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
                <MetricCard label="Total Students" value={total_students} color="text-blue-600" bgColor="bg-blue-50 dark:bg-blue-900/20" />
                <MetricCard label="Classes Assigned" value={classes_count} color="text-purple-600" bgColor="bg-purple-50 dark:bg-purple-900/20" />
                <MetricCard label="Avg Performance" value={`${avgPerformance}%`} color="text-emerald-600" bgColor="bg-emerald-50 dark:bg-emerald-900/20" />
            </div>

            <Card title="📚 Class Performance by Subject">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={class_performance} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis
                            dataKey="subject"
                            angle={-45}
                            textAnchor="end"
                            height={100}
                            stroke="#64748b"
                            style={{ fontSize: '12px' }}
                        />
                        <YAxis
                            domain={[0, 100]}
                            stroke="#64748b"
                            style={{ fontSize: '12px' }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="avg_marks" name="Average Marks" radius={[8, 8, 0, 0]} barSize={50}>
                            {class_performance.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </Card>
        </div>
    );
};

// --- Admin Dashboard ---
export const AdminDashboard = ({ stats }) => {
    if (!stats) return null;
    const { attendance_distribution, total_students, total_teachers, attendance_rate } = stats;

    // Create gauge-like data for attendance rate
    const gaugeData = [
        { name: 'Rate', value: attendance_rate, fill: attendance_rate > 75 ? '#10b981' : attendance_rate > 50 ? '#f59e0b' : '#ef4444' },
        { name: 'Remaining', value: 100 - attendance_rate, fill: '#e2e8f0' }
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard label="Total Students" value={total_students} color="text-blue-600" bgColor="bg-blue-50 dark:bg-blue-900/20" />
                <MetricCard label="Total Faculty" value={total_teachers} color="text-purple-600" bgColor="bg-purple-50 dark:bg-purple-900/20" />
                <MetricCard label="Attendance Rate" value={`${attendance_rate}%`} color={attendance_rate > 75 ? 'text-emerald-600' : 'text-amber-600'} bgColor={attendance_rate > 75 ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-amber-50 dark:bg-amber-900/20'} />
                <MetricCard label="System Status" value="Healthy" color="text-emerald-600" bgColor="bg-emerald-50 dark:bg-emerald-900/20" />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Donut Chart for Attendance Rate */}
                <Card title="🎯 Overall Attendance Rate">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={gaugeData}
                                cx="50%"
                                cy="50%"
                                startAngle={90}
                                endAngle={-270}
                                innerRadius={80}
                                outerRadius={120}
                                paddingAngle={2}
                                dataKey="value"
                            >
                                {gaugeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-5xl font-bold fill-slate-800 dark:fill-slate-100">
                                {attendance_rate}%
                            </text>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>

                {/* Attendance Distribution */}
                <Card title="📊 Attendance Distribution">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={attendance_distribution} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis
                                dataKey="name"
                                stroke="#64748b"
                                style={{ fontSize: '14px', fontWeight: '600' }}
                            />
                            <YAxis
                                stroke="#64748b"
                                style={{ fontSize: '12px' }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="value" name="Count" radius={[10, 10, 0, 0]} barSize={80}>
                                {attendance_distribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.name === 'Present' ? '#10b981' : '#ef4444'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>
        </div>
    );
};



// Helper
const MetricCard = ({ label, value, color = "text-slate-900", bgColor = "bg-slate-50 dark:bg-slate-800" }) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        className={`rounded-xl border border-slate-200/50 ${bgColor} p-5 shadow-sm hover:shadow-md transition-all dark:border-slate-700`}
    >
        <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-2">{label}</div>
        <div className={`text-3xl font-extrabold ${color}`}>{value}</div>
    </motion.div>
);
