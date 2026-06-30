import { useState } from 'react';
import axios from 'axios';
import { Terminal } from 'lucide-react';

export default function Auth({ setToken }) {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
            const payload = isLogin ? { email, password } : { name, email, password };
            
            const res = await axios.post(endpoint, payload);
            
            if (isLogin) {
                localStorage.setItem('token', res.data.token);
                setToken(res.data.token);
            } else {
                setMessage("🎉 Signup successful! Please log in.");
                setIsLogin(true); 
                setPassword('');
            }
        } catch (error) {
            setMessage(error.response?.data?.message || "An error occurred");
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-4 font-sans selection:bg-violet-500/30">
            
            {/* Branding Header */}
            <div className="text-center mb-8 flex flex-col items-center">
                <div className="bg-violet-500/10 p-3 rounded-2xl mb-4 border border-violet-500/20">
                    <Terminal className="w-8 h-8 text-violet-500" />
                </div>
                <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">AlgoJudge</h1>
                <p className="text-zinc-500 mt-2 text-sm uppercase tracking-widest font-semibold">Secure Execution Engine</p>
            </div>

            {/* Main Auth Card */}
            <div className="w-full max-w-md bg-[#0c0c0e] border border-zinc-800/60 rounded-2xl p-8 shadow-[0_0_40px_rgba(139,92,246,0.05)]">
                
                {/* Tabs */}
                <div className="flex mb-8 border-b border-zinc-800">
                    <button 
                        onClick={() => { setIsLogin(true); setMessage(''); }} 
                        className={`flex-1 pb-4 text-sm font-medium transition-all ${isLogin ? 'text-violet-400 border-b-2 border-violet-500' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        Sign In
                    </button>
                    <button 
                        onClick={() => { setIsLogin(false); setMessage(''); }} 
                        className={`flex-1 pb-4 text-sm font-medium transition-all ${!isLogin ? 'text-violet-400 border-b-2 border-violet-500' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        Create Account
                    </button>
                </div>

                {/* Alert Box */}
                {message && (
                    <div className={`p-4 mb-6 rounded-lg text-sm border ${message.includes('successful') ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                        {message}
                    </div>
                )}
                
                {/* Auth Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {!isLogin && (
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-zinc-400 ml-1">Full Name</label>
                            <input 
                                type="text" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                required 
                                className="w-full bg-[#09090b] border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
                                placeholder="John Doe"
                            />
                        </div>
                    )}
                    
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-zinc-400 ml-1">Email Address</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            className="w-full bg-[#09090b] border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
                            placeholder="name@example.com"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-zinc-400 ml-1">Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            className="w-full bg-[#09090b] border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full mt-4 bg-zinc-100 hover:bg-white text-zinc-900 font-semibold py-3 rounded-lg text-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-zinc-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Authenticating...
                            </>
                        ) : (isLogin ? 'Sign In' : 'Create Account')}
                    </button>
                </form>
            </div>
        </div>
    );
}