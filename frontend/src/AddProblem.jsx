import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Save, Database, ShieldAlert, Code2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AddProblem() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        difficulty: 'Easy',
        tags: '', 
        description: '',
        examples: [{ input: '', output: '', explanation: '' }],
        testCases: [{ input: '', expectedOutput: '' }]
    });
    const [status, setStatus] = useState('');

    const handleExampleChange = (index, field, value) => {
        const newExamples = [...formData.examples];
        newExamples[index][field] = value;
        setFormData({ ...formData, examples: newExamples });
    };

    const addExample = () => {
        setFormData({ ...formData, examples: [...formData.examples, { input: '', output: '', explanation: '' }] });
    };

    const handleTestCaseChange = (index, field, value) => {
        const newTestCases = [...formData.testCases];
        newTestCases[index][field] = value;
        setFormData({ ...formData, testCases: newTestCases });
    };

    const addTestCase = () => {
        setFormData({ ...formData, testCases: [...formData.testCases, { input: '', expectedOutput: '' }] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Saving...');
        try {
            const token = localStorage.getItem('token'); 

            const formattedTags = formData.tags
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag !== '');

            const payload = {
                ...formData,
                tags: formattedTags
            };
            
            await axios.post('/api/problems', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStatus('✅ Problem created successfully!');
            setTimeout(() => navigate('/'), 1500);
        } catch (error) {
            setStatus('❌ Error creating problem.');
            console.error(error);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="min-h-screen bg-[#09090b] text-zinc-200 font-sans p-4 sm:p-8"
        >
            <div className="max-w-3xl mx-auto">
                
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button 
                        onClick={() => navigate('/')}
                        className="p-2 rounded-xl border border-zinc-800 bg-[#0c0c0e] text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-all shadow-sm"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-100 tracking-tight flex items-center gap-2">
                            <Database className="w-6 h-6 text-violet-400" />
                            Problem Configuration
                        </h1>
                        <p className="text-zinc-500 text-sm mt-1 uppercase tracking-widest font-semibold">Admin Engine Deployment</p>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-[#0c0c0e] border border-zinc-800/60 rounded-2xl p-6 sm:p-8 shadow-xl">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        
                        {/* Basic Info Section */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Problem Title</label>
                                <input 
                                    type="text" 
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    className="w-full bg-[#09090b] border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-700 focus:outline-none focus:border-violet-500/50 transition-all"
                                    placeholder="e.g. Reverse Linked List"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Difficulty</label>
                                    <select 
                                        value={formData.difficulty}
                                        onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                                        className="w-full bg-[#09090b] border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-violet-500/50 transition-all cursor-pointer"
                                    >
                                        <option value="Easy">Easy</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Hard">Hard</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Tags (Comma Separated)</label>
                                    <input 
                                        type="text" 
                                        value={formData.tags}
                                        onChange={(e) => setFormData({...formData, tags: e.target.value})}
                                        className="w-full bg-[#09090b] border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-700 focus:outline-none focus:border-violet-500/50 transition-all"
                                        placeholder="e.g. Array, Dynamic Programming"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2 flex items-center gap-2">
                                    <Code2 className="w-4 h-4 text-zinc-400" />
                                    Markdown Description
                                </label>
                                <textarea 
                                    required
                                    rows="8"
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    className="w-full bg-[#09090b] border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-700 focus:outline-none focus:border-violet-500/50 transition-all custom-scrollbar resize-y"
                                    placeholder="Write the problem statement here. Markdown is fully supported..."
                                />
                            </div>
                        </div>

                        {/* Public Examples Section */}
                        <div className="border-t border-zinc-800/80 pt-8">
                            <h3 className="text-sm font-bold text-zinc-100 mb-4 uppercase tracking-wider">Public Examples</h3>
                            <div className="space-y-4">
                                {formData.examples.map((ex, index) => (
                                    <div key={index} className="bg-[#09090b] border border-zinc-800/60 rounded-xl p-4 space-y-3 relative">
                                        <div className="absolute top-0 right-0 bg-zinc-800 text-zinc-400 text-[10px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-xl uppercase">Example {index + 1}</div>
                                        <input type="text" placeholder="Input (e.g., nums = [2,7,11,15], target = 9)" value={ex.input} onChange={(e) => handleExampleChange(index, 'input', e.target.value)} className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-violet-500/50" />
                                        <input type="text" placeholder="Expected Output (e.g., [0,1])" value={ex.output} onChange={(e) => handleExampleChange(index, 'output', e.target.value)} className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-violet-500/50" />
                                        <input type="text" placeholder="Explanation (Optional)" value={ex.explanation} onChange={(e) => handleExampleChange(index, 'explanation', e.target.value)} className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-violet-500/50" />
                                    </div>
                                ))}
                                <button type="button" onClick={addExample} className="w-full py-2.5 rounded-lg border border-dashed border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 hover:bg-zinc-900/50 transition-all text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2">
                                    <Plus className="w-4 h-4" /> Add Public Example
                                </button>
                            </div>
                        </div>

                        {/* Hidden Engine Test Cases (For Docker) */}
                        <div className="border-t border-zinc-800/80 pt-8">
                            <div className="flex items-center gap-2 mb-2">
                                <ShieldAlert className="w-5 h-5 text-rose-500" />
                                <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">Engine Verification Matrix</h3>
                            </div>
                            <p className="text-xs text-zinc-500 mb-4">These test cases are injected directly into the isolated Docker container. They remain completely hidden from the user.</p>
                            
                            <div className="space-y-4">
                                {formData.testCases.map((tc, index) => (
                                    <div key={index} className="bg-rose-950/10 border-l-4 border-l-rose-500 border border-zinc-800/60 rounded-r-xl p-4 flex flex-col sm:flex-row gap-3">
                                        <input type="text" placeholder={`Raw Input ${index + 1}`} value={tc.input} onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)} required className="flex-1 bg-[#09090b] border border-zinc-800/80 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-rose-500/50 font-mono" />
                                        <input type="text" placeholder={`Strict Expected Output ${index + 1}`} value={tc.expectedOutput} onChange={(e) => handleTestCaseChange(index, 'expectedOutput', e.target.value)} required className="flex-1 bg-[#09090b] border border-zinc-800/80 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-rose-500/50 font-mono" />
                                    </div>
                                ))}
                                <button type="button" onClick={addTestCase} className="w-full py-2.5 rounded-lg border border-rose-500/30 bg-rose-500/5 text-rose-400 hover:bg-rose-500/10 transition-all text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2">
                                    <Plus className="w-4 h-4" /> Add Hidden Test Case
                                </button>
                            </div>
                        </div>

                        {/* Submit Actions */}
                        <div className="pt-6">
                            <button 
                                type="submit" 
                                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-sm bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/20 transition-all"
                            >
                                <Save className="w-4 h-4" />
                                Deploy to Database
                            </button>
                            
                            {status && (
                                <div className={`mt-4 text-center text-sm font-bold p-3 rounded-lg border ${status.includes('✅') ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                                    {status}
                                </div>
                            )}
                        </div>

                    </form>
                </div>
            </div>
        </motion.div>
    );
}