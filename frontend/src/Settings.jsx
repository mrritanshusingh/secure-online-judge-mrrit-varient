import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Settings2, Save, ShieldAlert, Key, User, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function Settings() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const validatePassword = (pass) => {
        if (!pass) return true; 
        return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(pass);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        
        if (password && password !== confirmPassword) {
            return toast.error("Passwords do not match.");
        }
        if (password && !validatePassword(password)) {
            return toast.error("Password must be 8+ chars, including a number and special character.");
        }
        if (!name && !email && !password) {
            return toast.error("No changes detected.");
        }

        setIsSaving(true);
        try {
            const token = sessionStorage.getItem('token');
            const payload = {};
            if (name) payload.name = name;
            if (email) payload.email = email;
            if (password) payload.password = password;

            const res = await axios.put('/api/auth/profile', payload, { headers: { Authorization: `Bearer ${token}` } });

            if (res.data.success) {
                toast.success("Profile updated successfully.");
                setName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error updating profile.");
        }
        setIsSaving(false);
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-[#020617] text-slate-200 font-sans p-4 sm:p-8">
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="flex items-center gap-4 border-b border-slate-800/80 pb-6">
                    <button onClick={() => navigate(-1)} className="p-2 rounded-xl border border-slate-800 bg-[#0c0c0e] text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-extrabold text-white tracking-tight">Settings</h1>
                        <p className="text-slate-500 text-sm mt-1 font-bold uppercase tracking-widest">Manage your account and preferences</p>
                    </div>
                </div>

                <div className="bg-[#0c0c0e] border border-slate-800 rounded-2xl p-8 shadow-2xl">
                    <form onSubmit={handleUpdate} className="space-y-8">
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
                                <User className="w-4 h-4 text-cyan-400" /> Profile Details
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Full Name</label>
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[#020617] border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-cyan-500/50 transition-all" placeholder="Update Name" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Email Address</label>
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#020617] border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-cyan-500/50 transition-all" placeholder="Update Email" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 pt-4">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
                                <Key className="w-4 h-4 text-purple-400" /> Security
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">New Password</label>
                                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#020617] border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-purple-500/50 transition-all" placeholder="••••••••" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Confirm New Password</label>
                                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-[#020617] border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-purple-500/50 transition-all" placeholder="••••••••" />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-800">
                            <button type="submit" disabled={isSaving} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm bg-cyan-600 hover:bg-cyan-500 text-white transition-all disabled:opacity-70">
                                <Save className="w-4 h-4" /> {isSaving ? "Saving Changes..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </motion.div>
    );
}