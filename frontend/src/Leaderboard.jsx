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
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="min-h-screen bg-[#09090b] text-zinc-200 font-sans p-4 sm:p-8"
        >
            <div className="max-w-4xl mx-auto space-y-8">
                
                {/* Header Section */}
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-6">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate('/')}
                            className="p-2 rounded-xl border border-zinc-800 bg-[#0c0c0e] text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-all shadow-sm"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                                <Trophy className="w-7 h-7 text-amber-500" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Global Leaderboard</h1>
                                <p className="text-zinc-500 text-sm mt-1 uppercase tracking-widest font-semibold">Ranked by total systems cleared</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gamified Leaderboard Table */}
                <div className="bg-[#0c0c0e] border border-zinc-800/60 rounded-2xl shadow-xl overflow-hidden">
                    {loading ? (
                        <div className="p-16 flex flex-col items-center justify-center gap-4">
                            <svg className="animate-spin h-8 w-8 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p className="text-zinc-500 text-sm font-semibold tracking-wide uppercase">Fetching global rankings...</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-zinc-800 bg-zinc-900/40 text-zinc-500 text-xs font-bold uppercase tracking-widest">
                                    <th className="px-6 py-5 w-24 text-center">Rank</th>
                                    <th className="px-6 py-5">Operative</th>
                                    <th className="px-6 py-5 text-right">Clear Count</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/60">
                                {leaders.map((user, idx) => {
                                    const isFirst = idx === 0;
                                    const isSecond = idx === 1;
                                    const isThird = idx === 2;
                                    
                                    return (
                                        <tr key={idx} className="hover:bg-zinc-900/30 transition-all duration-200 group">
                                            <td className="px-6 py-5 text-center">
                                                {isFirst ? <Medal className="w-7 h-7 text-yellow-400 mx-auto drop-shadow-[0_0_10px_rgba(250,204,21,0.6)]" /> :
                                                 isSecond ? <Medal className="w-7 h-7 text-zinc-300 mx-auto drop-shadow-[0_0_10px_rgba(212,212,216,0.4)]" /> :
                                                 isThird ? <Medal className="w-7 h-7 text-amber-600 mx-auto drop-shadow-[0_0_10px_rgba(217,119,6,0.6)]" /> :
                                                 <span className="text-zinc-500 font-mono font-bold text-lg">#{idx + 1}</span>}
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className={`p-2.5 rounded-xl border ${isFirst ? 'bg-yellow-400/10 border-yellow-400/30' : isSecond ? 'bg-zinc-300/10 border-zinc-300/30' : isThird ? 'bg-amber-600/10 border-amber-600/30' : 'bg-zinc-800/50 border-zinc-700/50'}`}>
                                                        <User className={`w-4 h-4 ${isFirst ? 'text-yellow-400' : isSecond ? 'text-zinc-300' : isThird ? 'text-amber-500' : 'text-zinc-400'}`} />
                                                    </div>
                                                    <span className={`font-bold text-base tracking-wide ${isFirst ? 'text-yellow-400' : isSecond ? 'text-zinc-300' : isThird ? 'text-amber-500' : 'text-zinc-200'}`}>
                                                        {user.username}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                                    <span className="font-mono text-xl font-bold text-emerald-400">
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
                                                <Trophy className="w-8 h-8 text-zinc-700 mb-2" />
                                                <p className="text-zinc-400 font-medium">No operatives have cleared any systems yet.</p>
                                                <p className="text-zinc-600 text-sm">Submit a solution to claim the #1 spot.</p>
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