import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Search, Trophy, User, Plus, LogOut, Code2, Layers, CheckCircle, BarChart } from 'lucide-react';

export default function Dashboard({ handleLogout }) {
    const [problems, setProblems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const res = await axios.get('/api/problems');
                setProblems(res.data.problems);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching problems:", error);
                toast.error("Error fetching problems!");
                setLoading(false);
            }
        };
        fetchProblems();
    }, []);

    const logout = () => {
        handleLogout();
        toast.success("Logged out successfully");
    };

    const filteredProblems = problems.filter(problem => 
        problem.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Dynamic counts for metrics panels
    const easyCount = problems.filter(p => p.difficulty === 'Easy').length;
    const mediumCount = problems.filter(p => p.difficulty === 'Medium').length;
    const hardCount = problems.filter(p => p.difficulty === 'Hard').length;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="min-h-screen bg-[#09090b] text-zinc-100 font-sans antialiased"
        >
            {/* Premium Sticky Navigation Bar */}
            <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-[#09090b]/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="bg-violet-500/10 p-2 rounded-xl border border-violet-500/20">
                            <Code2 className="w-5 h-5 text-violet-400" />
                        </div>
                        <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                            AlgoJudge
                        </span>
                    </div>

                    <nav className="flex items-center gap-2">
                        <button 
                            onClick={() => navigate('/add-problem')}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border border-zinc-800 bg-[#0c0c0e] hover:bg-zinc-800/50 text-zinc-300 transition-all"
                        >
                            <Plus className="w-4 h-4 text-violet-400" />
                            <span>Create</span>
                        </button>
                        <button 
                            onClick={() => navigate('/leaderboard')}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border border-zinc-800 bg-[#0c0c0e] hover:bg-zinc-800/50 text-zinc-300 transition-all"
                        >
                            <Trophy className="w-4 h-4 text-amber-400" />
                            <span>Leaderboard</span>
                        </button>
                        <button 
                            onClick={() => navigate('/profile')}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border border-zinc-800 bg-[#0c0c0e] hover:bg-zinc-800/50 text-zinc-300 transition-all"
                        >
                            <User className="w-4 h-4 text-emerald-400" />
                            <span>Profile</span>
                        </button>
                        <div className="w-px h-5 bg-zinc-800 mx-1" />
                        <button 
                            onClick={logout}
                            className="p-2 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/5 transition-all"
                            title="Sign Out"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </nav>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Dashboard Meta Banner */}
                <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-zinc-100">Problem Repository</h2>
                        <p className="text-zinc-500 mt-1 text-sm">Review, debug, and clear automated hidden verification frameworks.</p>
                    </div>

                    {/* Clean Utility Search Container */}
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input 
                            type="text"
                            placeholder="Search code problems..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#0c0c0e] border border-zinc-800/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/40 transition-all"
                        />
                    </div>
                </div>

                {/* Dashboard Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-[#0c0c0e] border border-zinc-800/60 p-5 rounded-2xl flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Total Systems</p>
                            <h3 className="text-2xl font-bold mt-1 text-zinc-200">{problems.length}</h3>
                        </div>
                        <div className="p-3 rounded-xl bg-violet-500/5 border border-violet-500/10 text-violet-400"><Layers className="w-5 h-5" /></div>
                    </div>
                    <div className="bg-[#0c0c0e] border border-zinc-800/60 p-5 rounded-2xl flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Easy Core</p>
                            <h3 className="text-2xl font-bold mt-1 text-emerald-400">{easyCount}</h3>
                        </div>
                        <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-400"><CheckCircle className="w-5 h-5" /></div>
                    </div>
                    <div className="bg-[#0c0c0e] border border-zinc-800/60 p-5 rounded-2xl flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Medium Tier</p>
                            <h3 className="text-2xl font-bold mt-1 text-amber-400">{mediumCount}</h3>
                        </div>
                        <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 text-amber-400"><BarChart className="w-5 h-5" /></div>
                    </div>
                    <div className="bg-[#0c0c0e] border border-zinc-800/60 p-5 rounded-2xl flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Hard Protocol</p>
                            <h3 className="text-2xl font-bold mt-1 text-rose-400">{hardCount}</h3>
                        </div>
                        <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/10 text-rose-400"><Trophy className="w-5 h-5" /></div>
                    </div>
                </div>

                {/* Primary Data Table */}
                {loading ? (
                    <div className="w-full bg-[#0c0c0e] border border-zinc-800/60 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3">
                        <svg className="animate-spin h-6 w-6 text-violet-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-zinc-500 text-sm">Syncing secure data tables...</p>
                    </div>
                ) : (
                    <div className="w-full bg-[#0c0c0e] border border-zinc-800/60 rounded-2xl overflow-hidden shadow-lg">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-zinc-800 bg-zinc-900/20 text-zinc-400 text-xs font-semibold uppercase tracking-wider">
                                    <th className="px-6 py-4">Problem Set Title</th>
                                    <th className="px-6 py-4">Complexity Matrix</th>
                                    <th className="px-6 py-4 text-right">Execution</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/60 text-sm">
                                {filteredProblems.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-12 text-center text-zinc-500">
                                            No matching algorithm files located.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProblems.map((problem) => (
                                        <tr 
                                            key={problem._id}
                                            className="group hover:bg-zinc-900/30 transition-all duration-150"
                                        >
                                            <td className="px-6 py-4 font-medium text-zinc-200 group-hover:text-white transition-colors">
                                                {problem.title}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                                                    problem.difficulty === 'Easy' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' :
                                                    problem.difficulty === 'Medium' ? 'bg-amber-500/5 border-amber-500/20 text-amber-400' :
                                                    'bg-rose-500/5 border-rose-500/20 text-rose-400'
                                                }`}>
                                                    {problem.difficulty}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button 
                                                    onClick={() => navigate(`/problem/${problem._id}`)}
                                                    className="inline-flex items-center justify-center px-4 py-1.5 rounded-lg text-xs font-semibold bg-zinc-100 hover:bg-white text-zinc-900 transition-all shadow-sm"
                                                >
                                                    Solve
                                                </button>
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