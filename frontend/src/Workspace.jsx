import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Editor } from '@monaco-editor/react';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronLeft, Code2, Sparkles, Terminal, Play, History, FileText, Sun, Moon, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function Workspace() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [problem, setProblem] = useState(null);
    const [code, setCode] = useState("#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    \n    return 0;\n}");
    const [verdict, setVerdict] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [theme, setTheme] = useState('vs-dark');
    const [failCount, setFailCount] = useState(0);
    const [aiHint, setAiHint] = useState(null);
    const [isHintLoading, setIsHintLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('description'); 
    const [history, setHistory] = useState([]);
    const [language, setLanguage] = useState('cpp');
    
    const boilerplates = {
        cpp: "#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your C++ code here\n    \n    return 0;\n}",
        c: "#include <stdio.h>\n\nint main() {\n    // Write your C code here\n    \n    return 0;\n}",
        java: "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your Java code here\n        \n    }\n}",
        python: "def solve():\n    # Write your Python code here\n    pass\n\nif __name__ == '__main__':\n    solve()"
    };

    const handleLanguageChange = (e) => {
        const newLang = e.target.value;
        setLanguage(newLang);
        setCode(boilerplates[newLang]); 
    };

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const res = await axios.get('/api/problems');
                const currentProblem = res.data.problems.find(p => p._id === id);
                setProblem(currentProblem);
            } catch (error) {
                console.error("Error fetching problem:", error);
            }
        };
        fetchProblem();
    }, [id]);

    const submitCode = async () => {
        setIsSubmitting(true);
        setVerdict(null);
        setAiHint(null); 
        
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('/api/submit', {
                language: language,
                problemId: id,
                code: code
            }, {
                headers: { Authorization: `Bearer ${token}` } 
            });
            
            setVerdict(res.data);

            if (res.data.success) {
                setFailCount(0); 
                toast.success("Accepted! Excellent work.");
            } else if (res.data.verdict === "Wrong Answer") {
                setFailCount(prev => prev + 1); 
                toast.error("Wrong Answer. Check your logic!");
            }
        } catch (error) {
            if (error.response?.status === 401) {
                setVerdict({ success: false, verdict: "Authentication Error", error: "You must be logged in to submit code." });
                toast.error("You must be logged in to submit.");
            } else {
                setVerdict(error.response?.data || { success: false, error: "Server Error" });
                toast.error("Compilation or Server Error");
            }
        }
        setIsSubmitting(false);
    };

    const requestHint = async () => {
        setIsHintLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('/api/submit/hint', {
                problemId: id,
                userCode: code,
                failedTestCase: {
                    input: verdict.input, 
                    expectedOutput: verdict.expected,
                    actualOutput: verdict.received
                }
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAiHint(response.data.hint);
        } catch (error) {
            console.error("Failed to fetch hint", error);
            setAiHint("I'm having trouble connecting to the AI right now. Are you logged in?");
        } finally {
            setIsHintLoading(false);
        }
    };

    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return; 
            const res = await axios.get(`/api/submit/history/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHistory(res.data.submissions);
        } catch (error) {
            console.error("Failed to fetch history:", error);
        }
    };

    useEffect(() => {
        if (activeTab === 'submissions') {
            fetchHistory();
        }
    }, [activeTab, verdict]);

    if (!problem) return (
        <div className="h-screen bg-[#09090b] flex items-center justify-center gap-3">
            <svg className="animate-spin h-6 w-6 text-violet-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-zinc-500 text-sm font-medium">Booting secure testing container...</p>
        </div>
    );

    return (
        <div className="h-screen bg-[#09090b] flex flex-col text-zinc-200 overflow-hidden font-sans">
            
            {/* Top Minimal Workspace Navbar */}
            <header className="h-14 border-b border-zinc-800/80 bg-[#0c0c0e] px-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/')}
                        className="p-1.5 rounded-lg border border-zinc-800 bg-[#09090b] text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40 transition-all"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="h-4 w-px bg-zinc-800" />
                    <h1 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-violet-400" />
                        {problem.title}
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setTheme(theme === 'vs-dark' ? 'light' : 'vs-dark')}
                        className="p-2 rounded-lg border border-zinc-800 bg-[#09090b] text-zinc-400 hover:text-zinc-200 transition-all"
                    >
                        {theme === 'vs-dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </button>

                    <select 
                        value={language} 
                        onChange={handleLanguageChange}
                        className="bg-[#09090b] border border-zinc-800 rounded-lg px-3 py-1.5 text-xs font-semibold text-zinc-200 focus:outline-none focus:border-violet-500/50 cursor-pointer"
                    >
                        <option value="cpp">C++ 17</option>
                        <option value="c">C Compiler</option>
                        <option value="java">Java LTS</option>
                        <option value="python">Python 3.x</option>
                    </select>
                </div>
            </header>

            {/* Main Application Split View */}
            <div className="flex-1 flex overflow-hidden w-full">
                
                {/* LEFT PANEL: Context Description & Submissions */}
                <div className="w-1/2 flex flex-col border-r border-zinc-800/80 bg-[#09090b]">
                    {/* Panel Tabs Header */}
                    <div className="flex border-b border-zinc-800/80 bg-[#0c0c0e]/50 px-4 shrink-0">
                        <button 
                            onClick={() => setActiveTab('description')}
                            className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold tracking-wide transition-all border-b-2 ${activeTab === 'description' ? 'text-violet-400 border-violet-500 bg-violet-500/[0.02]' : 'text-zinc-500 border-transparent hover:text-zinc-300'}`}
                        >
                            <FileText className="w-3.5 h-3.5" />
                            Description
                        </button>
                        <button 
                            onClick={() => setActiveTab('submissions')}
                            className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold tracking-wide transition-all border-b-2 ${activeTab === 'submissions' ? 'text-violet-400 border-violet-500 bg-violet-500/[0.02]' : 'text-zinc-500 border-transparent hover:text-zinc-300'}`}
                        >
                            <History className="w-3.5 h-3.5" />
                            Submissions
                        </button>
                    </div>

                    {/* Dynamic Left Panel Content Scroll Box */}
                    <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                        {activeTab === 'description' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-zinc-100">{problem.title}</h2>
                                    <div className="mt-3">
                                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                                            problem.difficulty === 'Easy' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' :
                                            problem.difficulty === 'Medium' ? 'bg-amber-500/5 border-amber-500/20 text-amber-400' :
                                            'bg-rose-500/5 border-rose-500/20 text-rose-400'
                                        }`}>
                                            {problem.difficulty}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="prose prose-invert max-w-none text-zinc-300 text-sm leading-relaxed space-y-4">
                                    <ReactMarkdown 
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            code({node, inline, className, children, ...props}) {
                                                return (
                                                    <code className="bg-zinc-800/60 px-1.5 py-0.5 rounded font-mono text-xs text-violet-400 border border-zinc-700/40" {...props}>
                                                        {children}
                                                    </code>
                                                )
                                            },
                                            pre({node, children, ...props}) {
                                                return (
                                                    <pre className="bg-[#0c0c0e] border border-zinc-800 p-4 rounded-xl font-mono text-xs overflow-x-auto my-4 text-zinc-300" {...props}>
                                                        {children}
                                                    </pre>
                                                )
                                            }
                                        }}
                                    >
                                        {problem.description}
                                    </ReactMarkdown>
                                </div>

                                {problem.examples && problem.examples.length > 0 && (
                                    <div className="space-y-4 pt-4 border-t border-zinc-800/60">
                                        <h3 className="text-sm font-bold tracking-wider uppercase text-zinc-400">Example Walkthroughs</h3>
                                        {problem.examples.map((ex, index) => (
                                            <div key={index} className="bg-[#0c0c0e] border border-zinc-800/80 rounded-xl p-4 font-mono text-xs space-y-1.5 border-l-2 border-l-violet-500/60">
                                                <div className="text-zinc-400"><strong className="text-zinc-100 font-semibold">Input:</strong> {ex.input}</div>
                                                <div className="text-zinc-400"><strong className="text-zinc-100 font-semibold">Output:</strong> {ex.output}</div>
                                                {ex.explanation && (
                                                    <div className="text-zinc-500 mt-2 italic"><strong className="text-zinc-300 font-semibold not-italic">Explanation:</strong> {ex.explanation}</div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'submissions' && (
                            <div className="space-y-4">
                                <h2 className="text-base font-bold text-zinc-100">Verification History</h2>
                                {history.length === 0 ? (
                                    <p className="text-zinc-600 text-sm italic">No execution footprints found inside this runtime sector.</p>
                                ) : (
                                    <div className="border border-zinc-800 rounded-xl bg-[#0c0c0e] overflow-hidden">
                                        <table className="w-full text-left text-xs border-collapse">
                                            <thead>
                                                <tr className="border-b border-zinc-800 bg-zinc-900/10 text-zinc-500 font-semibold uppercase">
                                                    <th className="p-4">Engine Status</th>
                                                    <th className="p-4">Language</th>
                                                    <th className="p-4 text-right">Timestamp</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-zinc-800/60 font-medium">
                                                {history.map((sub, idx) => (
                                                    <tr key={idx} className="hover:bg-zinc-900/20">
                                                        <td className={`p-4 font-bold ${sub.verdict === 'Accepted' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                            {sub.verdict}
                                                        </td>
                                                        <td className="p-4 text-zinc-400 font-mono">{sub.language}</td>
                                                        <td className="p-4 text-zinc-500 text-right font-mono">
                                                            {new Date(sub.createdAt).toLocaleDateString()}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT PANEL: MONACO WORKSPACE & LIVE VERDICT FEED */}
                <div className="w-1/2 flex flex-col bg-[#0c0c0e]">
                    
                    {/* Code Editor Interactive Workspace */}
                    <div className="flex-1 min-h-0 relative border-b border-zinc-800">
                        <Editor
                            height="100%"
                            language={language === 'c' ? 'cpp' : language}
                            theme={theme}
                            value={code}
                            onChange={(value) => setCode(value)}
                            options={{ 
                                minimap: { enabled: false }, 
                                fontSize: 14, 
                                padding: { top: 16 }, 
                                scrollBeyondLastLine: false,
                                fontFamily: 'ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace'
                            }}
                        />
                    </div>

                    {/* Operational Console Panel */}
                    <div className="p-4 bg-[#09090b] space-y-4 shrink-0">
                        <button 
                            onClick={submitCode} 
                            disabled={isSubmitting}
                            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all text-white ${isSubmitting ? 'bg-zinc-800 cursor-not-allowed text-zinc-500' : 'bg-violet-600 hover:bg-violet-500 shadow-lg shadow-violet-600/10'}`}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-zinc-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Running Verification Assertions...</span>
                                </>
                            ) : (
                                <>
                                    <Play className="w-3.5 h-3.5 fill-current" />
                                    <span>Submit to Evaluation Engine</span>
                                </>
                            )}
                        </button>

                        {/* Engine Verdict Feed */}
                        {verdict && (
                            <div className={`rounded-xl border p-4 text-xs font-medium ${verdict.success ? 'bg-emerald-500/[0.02] border-emerald-500/20' : 'bg-rose-500/[0.02] border-rose-500/20'}`}>
                                <div className="flex items-center gap-2 mb-2">
                                    {verdict.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
                                    <h3 className={`text-sm font-bold ${verdict.success ? 'text-emerald-400' : 'text-rose-400'}`}>{verdict.verdict}</h3>
                                </div>
                                {verdict.message && <p className="text-zinc-300 font-medium leading-relaxed">{verdict.message}</p>}
                                {verdict.error && <pre className="font-mono text-zinc-400 bg-[#0c0c0e] border border-zinc-800 p-3 rounded-lg overflow-x-auto mt-2 text-[11px] leading-normal">{typeof verdict.error === 'object' ? JSON.stringify(verdict.error, null, 2) : verdict.error}</pre>}
                                
                                {verdict.expected && (
                                    <div className="mt-3 pt-3 border-t border-zinc-800/60 font-mono text-zinc-400 space-y-1">
                                        <div className="text-zinc-500 uppercase tracking-wider text-[10px] font-bold mb-1">Mismatched Segment Trace</div>
                                        <div><strong className="text-zinc-300 font-semibold">Input Buffer:</strong> {verdict.input}</div>
                                        <div><strong className="text-rose-400/80 font-semibold">Expected Return:</strong> {verdict.expected}</div>
                                        <div><strong className="text-zinc-400 font-semibold">Runtime Received:</strong> {verdict.received}</div>
                                    </div>
                                )}

                                {/* AI MENTOR COMPONENT INTERACTION PANEL */}
                                {failCount >= 2 && !aiHint && verdict.verdict === "Wrong Answer" && (
                                    <button 
                                        onClick={requestHint}
                                        disabled={isHintLoading}
                                        className="w-full mt-4 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold bg-[#0c0c0e] hover:bg-zinc-900 border border-violet-500/30 text-violet-400 shadow-md transition-all duration-150"
                                    >
                                        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                                        {isHintLoading ? "Analyzing logical traces..." : "Consult Agentic Socratic Code Mentor"}
                                    </button>
                                )}

                                {/* Socratic AI Hint Output Widget */}
                                {aiHint && (
                                    <div className="mt-4 border border-violet-500/20 rounded-xl bg-gradient-to-b from-violet-950/20 to-transparent p-4 relative overflow-hidden shadow-inner shadow-violet-500/[0.02]">
                                        <div className="flex items-center gap-2 mb-2 border-b border-zinc-800 pb-2">
                                            <Sparkles className="w-4 h-4 text-violet-400" />
                                            <span className="font-bold text-violet-300 tracking-wide uppercase text-[10px]">Agentic Code Mentor</span>
                                        </div>
                                        <p className="text-zinc-300 leading-relaxed font-mono text-[11px] whitespace-pre-wrap">{aiHint}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                
            </div>
        </div>
    );
}