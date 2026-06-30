import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ActivityCalendar } from 'react-activity-calendar';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { ChevronLeft, Target, Flame, Activity, CheckCircle2, XCircle, Code2 } from 'lucide-react';
import { motion } from 'framer-motion';

const CircularProgress = ({ label, solved, total, colorClass, strokeClass }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const safeTotal = total > 0 ? total : 1; 
    const strokeDashoffset = circumference - (solved / safeTotal) * circumference;

    return (
        <div className="flex flex-col items-center">
            <div className="relative flex items-center justify-center">
                <svg width="120" height="120" viewBox="0 0 100 100" className="transform -rotate-90">
                    <circle cx="50" cy="50" r={radius} className="stroke-zinc-800" strokeWidth="8" fill="none" />
                    <circle 
                        cx="50" cy="50" r={radius} 
                        className={`${strokeClass} transition-all duration-1000 ease-out`}
                        strokeWidth="8" fill="none" 
                        strokeDasharray={circumference} 
                        strokeDashoffset={strokeDashoffset} 
                        strokeLinecap="round" 
                    />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-lg font-bold text-zinc-100">{solved}<span className="text-zinc-500 text-sm">/{total}</span></span>
                </div>
            </div>
            <span className={`mt-3 text-xs font-bold uppercase tracking-wider ${colorClass}`}>{label}</span>
        </div>
    );
};

export default function Profile() {
    const navigate = useNavigate();
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/');
                    return;
                }
                const res = await axios.get('/api/submit/metrics', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMetrics(res.data);
            } catch (error) {
                console.error("Failed to fetch metrics", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMetrics();
    }, [navigate]);

    if (loading) return (
        <div className="min-h-screen bg-[#09090b] flex items-center justify-center gap-3">
            <svg className="animate-spin h-6 w-6 text-violet-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-zinc-500 text-sm font-medium">Compiling developer telemetry...</p>
        </div>
    );
    
    if (!metrics) return <div className="min-h-screen bg-[#09090b] text-rose-400 flex items-center justify-center font-mono">Error loading telemetry data.</div>;

    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="min-h-screen bg-[#09090b] text-zinc-200 font-sans p-4 sm:p-8"
        >
            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-6">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate('/')}
                            className="p-2 rounded-xl border border-zinc-800 bg-[#0c0c0e] text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-all"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Developer Profile</h1>
                            <p className="text-zinc-500 text-sm mt-1">Performance analytics and submission telemetry</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* LEFT COLUMN: Stats & Heatmap */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Circular Progress Row */}
                        <div className="bg-[#0c0c0e] border border-zinc-800/60 p-8 rounded-2xl flex justify-around items-center shadow-lg">
                            <CircularProgress label="Easy" solved={metrics.solved.easy} total={metrics.solved.totalEasy} colorClass="text-emerald-400" strokeClass="stroke-emerald-500" />
                            <CircularProgress label="Medium" solved={metrics.solved.medium} total={metrics.solved.totalMedium} colorClass="text-amber-400" strokeClass="stroke-amber-500" />
                            <CircularProgress label="Hard" solved={metrics.solved.hard} total={metrics.solved.totalHard} colorClass="text-rose-400" strokeClass="stroke-rose-500" />
                        </div>

                        {/* Top Level Meta Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-emerald-500/[0.03] border border-emerald-500/20 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                                <Target className="w-6 h-6 text-emerald-400 mb-3" />
                                <div className="text-3xl font-bold text-emerald-400">{metrics.acceptanceRate}%</div>
                                <div className="text-xs font-semibold text-emerald-500/70 mt-1 uppercase tracking-wider">Acceptance Rate</div>
                            </div>
                            <div className="bg-[#0c0c0e] border border-zinc-800/60 p-6 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm">
                                <Activity className="w-6 h-6 text-violet-400 mb-3" />
                                <div className="text-3xl font-bold text-zinc-100">{metrics.submissions.total}</div>
                                <div className="text-xs font-semibold text-zinc-500 mt-1 uppercase tracking-wider">Total Commits</div>
                            </div>
                            <div className="bg-[#0c0c0e] border border-zinc-800/60 p-6 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm">
                                <Flame className="w-6 h-6 text-amber-500 mb-3" />
                                <div className="text-3xl font-bold text-zinc-100">{metrics.solved.easy + metrics.solved.medium + metrics.solved.hard}</div>
                                <div className="text-xs font-semibold text-zinc-500 mt-1 uppercase tracking-wider">Systems Cleared</div>
                            </div>
                        </div>

                        {/* Heatmap Area */}
                        <div className="bg-[#0c0c0e] border border-zinc-800/60 p-8 rounded-2xl shadow-lg overflow-x-auto">
                            <h3 className="text-sm font-bold text-zinc-100 mb-6 uppercase tracking-wider flex items-center gap-2">
                                <Code2 className="w-4 h-4 text-violet-400" />
                                Activity Heatmap
                            </h3>
                            <ActivityCalendar 
                                data={metrics.heatmapData} 
                                blockSize={14}     
                                blockMargin={5}
                                colorScheme="dark"
                                theme={{
                                    dark: ['#18181b', '#4c1d95', '#6d28d9', '#8b5cf6', '#a78bfa'], // Cool violet theme
                                }}
                                labels={{
                                    totalCount: '{{count}} verification commits in the last year',
                                }}
                                renderBlock={(block, activity) => 
                                    React.cloneElement(block, {
                                        'data-tooltip-id': 'heatmap-tooltip',
                                        'data-tooltip-content': `${activity.count} submissions on ${new Date(activity.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`,
                                    })
                                }
                            />
                            <ReactTooltip 
                                id="heatmap-tooltip" 
                                className="!bg-[#0c0c0e] !text-zinc-300 !border !border-zinc-800 !rounded-lg !px-3 !py-2 !text-xs !shadow-xl"
                            />
                        </div>

                    </div>

                    {/* RIGHT COLUMN: Recent Submissions Feed */}
                    <div className="bg-[#0c0c0e] border border-zinc-800/60 p-6 rounded-2xl shadow-lg flex flex-col h-[800px]">
                        <h3 className="text-sm font-bold text-zinc-100 mb-6 uppercase tracking-wider border-b border-zinc-800 pb-4">Activity Log</h3>
                        
                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
                            {metrics.recentSubmissions.length === 0 ? (
                                <p className="text-zinc-600 text-sm text-center mt-10 italic">No telemetry data recorded.</p>
                            ) : (
                                metrics.recentSubmissions.map((sub) => (
                                    <div key={sub.id} className="bg-[#09090b] border border-zinc-800/60 p-4 rounded-xl flex flex-col gap-2 hover:border-zinc-700 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <strong className="text-zinc-200 text-sm">{sub.problemTitle}</strong>
                                            <span className="text-zinc-500 text-[10px] font-mono">{new Date(sub.timestamp).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center mt-2">
                                            <div className="flex items-center gap-1.5">
                                                {sub.verdict === 'Accepted' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <XCircle className="w-3.5 h-3.5 text-rose-500" />}
                                                <span className={`text-xs font-bold ${sub.verdict === 'Accepted' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                    {sub.verdict}
                                                </span>
                                            </div>
                                            <span className="bg-zinc-800/50 text-zinc-400 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border border-zinc-700/50">
                                                {sub.language}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </motion.div>
    );
}