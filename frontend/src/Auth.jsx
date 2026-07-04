import { useState } from 'react';
import axios from 'axios';
import { Terminal, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Auth({ setToken, setRole }) {
    const [isLogin, setIsLogin] = useState(true);
    const [authRole, setAuthRole] = useState('user');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validatePassword = (pass) => {
        return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(pass);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (!validateEmail(email)) {
            return setMessage("Invalid email format.");
        }
        if (!isLogin && !validatePassword(password)) {
            return setMessage("Password must be 8+ chars with a number and special character.");
        }

        setIsLoading(true);
        try {
            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
            const payload = isLogin ? { email, password } : { name, email, password, role: authRole };
            
            const res = await axios.post(endpoint, payload);
            
            if (isLogin) {
                // UPDATED: Save securely to sessionStorage
                sessionStorage.setItem('token', res.data.token);
                const userRole = res.data.status === 'admin' ? 'admin' : 'user';
                sessionStorage.setItem('role', userRole);
                
                setToken(res.data.token);
                setRole(userRole);
                navigate(userRole === 'admin' ? '/admin' : '/');
            } else {
                setMessage("🎉 System override successful! Please log in.");
                setIsLogin(true); 
                setPassword('');
            }
        } catch (error) {
            if (error.code === 'ERR_NETWORK') {
                setMessage("Network Error: Cannot reach the execution engine on port 8000.");
            } else {
                setMessage(error.response?.data?.message || "An unexpected error occurred");
            }
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#020617] to-[#020617] flex flex-col items-center justify-center p-4 font-sans selection:bg-cyan-500/30">
            <div className="text-center mb-8 flex flex-col items-center">
                <div className="bg-cyan-500/10 p-3 rounded-2xl mb-4 border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                    <Terminal className="w-8 h-8 text-cyan-400" />
                </div>
                <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">AlgoJudge</h1>
                <p className="text-cyan-600/80 mt-2 text-sm uppercase tracking-widest font-bold">Secure Execution Engine</p>
            </div>

            <div className="w-full max-w-md bg-[#0c0c0e] border border-slate-800 rounded-2xl p-8 shadow-2xl">
                <div className="flex mb-8 border-b border-slate-800">
                    <button onClick={() => { setIsLogin(true); setMessage(''); }} className={`flex-1 pb-4 text-sm font-bold transition-all ${isLogin ? 'text-cyan-400 border-b-2 border-cyan-500' : 'text-slate-500 hover:text-slate-300'}`}>
                        Authenticate
                    </button>
                    <button onClick={() => { setIsLogin(false); setMessage(''); }} className={`flex-1 pb-4 text-sm font-bold transition-all ${!isLogin ? 'text-cyan-400 border-b-2 border-cyan-500' : 'text-slate-500 hover:text-slate-300'}`}>
                        Initialize Account
                    </button>
                </div>

                {message && (
                    <div className={`flex items-center gap-2 p-4 mb-6 rounded-lg text-sm border font-medium ${message.includes('successful') ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                        {!message.includes('successful') && <AlertCircle className="w-4 h-4 shrink-0" />}
                        {message}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {!isLogin && (
                        <>
                            <div className="flex bg-[#09090b] p-1 rounded-xl border border-slate-800 mb-2">
                                <button type="button" onClick={() => setAuthRole('user')} className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${authRole === 'user' ? 'bg-cyan-500/15 text-cyan-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}>
                                    Developer
                                </button>
                                <button type="button" onClick={() => setAuthRole('admin')} className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${authRole === 'admin' ? 'bg-purple-500/15 text-purple-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}>
                                    Admin Console
                                </button>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-[#09090b] border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50 transition-all" placeholder="John Doe" />
                            </div>
                        </>
                    )}
                    
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-[#09090b] border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50 transition-all" placeholder="name@domain.com" />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-[#09090b] border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50 transition-all" placeholder="••••••••" />
                    </div>

                    <button type="submit" disabled={isLoading} className="w-full mt-6 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)] disabled:opacity-70">
                        {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                    </button>
                </form>
            </div>
        </div>
    );
}