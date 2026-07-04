import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, Clock, Code2, Lock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContestArena() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [contest, setContest] = useState(null);
    const [timeDisplay, setTimeDisplay] = useState('Calculating...');
    const [isStarted, setIsStarted] = useState(false);
    const [isEnded, setIsEnded] = useState(false);

    useEffect(() => {
        const fetchContest = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const res = await axios.get(`/api/contests/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                setContest(res.data.contest);
            } catch (error) {
                console.error("Failed to load arena");
            }
        };
        fetchContest();
    }, [id]);

    useEffect(() => {
        if (!contest) return;

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const start = new Date(contest.startTime).getTime();
            const end = start + (contest.durationMinutes * 60000);

            const formatTime = (ms) => {
                const h = Math.floor(ms / 3600000).toString().padStart(2, '0');
                const m = Math.floor((ms % 3600000) / 60000).toString().padStart(2, '0');
                const s = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0');
                return `${h}:${m}:${s}`;
            };

            if (now < start) {
                setIsStarted(false);
                setTimeDisplay(`Starts in: ${formatTime(start - now)}`);
            } else if (now >= start && now <= end) {
                if (!isStarted) setIsStarted(true); 
                setIsEnded(false);
                setTimeDisplay(`${formatTime(end - now)} Remaining`);
            } else {
                setIsStarted(true);
                setIsEnded(true);
                setTimeDisplay('Contest Concluded');
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [contest, isStarted]);

    if (!contest) return <div className="min-h-screen bg-[#09090b] flex justify-center items-center text-cyan-500 font-mono">Securing Arena Link...</div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-[#09090b] text-zinc-200 font-sans p-4 sm:p-8">
            <div className="max-w-5xl mx-auto space-y-8">
                
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-6">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/contests')} className="p-2 rounded-xl border border-zinc-800 bg-[#0c0c0e] text-zinc-400 hover:text-white transition-all shadow-sm">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">{contest.title}</h1>
                            <p className="text-zinc-500 text-sm mt-1">{contest.description}</p>
                        </div>
                    </div>
                    <div className={`px-6 py-3 rounded-xl border font-mono text-xl font-bold tracking-wider ${isEnded ? 'bg-zinc-900 border-zinc-800 text-zinc-500' : isStarted ? 'bg-rose-500/10 border-rose-500/30 text-rose-500 animate-pulse' : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'}`}>
                        {timeDisplay}
                    </div>
                </div>

                <div className="bg-[#0c0c0e] border border-zinc-800 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-zinc-800 bg-[#09090b]">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Problem Matrix</h3>
                    </div>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-zinc-900/50 text-zinc-400 text-xs font-bold uppercase tracking-wider border-b border-zinc-800">
                                <th className="px-6 py-4 w-16 text-center">#</th>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">Difficulty</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50 text-sm">
                            {contest.problems.map((prob, idx) => (
                                <tr key={prob._id} className="hover:bg-zinc-900/30 transition-colors">
                                    <td className="px-6 py-4 text-center font-mono font-bold text-zinc-500">{String.fromCharCode(65 + idx)}</td>
                                    <td className="px-6 py-4 font-bold text-zinc-300">
                                        {isStarted ? prob.title : <span className="text-zinc-600 flex items-center gap-2"><Lock className="w-4 h-4"/> Classfied Data</span>}
                                    </td>
                                    <td className="px-6 py-4">
                                        {isStarted ? (
                                            <span className={`px-2 py-1 bg-zinc-800 rounded text-xs font-bold ${prob.difficulty === 'Easy' ? 'text-emerald-400' : prob.difficulty === 'Medium' ? 'text-amber-400' : 'text-rose-400'}`}>{prob.difficulty}</span>
                                        ) : <span className="px-2 py-1 bg-zinc-900 rounded text-xs font-bold text-zinc-700">???</span>}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            disabled={!isStarted}
                                            onClick={() => navigate(`/problem/${prob._id}`)} 
                                            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                            Solve
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </motion.div>
    );
}