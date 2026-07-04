import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Trophy, Clock, Users, PlayCircle, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Contests() {
    const navigate = useNavigate();
    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContests = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const res = await axios.get('/api/contests', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setContests(res.data.contests || []);
            } catch (error) {
                console.error("Failed to fetch contests", error);
            } finally {
                setLoading(false);
            }
        };
        fetchContests();
    }, []);

    const now = new Date().getTime();
    
    const activeContests = contests.filter(c => {
        const start = new Date(c.startTime).getTime();
        const end = start + (c.durationMinutes * 60000);
        return start <= now && end > now;
    });
    
    const upcomingContests = contests.filter(c => {
        const start = new Date(c.startTime).getTime();
        return start > now;
    });
    
    const pastContests = contests.filter(c => {
        const start = new Date(c.startTime).getTime();
        const end = start + (c.durationMinutes * 60000);
        return end <= now;
    });

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-[#09090b] text-zinc-200 font-sans p-4 sm:p-8">
            <div className="max-w-5xl mx-auto space-y-8">
                
                <div className="flex items-center gap-4 border-b border-zinc-800/80 pb-6">
                    <button onClick={() => navigate('/')} className="p-2 rounded-xl border border-zinc-800 bg-[#0c0c0e] text-zinc-400 hover:text-white transition-all shadow-sm">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-100 tracking-tight flex items-center gap-2">
                            <Trophy className="w-6 h-6 text-amber-500" /> Contests
                        </h1>
                        <p className="text-zinc-500 text-sm mt-1 uppercase tracking-widest font-semibold">Compete live or warm up with past rounds.</p>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12 flex flex-col items-center gap-3">
                        <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-zinc-500 text-sm font-medium">Syncing global contest data...</span>
                    </div>
                ) : (
                    <div className="space-y-12">
                        
                        {/* LIVE NOW */}
                        <div>
                            <h2 className="text-xs font-bold text-rose-500 flex items-center gap-2 mb-4 tracking-widest uppercase">
                                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span> Live Now
                            </h2>
                            {activeContests.length > 0 ? activeContests.map(contest => (
                                <div key={contest._id} className="bg-rose-500/[0.02] border border-rose-500/20 rounded-2xl p-6 flex items-center justify-between shadow-lg shadow-rose-500/5">
                                    <div>
                                        <h3 className="text-xl font-bold text-zinc-100 mb-1">{contest.title}</h3>
                                        <p className="text-sm text-zinc-400 font-medium">{contest.durationMinutes} minutes • Rated</p>
                                    </div>
                                    <button 
                                        onClick={() => navigate(`/contest/${contest._id}`)}
                                        className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg font-bold text-sm transition-all flex items-center gap-2"
                                    >
                                        <PlayCircle className="w-4 h-4" /> Enter Arena
                                    </button>
                                </div>
                            )) : <p className="text-sm text-zinc-600 italic">No active contests.</p>}
                        </div>

                        {/* UPCOMING */}
                        <div>
                            <h2 className="text-xs font-bold text-zinc-400 mb-4 tracking-widest uppercase">Upcoming</h2>
                            {upcomingContests.length > 0 ? upcomingContests.map(contest => (
                                <div key={contest._id} className="bg-[#0c0c0e] border border-zinc-800 rounded-2xl p-6 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-zinc-200 mb-1">{contest.title}</h3>
                                        <p className="text-sm text-zinc-500 font-medium">Starts: {new Date(contest.startTime).toLocaleString()}</p>
                                        {contest.description && <p className="text-sm text-zinc-600 mt-2 italic">{contest.description}</p>}
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-zinc-500 flex items-center gap-1.5 text-sm font-bold">
                                            <Clock className="w-4 h-4" /> {contest.durationMinutes}m
                                        </div>
                                        <button 
                                            onClick={() => navigate(`/contest/${contest._id}`)}
                                            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-bold text-xs transition-all flex items-center gap-2"
                                        >
                                            <Lock className="w-3 h-3" /> Waiting Room
                                        </button>
                                    </div>
                                </div>
                            )) : <p className="text-sm text-zinc-600 italic">No upcoming contests scheduled.</p>}
                        </div>

                        {/* PAST */}
                        <div>
                            <h2 className="text-xs font-bold text-zinc-400 mb-4 tracking-widest uppercase">Past</h2>
                            {pastContests.length > 0 ? (
                                <div className="bg-[#0c0c0e] border border-zinc-800 rounded-2xl overflow-hidden">
                                    {pastContests.map((contest, idx) => (
                                        <div key={contest._id} className={`flex items-center justify-between p-6 hover:bg-zinc-900/30 transition-colors ${idx !== pastContests.length - 1 ? 'border-b border-zinc-800/50' : ''}`}>
                                            <div>
                                                <h3 className="text-base font-bold text-zinc-300 mb-1">{contest.title}</h3>
                                                <div className="flex items-center gap-4 text-xs text-zinc-500 font-medium">
                                                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {contest.durationMinutes}m</span>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => navigate(`/contest/${contest._id}`)}
                                                className="text-sm font-bold text-cyan-500 hover:text-cyan-400 transition-colors"
                                            >
                                                Enter Arena (Practice)
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-zinc-600 italic">No historical contests found.</p>
                            )}
                        </div>

                    </div>
                )}
            </div>
        </motion.div>
    );
}