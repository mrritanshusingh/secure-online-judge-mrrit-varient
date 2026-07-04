import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Editor } from '@monaco-editor/react';
import { Terminal, Code2, Zap, Shield, Play } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Landing() {
    const navigate = useNavigate();
    const [code, setCode] = useState('#include <iostream>\n\nint main() {\n    std::cout << "Compile. Execute. Dominate." << std::endl;\n    return 0;\n}');

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#020617] to-[#020617] text-slate-200 font-sans selection:bg-cyan-500/30">
            
            {/* Navbar */}
            <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-3">
                    <div className="bg-cyan-500/10 p-2 rounded-xl border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                        <Terminal className="w-6 h-6 text-cyan-400" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-slate-100">AlgoJudge</span>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/auth')} className="text-sm font-semibold text-slate-400 hover:text-cyan-400 transition-colors">Sign In</button>
                    <button onClick={() => navigate('/auth')} className="px-5 py-2.5 rounded-lg text-sm font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all">Get Started</button>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-8 pt-12 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                
                {/* Left: Copy & Value Prop */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider mb-6">
                            <Zap className="w-3.5 h-3.5" /> Agentic AI Mentor Live
                        </div>
                        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
                            Execute Code.<br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Without Limits.</span>
                        </h1>
                        <p className="mt-6 text-lg text-slate-400 leading-relaxed max-w-md">
                            A production-grade, secure sandbox environment. Evaluate multi-language submissions against hidden test suites instantly.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
                            <Shield className="w-5 h-5 text-emerald-400 mb-2" />
                            <h3 className="font-bold text-slate-200 text-sm">Docker Isolated</h3>
                            <p className="text-xs text-slate-500 mt-1">Air-gapped execution</p>
                        </div>
                        <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
                            <Code2 className="w-5 h-5 text-purple-400 mb-2" />
                            <h3 className="font-bold text-slate-200 text-sm">Socratic AI</h3>
                            <p className="text-xs text-slate-500 mt-1">Context-aware hints</p>
                        </div>
                    </div>
                </motion.div>

                {/* Right: Live Interactive Editor */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur opacity-20"></div>
                    <div className="relative bg-[#0c0c0e] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-[#09090b]">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                            </div>
                            <span className="text-xs font-mono text-slate-500">guest_runner.cpp</span>
                        </div>
                        <div className="h-[300px]">
                            <Editor
                                height="100%"
                                language="cpp"
                                theme="vs-dark"
                                value={code}
                                onChange={(val) => setCode(val)}
                                options={{ minimap: { enabled: false }, fontSize: 14, padding: { top: 16 } }}
                            />
                        </div>
                        <div className="p-4 bg-[#09090b] border-t border-slate-800">
                            <button onClick={() => navigate('/auth')} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-cyan-400 transition-all border border-cyan-500/30">
                                <Play className="w-4 h-4 fill-current" /> Initialize Sandbox
                            </button>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}