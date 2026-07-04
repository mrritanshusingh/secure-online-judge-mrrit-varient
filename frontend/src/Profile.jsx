import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ActivityCalendar } from 'react-activity-calendar';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { ChevronLeft, Mail, Trophy, Activity, Code2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Profile() {
    const navigate = useNavigate();
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const token = sessionStorage.getItem('token');
                if (!token) return navigate('/');
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

    if (loading) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-cyan-400 font-mono">Loading Profile...</div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-[#020617] text-slate-200 font-sans p-4 sm:p-8">
            <div className="max-w-6xl mx-auto space-y-6">
                
                {/* Upper User Card (No Pic, Real Details) */}
                <div className="bg-[#0c0c0e] border border-slate-800 rounded-2xl overflow-hidden relative shadow-2xl">
                    <div className="h-24 bg-gradient-to-r from-cyan-900 to-purple-900 w-full relative">
                        <button onClick={() => navigate('/')} className="absolute top-4 left-4 p-2 rounded-lg bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-all">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="px-8 pb-8 pt-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-extrabold text-white">{metrics.user.name}</h1>
                                <p className="text-cyan-400 text-sm font-bold mt-1">Pupil • Rating {metrics.user.currentRating}</p>
                                <div className="flex gap-6 mt-4 text-sm text-slate-400 font-medium">
                                    <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {metrics.user.email}</span>
                                </div>
                            </div>
                            <button onClick={() => navigate('/settings')} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-bold transition-colors border border-slate-700">Edit Profile</button>
                        </div>

                        {/* Top Level Summary Stats */}
                        <div className="flex gap-4 mt-8">
                            <div className="flex-1 bg-[#020617] border border-slate-800 p-4 rounded-xl text-center">
                                <div className="text-2xl font-bold text-slate-200">{metrics.user.currentRating}</div>
                                <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Rating</div>
                            </div>
                            <div className="flex-1 bg-[#020617] border border-slate-800 p-4 rounded-xl text-center">
                                <div className="text-2xl font-bold text-slate-200">{metrics.solved.easy + metrics.solved.medium + metrics.solved.hard}</div>
                                <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Solved</div>
                            </div>
                            <div onClick={() => navigate('/contests')} className="flex-1 bg-[#020617] border border-cyan-500/30 p-4 rounded-xl text-center cursor-pointer hover:bg-cyan-900/10 transition-colors">
                                <div className="flex justify-center mb-1"><Trophy className="w-6 h-6 text-cyan-400" /></div>
                                <div className="text-xs text-cyan-400 font-bold uppercase tracking-widest mt-1">View Contests</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Dynamic Graphs */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Rating Chart */}
                        <div className="bg-[#0c0c0e] border border-slate-800 p-6 rounded-2xl shadow-lg">
                            <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Rating Over Time</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={metrics.ratingData}>
                                        <XAxis dataKey="month" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 50', 'dataMax + 50']} />
                                        <RechartsTooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '8px' }} />
                                        <Line type="monotone" dataKey="rating" stroke="#06b6d4" strokeWidth={3} dot={{ fill: '#06b6d4', strokeWidth: 2 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Heatmap */}
                        <div className="bg-[#0c0c0e] border border-slate-800 p-8 rounded-2xl shadow-lg overflow-x-auto">
                            <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Submission Activity</h3>
                            <ActivityCalendar 
                                data={metrics.heatmapData} 
                                blockSize={14}     
                                blockMargin={5}
                                colorScheme="dark"
                                theme={{ dark: ['#0f172a', '#0891b2', '#06b6d4', '#22d3ee', '#67e8f9'] }}
                            />
                        </div>
                    </div>

                    {/* Right: Solved Stats */}
                    <div className="space-y-6">
                        <div className="bg-[#0c0c0e] border border-slate-800 p-6 rounded-2xl shadow-lg">
                            <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Problems Solved</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1 font-bold">
                                        <span className="text-emerald-400">Easy</span>
                                        <span className="text-slate-300">{metrics.solved.easy} / {metrics.solved.totalEasy}</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500" style={{ width: `${(metrics.solved.easy / (metrics.solved.totalEasy || 1)) * 100}%` }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1 font-bold">
                                        <span className="text-amber-400">Medium</span>
                                        <span className="text-slate-300">{metrics.solved.medium} / {metrics.solved.totalMedium}</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-amber-500" style={{ width: `${(metrics.solved.medium / (metrics.solved.totalMedium || 1)) * 100}%` }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1 font-bold">
                                        <span className="text-rose-400">Hard</span>
                                        <span className="text-slate-300">{metrics.solved.hard} / {metrics.solved.totalHard}</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-rose-500" style={{ width: `${(metrics.solved.hard / (metrics.solved.totalHard || 1)) * 100}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}