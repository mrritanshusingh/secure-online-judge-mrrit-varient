import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Search, Trophy, User, LogOut, Code2, Layers, CheckCircle2, BarChart } from 'lucide-react';

export default function Dashboard({ handleLogout }) {
    const [problems, setProblems] = useState([]);
    const [solvedSet, setSolvedSet] = useState(new Set());
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = sessionStorage.getItem('token');
                
                const [probRes, solvedRes] = await Promise.all([
                    axios.get('/api/problems'),
                    token ? axios.get('/api/submit/solved', { headers: { Authorization: `Bearer ${token}` } }) : { data: { solved: [] } }
                ]);

                setProblems(probRes.data.problems);
                if (solvedRes.data.success) {
                    setSolvedSet(new Set(solvedRes.data.solved));
                }
                setLoading(false);
            } catch (error) {
                toast.error("Error fetching data!");
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const publicProblems = problems.filter(p => p.visibility !== 'ContestOnly' && p.visibility !== 'Hidden');
    const filteredProblems = publicProblems.filter(problem => 
        problem.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const easyCount = publicProblems.filter(p => p.difficulty === 'Easy').length;
    const mediumCount = publicProblems.filter(p => p.difficulty === 'Medium').length;
    const hardCount = publicProblems.filter(p => p.difficulty === 'Hard').length;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-[#020617] text-slate-100 font-sans antialiased">
            <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#020617]/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="bg-cyan-500/10 p-2 rounded-xl border border-cyan-500/20"><Code2 className="w-5 h-5 text-cyan-400" /></div>
                        <span className="font-bold text-lg tracking-tight text-white">AlgoJudge</span>
                    </div>
                    <nav className="flex items-center gap-3">
                        <button onClick={() => navigate('/contests')} className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold border border-slate-800 bg-[#0c0c0e] hover:bg-slate-800/50 text-slate-300 hover:text-white transition-all">
                            <Trophy className="w-4 h-4 text-amber-400" /><span>Contests</span>
                        </button>
                        <button onClick={() => navigate('/leaderboard')} className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold border border-slate-800 bg-[#0c0c0e] hover:bg-slate-800/50 text-slate-300 hover:text-white transition-all">
                            <Layers className="w-4 h-4 text-purple-400" /><span>Leaderboard</span>
                        </button>
                        <button onClick={() => navigate('/profile')} className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold border border-slate-800 bg-[#0c0c0e] hover:bg-slate-800/50 text-slate-300 hover:text-white transition-all">
                            <User className="w-4 h-4 text-emerald-400" /><span>Profile</span>
                        </button>
                        <div className="w-px h-5 bg-slate-800 mx-1" />
                        <button onClick={handleLogout} className="p-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-rose-400 hover:bg-rose-500/5 transition-all"><LogOut className="w-4.5 h-4.5" /></button>
                    </nav>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div>
                        <h2 className="text-3xl font-extrabold tracking-tight text-white">Problems</h2>
                        <p className="text-slate-400 mt-1 text-sm">Browse, practice, and solve coding challenges.</p>
                    </div>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input type="text" placeholder="Search problems..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-[#0c0c0e] border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/40 transition-all" />
                    </div>
                </div>

                {loading ? (
                    <div className="w-full bg-[#0c0c0e] border border-slate-800 rounded-2xl p-16 text-center flex flex-col items-center justify-center gap-3 shadow-lg">
                        <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-slate-500 text-sm font-medium">Syncing execution files...</p>
                    </div>
                ) : (
                    <div className="w-full bg-[#0c0c0e] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-800 bg-slate-900/30 text-slate-400 text-xs font-bold uppercase tracking-wider">
                                    <th className="px-6 py-4.5">Status</th>
                                    <th className="px-6 py-4.5">Title</th>
                                    <th className="px-6 py-4.5">Difficulty</th>
                                    <th className="px-6 py-4.5 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50 text-sm">
                                {filteredProblems.length === 0 ? (
                                    <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-500 font-medium italic">No problems found.</td></tr>
                                ) : (
                                    filteredProblems.map((problem) => (
                                        <tr key={problem._id} className="group hover:bg-slate-900/30 transition-all duration-150">
                                            {/* NEW: Solved Status Indicator */}
                                            <td className="px-6 py-4">
                                                {solvedSet.has(problem._id) ? (
                                                    <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                                                        <CheckCircle2 className="w-4 h-4" /> Solved
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-600 text-xs font-bold">—</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-slate-300 group-hover:text-cyan-400 transition-colors">
                                                {problem.title}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                                                    problem.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' :
                                                    problem.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400' :
                                                    'bg-rose-500/10 text-rose-400'
                                                }`}>{problem.difficulty}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button onClick={() => navigate(`/problem/${problem._id}`)} className="inline-flex items-center justify-center px-4 py-1.5 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white transition-all shadow-md shadow-cyan-600/10">Attempt</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </motion.div>
    );
}