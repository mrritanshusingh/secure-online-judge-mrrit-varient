import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Trophy, ChevronLeft, Medal, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Leaderboard() {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await axios.get('/api/submit/leaderboard');
                setLeaders(res.data.leaderboard);
            } catch (error) {
                console.error("Failed to fetch leaderboard", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="min-h-screen bg-[#020617] text-slate-200 font-sans p-4 sm:p-8"
        >
            <div className="max-w-4xl mx-auto space-y-8">
                
                {/* Header Section */}
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-6">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate('/')}
                            className="p-2 rounded-xl border border-slate-800 bg-[#0c0c0e] text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all shadow-sm"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                                <Trophy className="w-7 h-7 text-cyan-400" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-extrabold text-white tracking-tight">Global Leaderboard</h1>
                                <p className="text-slate-500 text-sm mt-1 uppercase tracking-widest font-bold">Ranked by total systems cleared</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gamified Table */}
                <div className="bg-[#0c0c0e] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
                    {loading ? (
                        <div className="p-16 flex flex-col items-center justify-center gap-4">
                            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-slate-500 text-sm font-bold tracking-wide uppercase">Fetching global rankings...</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-800 bg-slate-900/40 text-slate-400 text-xs font-bold uppercase tracking-widest">
                                    <th className="px-6 py-5 w-24 text-center">Rank</th>
                                    <th className="px-6 py-5">Operative</th>
                                    <th className="px-6 py-5 text-right">Clear Count</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {leaders.map((user, idx) => {
                                    const isFirst = idx === 0;
                                    const isSecond = idx === 1;
                                    const isThird = idx === 2;
                                    
                                    return (
                                        <tr key={idx} className="hover:bg-slate-900/40 transition-all duration-200 group">
                                            <td className="px-6 py-5 text-center">
                                                {isFirst ? <Medal className="w-7 h-7 text-yellow-400 mx-auto drop-shadow-[0_0_10px_rgba(250,204,21,0.6)]" /> :
                                                 isSecond ? <Medal className="w-7 h-7 text-slate-300 mx-auto drop-shadow-[0_0_10px_rgba(212,212,216,0.4)]" /> :
                                                 isThird ? <Medal className="w-7 h-7 text-amber-600 mx-auto drop-shadow-[0_0_10px_rgba(217,119,6,0.6)]" /> :
                                                 <span className="text-slate-500 font-mono font-bold text-lg">#{idx + 1}</span>}
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className={`p-2.5 rounded-xl border ${isFirst ? 'bg-yellow-400/10 border-yellow-400/30' : isSecond ? 'bg-slate-300/10 border-slate-300/30' : isThird ? 'bg-amber-600/10 border-amber-600/30' : 'bg-slate-800/50 border-slate-700/50'}`}>
                                                        <User className={`w-4 h-4 ${isFirst ? 'text-yellow-400' : isSecond ? 'text-slate-300' : isThird ? 'text-amber-500' : 'text-slate-400'}`} />
                                                    </div>
                                                    <span className={`font-bold text-base tracking-wide ${isFirst ? 'text-yellow-400' : isSecond ? 'text-slate-300' : isThird ? 'text-amber-500' : 'text-slate-200'}`}>
                                                        {user.username}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                                                    <span className="font-mono text-xl font-bold text-cyan-400">
                                                        {user.solved}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {leaders.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Trophy className="w-8 h-8 text-slate-700 mb-2" />
                                                <p className="text-slate-400 font-medium">No operatives have cleared any systems yet.</p>
                                                <p className="text-slate-600 text-sm">Submit a solution to claim the #1 spot.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </motion.div>
    );
}