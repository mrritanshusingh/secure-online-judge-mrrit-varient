import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Users,
  Database,
  Server,
  Activity,
  LogOut,
  Code2,
  Edit2,
  Trash2,
  X,
  Trophy, 
  CheckCircle
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function AdminDashboard({ handleLogout }) {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [contests, setContests] = useState([]);
  const [platformStats, setPlatformStats] = useState({
    users: 0,
    problems: 0,
    contests: 0,
    throughputData: [],
    workerNodes: [],
  });

  const [showContestModal, setShowContestModal] = useState(false);
  const [isDeployingContest, setIsDeployingContest] = useState(false);
  const [contestForm, setContestForm] = useState({
    title: "",
    description: "",
    startTime: "",
    durationMinutes: 120,
    problems: [],
  });

  const fetchDashboardData = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const probRes = await axios.get("/api/problems");
      setProblems(probRes.data.problems);

      const contestRes = await axios.get("/api/contests");
      if (contestRes.data.success) setContests(contestRes.data.contests);

      const statsRes = await axios.get("/api/submit/admin-stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (statsRes.data.success) setPlatformStats(statsRes.data.stats);
    } catch (error) {
      console.error("Failed to fetch admin data", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const toggleProblemSelection = (problemId) => {
    setContestForm((prev) => {
      const isSelected = prev.problems.includes(problemId);
      return {
        ...prev,
        problems: isSelected
          ? prev.problems.filter((id) => id !== problemId)
          : [...prev.problems, problemId],
      };
    });
  };

  const handleCreateContest = async (e) => {
    e.preventDefault();
    setIsDeployingContest(true);
    try {
      const token = sessionStorage.getItem("token");
      await axios.post("/api/contests", contestForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Contest deployed successfully!");
      setShowContestModal(false);
      setContestForm({
        title: "",
        description: "",
        startTime: "",
        durationMinutes: 120,
        problems: [],
      });
      fetchDashboardData();
    } catch (error) {
      toast.error("Failed to deploy contest.");
    }
    setIsDeployingContest(false);
  };

  const handleDeleteProblem = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently purge this problem?",
      )
    )
      return;
    try {
      const token = sessionStorage.getItem("token");
      await axios.delete(`/api/problems/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProblems(problems.filter((p) => p._id !== id));
      setPlatformStats((prev) => ({ ...prev, problems: prev.problems - 1 }));
      toast.success("Problem purged successfully.");
    } catch (error) {
      toast.error("Failed to delete problem.");
    }
  };

  const handleDeleteContest = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently purge this contest?",
      )
    )
      return;
    try {
      const token = sessionStorage.getItem("token");
      await axios.delete(`/api/contests/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContests(contests.filter((c) => c._id !== id));
      setPlatformStats((prev) => ({ ...prev, contests: prev.contests - 1 }));
      fetchDashboardData();
      toast.success("Contest purged successfully.");
    } catch (error) {
      toast.error("Failed to delete contest.");
    }
  };

  const handleFinalizeContest = async (id) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.post(
        `/api/contests/finalize/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Contest finalized! Problems are now public.");
      fetchDashboardData();
    } catch (error) {
      toast.error("Failed to finalize contest.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#020617] text-slate-200 font-sans p-4 sm:p-8 relative"
    >
      {/* Contest Modal */}
      {showContestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#0c0c0e] border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-[#09090b] shrink-0">
              <div>
                <h2 className="text-xl font-bold text-white">Create Contest</h2>
                <p className="text-sm text-slate-500 mt-1 font-medium">
                  Set up a new rated contest.
                </p>
              </div>
              <button
                onClick={() => setShowContestModal(false)}
                className="p-2 text-slate-400 hover:text-white bg-slate-900 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto custom-scrollbar p-6">
              <form
                id="contestForm"
                onSubmit={handleCreateContest}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Contest Name
                    </label>
                    <input
                      type="text"
                      required
                      value={contestForm.title}
                      onChange={(e) =>
                        setContestForm({
                          ...contestForm,
                          title: e.target.value,
                        })
                      }
                      className="w-full bg-[#020617] border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:border-cyan-500/50 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Duration (Minutes)
                    </label>
                    <input
                      type="number"
                      required
                      min="10"
                      value={contestForm.durationMinutes}
                      onChange={(e) =>
                        setContestForm({
                          ...contestForm,
                          durationMinutes: e.target.value,
                        })
                      }
                      className="w-full bg-[#020617] border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:border-cyan-500/50 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Start Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={contestForm.startTime}
                    onChange={(e) =>
                      setContestForm({
                        ...contestForm,
                        startTime: e.target.value,
                      })
                    }
                    className="w-full bg-[#020617] border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:border-cyan-500/50 outline-none cursor-pointer"
                    style={{ colorScheme: "dark" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Description
                  </label>
                  <textarea
                    rows="2"
                    required
                    value={contestForm.description}
                    onChange={(e) =>
                      setContestForm({
                        ...contestForm,
                        description: e.target.value,
                      })
                    }
                    className="w-full bg-[#020617] border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:border-cyan-500/50 outline-none custom-scrollbar"
                  ></textarea>
                </div>

                {/* Problem Selector inside Modal */}
                <div className="border border-slate-800 rounded-xl bg-[#09090b] overflow-hidden flex flex-col">
                  <div className="bg-slate-900/50 px-4 py-2 border-b border-slate-800">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Attach Problems to Contest
                    </label>
                  </div>
                  <div className="max-h-48 overflow-y-auto custom-scrollbar p-2 space-y-1">
                    {problems.filter((p) => p.visibility !== "ContestOnly")
                      .length === 0 ? (
                      <p className="text-xs text-slate-500 p-2 italic">
                        No public problems available to attach.
                      </p>
                    ) : (
                      problems
                        .filter((p) => p.visibility !== "ContestOnly")
                        .map((prob) => (
                          <label
                            key={prob._id}
                            className="flex items-center gap-3 p-2 hover:bg-slate-800/50 rounded-lg cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={contestForm.problems.includes(prob._id)}
                              onChange={() => toggleProblemSelection(prob._id)}
                              className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-500"
                            />
                            <div className="flex-1 flex justify-between items-center">
                              <span className="text-sm font-bold text-slate-200">
                                {prob.title}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                                  prob.difficulty === "Easy"
                                    ? "text-emerald-400 bg-emerald-400/10"
                                    : prob.difficulty === "Medium"
                                      ? "text-amber-400 bg-amber-400/10"
                                      : "text-rose-400 bg-rose-400/10"
                                }`}
                              >
                                {prob.difficulty}
                              </span>
                            </div>
                          </label>
                        ))
                    )}
                  </div>
                </div>
              </form>
            </div>
            <div className="flex justify-end gap-3 p-4 border-t border-slate-800 bg-[#09090b] shrink-0">
              <button
                type="button"
                onClick={() => setShowContestModal(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-sm text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="contestForm"
                disabled={isDeployingContest}
                className="px-5 py-2.5 rounded-xl font-bold text-sm bg-cyan-600 hover:bg-cyan-500 text-white transition-all disabled:opacity-50"
              >
                {isDeployingContest ? "Deploying..." : "Create Contest"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Main Dashboard UI */}
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Admin Console
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage problems, users, and platform infrastructure.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-800 bg-[#0c0c0e] hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-all font-semibold text-sm"
          >
            <LogOut className="w-4 h-4" /> End Session
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#0c0c0e] border border-slate-800 rounded-2xl p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Total Users
                </p>
                <h3 className="text-3xl font-bold text-cyan-400">
                  {platformStats.users}
                </h3>
              </div>
              <Users className="w-5 h-5 text-slate-600" />
            </div>
          </div>
          <div className="bg-[#0c0c0e] border border-slate-800 rounded-2xl p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Problems
                </p>
                <h3 className="text-3xl font-bold text-purple-400">
                  {platformStats.problems}
                </h3>
              </div>
              <Database className="w-5 h-5 text-slate-600" />
            </div>
          </div>
          <div className="bg-[#0c0c0e] border border-slate-800 rounded-2xl p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Contests
                </p>
                <h3 className="text-3xl font-bold text-amber-400">
                  {platformStats.contests}
                </h3>
              </div>
              <Activity className="w-5 h-5 text-slate-600" />
            </div>
          </div>
          <div className="bg-[#0c0c0e] border border-slate-800 rounded-2xl p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Worker Nodes
                </p>
                <h3 className="text-3xl font-bold text-emerald-400">3/3</h3>
              </div>
              <Server className="w-5 h-5 text-slate-600" />
            </div>
          </div>
        </div>

        {/* Contest Bank Table */}
        <div className="bg-[#0c0c0e] border border-slate-800 rounded-2xl overflow-hidden mb-8">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Contest Bank
            </h3>
            <button
              onClick={() => setShowContestModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-bold transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)]"
            >
              <Plus className="w-4 h-4" /> New Contest
            </button>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Start Time</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-sm">
              {contests.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-8 text-center text-slate-500 italic"
                  >
                    No contests deployed yet.
                  </td>
                </tr>
              ) : (
                contests.map((contest) => (
                  <tr key={contest._id} className="hover:bg-slate-900/30">
                    <td className="px-6 py-4 font-bold text-slate-300 flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-amber-500" />{" "}
                      {contest.title}
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-mono text-xs">
                      {new Date(contest.startTime).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {contest.durationMinutes} min
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleFinalizeContest(contest._id)}
                        title="Finalize Contest & Release Problems"
                        className="p-2 hover:bg-slate-800 rounded text-slate-400 hover:text-emerald-400 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />{" "}
                        {/*  */}
                      </button>
                      <button
                        onClick={() => handleDeleteContest(contest._id)}
                        className="p-2 hover:bg-slate-800 rounded text-slate-400 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Problem Bank Table */}
        <div className="bg-[#0c0c0e] border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Problem Bank
            </h3>
            <button
              onClick={() => navigate("/admin/add-problem")}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            >
              <Plus className="w-4 h-4" /> New Problem
            </button>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Visibility</th>
                <th className="px-6 py-4">Difficulty</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-sm">
              {problems.map((prob) => (
                <tr key={prob._id} className="hover:bg-slate-900/30">
                  <td className="px-6 py-4 font-bold text-slate-300 flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-slate-600" /> {prob.title}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${prob.visibility === "ContestOnly" ? "bg-purple-500/10 text-purple-400" : "bg-slate-800 text-slate-300"}`}
                    >
                      {prob.visibility}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-800 rounded text-xs font-bold text-slate-300">
                      {prob.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() =>
                        navigate(`/admin/edit-problem/${prob._id}`)
                      }
                      className="p-2 hover:bg-slate-800 rounded text-slate-400 hover:text-cyan-400 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProblem(prob._id)}
                      className="p-2 hover:bg-slate-800 rounded text-slate-400 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
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
