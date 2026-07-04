import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Plus, Save, Database, ShieldAlert, Code2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function AddProblem() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({
        title: '', difficulty: 'Easy', tags: '', description: '',
        examples: [{ input: '', output: '', explanation: '' }],
        testCases: [{ input: '', expectedOutput: '' }]
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            const fetchProblem = async () => {
                try {
                    const res = await axios.get(`/api/problems/${id}`);
                    const prob = res.data.problem;
                    setFormData({
                        title: prob.title,
                        difficulty: prob.difficulty,
                        tags: prob.tags.join(', '), 
                        description: prob.description,
                        examples: prob.examples,
                        testCases: prob.testCases || []
                    });
                } catch (error) {
                    toast.error("Failed to load problem data.");
                }
            };
            fetchProblem();
        }
    }, [id, isEditMode]);

    const handleExampleChange = (index, field, value) => {
        const newExamples = [...formData.examples];
        newExamples[index][field] = value;
        setFormData({ ...formData, examples: newExamples });
    };

    const addExample = () => setFormData({ ...formData, examples: [...formData.examples, { input: '', output: '', explanation: '' }] });

    const handleTestCaseChange = (index, field, value) => {
        const newTestCases = [...formData.testCases];
        newTestCases[index][field] = value;
        setFormData({ ...formData, testCases: newTestCases });
    };

    const addTestCase = () => setFormData({ ...formData, testCases: [...formData.testCases, { input: '', expectedOutput: '' }] });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const token = sessionStorage.getItem('token'); 
            const formattedTags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
            const payload = { ...formData, tags: formattedTags };
            
            if (isEditMode) {
                await axios.put(`/api/problems/${id}`, payload, { headers: { Authorization: `Bearer ${token}` } });
                toast.success('Problem updated successfully!');
            } else {
                await axios.post('/api/problems', payload, { headers: { Authorization: `Bearer ${token}` } });
                toast.success('Problem deployed successfully!');
            }
            
            setTimeout(() => navigate('/admin'), 1500);
        } catch (error) {
            toast.error(isEditMode ? 'Error updating problem.' : 'Error deploying problem.');
            console.error(error);
        }
        setIsSaving(false);
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-[#020617] text-slate-200 font-sans p-4 sm:p-8">
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
                    <button onClick={() => navigate('/admin')} className="p-2 rounded-xl border border-slate-800 bg-[#0c0c0e] text-slate-400 hover:text-white transition-all shadow-sm">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                            <Database className="w-6 h-6 text-cyan-400" /> {isEditMode ? 'Edit Problem' : 'Problem Configuration'}
                        </h1>
                    </div>
                </div>

                <div className="bg-[#0c0c0e] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Problem Title</label>
                                <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full bg-[#020617] border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-cyan-500/50 transition-all" placeholder="e.g. Reverse Linked List" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Difficulty</label>
                                    <select value={formData.difficulty} onChange={(e) => setFormData({...formData, difficulty: e.target.value})} className="w-full bg-[#020617] border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-cyan-500/50 transition-all cursor-pointer">
                                        <option value="Easy">Easy</option><option value="Medium">Medium</option><option value="Hard">Hard</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Tags (Comma Separated)</label>
                                    <input type="text" value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})} className="w-full bg-[#020617] border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-cyan-500/50 transition-all" placeholder="e.g. Array, Dynamic Programming" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-2"><Code2 className="w-4 h-4 text-slate-400" /> Markdown Description</label>
                                <textarea required rows="6" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-[#020617] border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-cyan-500/50 transition-all custom-scrollbar resize-y" placeholder="Write the problem statement here..." />
                            </div>
                        </div>

                        {/* UPDATED: Examples uses textareas now */}
                        <div className="border-t border-slate-800 pt-8">
                            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Public Examples</h3>
                            <div className="space-y-4">
                                {formData.examples.map((ex, index) => (
                                    <div key={index} className="bg-[#020617] border border-slate-800 rounded-xl p-4 space-y-3 relative">
                                        <div className="absolute top-0 right-0 bg-slate-800 text-slate-300 text-[10px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-xl uppercase">Example {index + 1}</div>
                                        <textarea rows="2" placeholder="Input (Press Enter for new line)" value={ex.input} onChange={(e) => handleExampleChange(index, 'input', e.target.value)} className="w-full bg-[#0c0c0e] border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50 custom-scrollbar resize-y font-mono" />
                                        <textarea rows="2" placeholder="Expected Output" value={ex.output} onChange={(e) => handleExampleChange(index, 'output', e.target.value)} className="w-full bg-[#0c0c0e] border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50 custom-scrollbar resize-y font-mono" />
                                        <input type="text" placeholder="Explanation" value={ex.explanation} onChange={(e) => handleExampleChange(index, 'explanation', e.target.value)} className="w-full bg-[#0c0c0e] border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50" />
                                    </div>
                                ))}
                                <button type="button" onClick={addExample} className="w-full py-2.5 rounded-xl border border-dashed border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-800/50 transition-all text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2">
                                    <Plus className="w-4 h-4" /> Add Public Example
                                </button>
                            </div>
                        </div>

                        {/* UPDATED: Test cases use textareas now */}
                        <div className="border-t border-slate-800 pt-8">
                            <div className="flex items-center gap-2 mb-2">
                                <ShieldAlert className="w-5 h-5 text-rose-500" />
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Engine Verification Matrix</h3>
                            </div>
                            <div className="space-y-4">
                                {formData.testCases.map((tc, index) => (
                                    <div key={index} className="bg-rose-950/10 border-l-4 border-l-rose-500 border border-slate-800 rounded-r-xl p-4 flex flex-col sm:flex-row gap-3">
                                        <textarea rows="3" placeholder={`Input ${index + 1}\n(Press Enter for new line)`} value={tc.input} onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)} required className="flex-1 bg-[#020617] border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500/50 font-mono custom-scrollbar resize-y" />
                                        <textarea rows="3" placeholder={`Expected Output ${index + 1}`} value={tc.expectedOutput} onChange={(e) => handleTestCaseChange(index, 'expectedOutput', e.target.value)} required className="flex-1 bg-[#020617] border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500/50 font-mono custom-scrollbar resize-y" />
                                    </div>
                                ))}
                                <button type="button" onClick={addTestCase} className="w-full py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/5 text-rose-400 hover:bg-rose-500/10 transition-all text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2">
                                    <Plus className="w-4 h-4" /> Add Hidden Test Case
                                </button>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-800">
                            <button type="submit" disabled={isSaving} className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-sm bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all disabled:opacity-50">
                                <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : isEditMode ? 'Update Database' : 'Deploy to Database'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </motion.div>
    );
}