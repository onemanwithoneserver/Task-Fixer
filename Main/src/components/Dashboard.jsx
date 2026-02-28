import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDailyRecords } from "../hooks/useDailyRecords";
import { calculateEnhancedProductivity } from "../utils/growthCalculator";
import { submitDay, updateDay } from "../services/dailyService";
import AnalyticsAndTrends from "./AnalyticsAndTrends";
import HistoricalReview from "./HistoricalReview";

// --- Animation Config ---
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0, scale: 0.95 },
  show: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 150, damping: 15 },
  },
};

export default function Dashboard({ state = {}, stats = {}, setState }) {
  // --- Daily Records Hook (still used for history/analytics) ---
  const {
    records,
    loading,
    getTodayRecord,
    updateRecord,
    deleteRecord,
    initialized,
  } = useDailyRecords();

  // --- Local State ---
  const [goal, setGoal] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("mainGoal") || "";
    }
    return "";
  });
  const  [activeTab, setActiveTab] = useState("overview");
  const [reflection, setReflection] = useState("");
  const [showSubmitSuccess, setShowSubmitSuccess] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // --- Sync goal to localStorage ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("mainGoal", goal);
    }
  }, [goal]);

  // --- Load today's reflection if exists ---
  useEffect(() => {
    if (initialized) {
      const today = getTodayRecord();
      if (today && today.reflection) {
        setReflection(today.reflection);
      }
    }
  }, [initialized, getTodayRecord]);

  // --- Check if day is already submitted from global status ---
  const today = new Date().toISOString().split("T")[0];
  const isDaySubmitted =
    state.dailyStatus?.submitted &&
    state.dailyStatus?.date === today;

  // --- Enhanced Stats Calculation ---
  const enhancedStats = React.useMemo(() => {
    if (!initialized || !records || !Array.isArray(records) || records.length === 0) {
      return {
        totalDaysTracked: 0,
        averageProductivity: 0,
        trends: { trend: "stable" },
        insights: { strengths: [], improvements: [] },
      };
    }
    return calculateEnhancedProductivity(records, state);
  }, [records, state, initialized]);

  // --- Handlers ---
  const handleSubmitDay = async () => {
    if (isDaySubmitted) return; // lock
    
    const dateKey = new Date().toISOString().split("T")[0];

    // Calculate learning items
    const { planner = {}, communication = {}, engineering = {} } = state;
    
    let learningItems = 0;
    if (engineering.mernStack?.items) {
      engineering.mernStack.items.forEach((item) => {
        if (item.done) learningItems++;
        if (item.subtopics) {
          item.subtopics.forEach((sub) => {
            if (sub.done) learningItems++;
          });
        }
      });
    }
    if (engineering.dsaAndLogic?.items) {
      engineering.dsaAndLogic.items.forEach((item) => {
        if (item.done) learningItems++;
        if (item.subtopics) {
          item.subtopics.forEach((sub) => {
            if (sub.done) learningItems++;
          });
        }
      });
    }
    if (engineering.uiDesign?.items) {
      engineering.uiDesign.items.forEach((item) => {
        if (item.done) learningItems++;
        if (item.subtopics) {
          item.subtopics.forEach((sub) => {
            if (sub.done) learningItems++;
          });
        }
      });
    }

    const payload = {
      date: dateKey,
      submitted: true,
      stats: {
        completedTasks: planner.tasks?.filter((t) => t.done).length || 0,
        totalTasks: planner.tasks?.length || 0,
        habitsDone: communication.habits?.filter((h) => h.done).length || 0,
        totalHabits: communication.habits?.length || 0,
        learningItems: learningItems,
        completionRate: stats.completionRate || 0,
      },
      planner: state.planner || [],
      habits: communication.habits || [],
      learning: {
        mern: engineering.mern || [],
        dsa: engineering.dsa || [],
        ui: engineering.ui || [],
      },
      queries: state.queries || [],
      milestones: state.milestones || [],
      cycleDay: state.cycleDay || 1,
      reflection: reflection || "",
      goal: goal || "",
    };

    try {
      const record = await submitDay(payload);

      // Save global submit status
      const status = {
        date: record.date,
        submitted: true,
      };

      localStorage.setItem("dailyStatus", JSON.stringify(status));

      setState((prev) => ({
        ...prev,
        dailyStatus: status,
      }));
      setShowSubmitSuccess(true);
      setTimeout(() => {
        setShowSubmitSuccess(false);
        setActiveTab("analytics");
      }, 1000);
    } catch (error) {
      console.error("Failed to submit daily record:", error);
    }
  };

  const handleResetDay = () => {
    if (isDaySubmitted) {
      alert("Cannot reset - day has been submitted. Start fresh tomorrow!");
      return;
    }
    
    if (window.confirm("Are you sure you want to reset today's progress?")) {
      // Reset all progress
      const newState = { ...state };
      
      if (newState.planner?.tasks) {
        newState.planner.tasks = newState.planner.tasks.map((t) => ({
          ...t,
          done: false,
        }));
      }
      
      if (newState.communication?.habits) {
        newState.communication.habits = newState.communication.habits.map((h) => ({
          ...h,
          done: false,
        }));
      }
      
      if (newState.engineering?.mernStack?.items) {
        newState.engineering.mernStack.items = newState.engineering.mernStack.items.map((item) => ({
          ...item,
          done: false,
          subtopics: item.subtopics?.map((sub) => ({ ...sub, done: false })),
        }));
      }
      
      if (newState.engineering?.dsaAndLogic?.items) {
        newState.engineering.dsaAndLogic.items = newState.engineering.dsaAndLogic.items.map((item) => ({
          ...item,
          done: false,
          subtopics: item.subtopics?.map((sub) => ({ ...sub, done: false })),
        }));
      }
      
      if (newState.engineering?.uiDesign?.items) {
        newState.engineering.uiDesign.items = newState.engineering.uiDesign.items.map((item) => ({
          ...item,
          done: false,
          subtopics: item.subtopics?.map((sub) => ({ ...sub, done: false })),
        }));
      }

      setState(newState);
      setGoal("");
      setReflection("");
      if (typeof window !== "undefined") {
        localStorage.removeItem("mainGoal");
      }
    }
  };

  const handleSaveReflection = async () => {
    if (isDaySubmitted) return; // lock
    
    const dateKey = new Date().toISOString().split("T")[0];
    try {
      await updateDay(dateKey, { reflection });
    } catch (error) {
      console.error("Failed to save reflection:", error);
    }
  };

  // --- Calculate Stats for Overview ---
  const tasksCompleted = state.planner?.tasks?.filter((t) => t.done).length || 0;
  const totalTasks = state.planner?.tasks?.length || 0;
  const habitsCompleted = state.communication?.habits?.filter((h) => h.done).length || 0;
  const totalHabits = state.communication?.habits?.length || 0;

  let learningItemsCount = 0;
  if (state.engineering?.mernStack?.items) {
    state.engineering.mernStack.items.forEach((item) => {
      if (item.done) learningItemsCount++;
      if (item.subtopics) {
        item.subtopics.forEach((sub) => {
          if (sub.done) learningItemsCount++;
        });
      }
    });
  }
  if (state.engineering?.dsaAndLogic?.items) {
    state.engineering.dsaAndLogic.items.forEach((item) => {
      if (item.done) learningItemsCount++;
      if (item.subtopics) {
        item.subtopics.forEach((sub) => {
          if (sub.done) learningItemsCount++;
        });
      }
    });
  }
  if (state.engineering?.uiDesign?.items) {
    state.engineering.uiDesign.items.forEach((item) => {
      if (item.done) learningItemsCount++;
      if (item.subtopics) {
        item.subtopics.forEach((sub) => {
          if (sub.done) learningItemsCount++;
        });
      }
    });
  }

  return (
    <motion.section
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="relative w-full max-w-7xl mx-auto px-2 py-4 md:px-4 md:py-6"
    >
      {/* Header with Back Button */}
      <motion.div
        variants={itemVariants}
        className="flex items-center gap-4 mb-6 md:mb-8"
      >
        {/* Header Title */}
        <div className="flex-1">
          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="text-4xl md:text-5xl lg:text-6xl font-black italic uppercase tracking-tight bg-clip-text text-transparent bg-linear-to-r from-amber-400 via-orange-500 to-orange-600"
          >
            Dashboard
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="mt-2 text-sm md:text-base text-slate-400 font-medium"
          >
            Track your progress, analyze trends, and reach your goals
          </motion.p>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        variants={itemVariants}
        className="relative mb-6 md:mb-8"
      >
        <div className="flex gap-2 md:gap-3 backdrop-blur-xl bg-slate-900/60 p-1.5 md:p-2 rounded-2xl md:rounded-3xl border border-slate-700/50 shadow-xl">
          <TabButton
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
            icon="📊"
            label="Overview"
          />
          <TabButton
            active={activeTab === "analytics"}
            onClick={() => setActiveTab("analytics")}
            icon="📈"
            label="Analytics"
          />
          <TabButton
            active={activeTab === "history"}
            onClick={() => setActiveTab("history")}
            icon="📚"
            label="History"
          />
        </div>
      </motion.div>

      {/* Content */}
      <div className="space-y-4 md:space-y-6">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <>
            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <StatCard
                label="Tasks Completed"
                value={`${tasksCompleted}/${totalTasks}`}
                color="emerald"
                icon="✓"
              />
              <StatCard
                label="Habits Completed"
                value={`${habitsCompleted}/${totalHabits}`}
                color="blue"
                icon="🎯"
              />
              <StatCard
                label="Learning Items"
                value={learningItemsCount}
                color="purple"
                icon="📚"
              />
              <StatCard
                label="Days Tracked"
                value={enhancedStats.totalDaysTracked || 0}
                color="orange"
                icon="📅"
              />
            </div>

            {/* Main Goal */}
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.005 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-linear-to-br from-amber-500/20 via-orange-500/10 to-orange-600/20 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative overflow-hidden rounded-3xl bg-slate-900/80 backdrop-blur-xl p-8 md:p-12 border border-white/10 shadow-2xl">
                {/* Background Decoration */}
                <motion.div
                  animate={{ opacity: [0.03, 0.08, 0.03] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-6 -right-6 pointer-events-none select-none"
                >
                  <span className="text-[12rem] font-black italic uppercase text-white/5 leading-none">
                    🎯
                  </span>
                </motion.div>

                {/* Label */}
                <div className="flex items-center gap-3 mb-6">
                  <motion.div
                    animate={{ width: ["1rem", "2rem", "1rem"] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    className="h-1.5 bg-linear-to-r from-amber-400 via-orange-500 to-orange-600 rounded-full shadow-lg shadow-orange-500/50"
                  />
                  <label
                    htmlFor="main-goal"
                    className="text-xs font-black uppercase tracking-[0.25em] text-amber-400"
                  >
                    Today's Goal
                  </label>
                </div>

                {/* Input Field */}
                <input
                  id="main-goal"
                  aria-label="Set your main goal for today"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  disabled={isDaySubmitted}
                  placeholder={isDaySubmitted ? "Goal locked for today" : "What's your main goal today?"}
                  className={`w-full bg-transparent text-3xl md:text-5xl font-black text-white placeholder:text-slate-700 border-b-2 border-slate-800 focus:border-orange-500 focus:outline-none py-4 md:py-6 transition-all duration-300 hover:border-slate-700 ${
                    isDaySubmitted ? "cursor-not-allowed opacity-60" : ""
                  }`}
                />
              </div>
            </motion.div>

            {/* Daily Reflection */}
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.005 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-linear-to-br from-purple-500/20 via-violet-500/10 to-indigo-500/20 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative overflow-hidden rounded-3xl bg-slate-900/80 backdrop-blur-xl p-6 md:p-8 border border-white/10 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <motion.span
                    animate={{ rotate: [0, 10, 0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="text-4xl"
                  >
                    💭
                  </motion.span>
                  <div>
                    <h3 className="text-xl md:text-2xl font-black text-white">
                      Daily Reflection
                    </h3>
                    <p className="text-sm text-slate-400 font-medium mt-1">
                      What did you learn today?
                    </p>
                  </div>
                </div>
                <textarea
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  disabled={isDaySubmitted}
                  placeholder={isDaySubmitted ? "Reflection locked for today" : "Reflect on your progress, challenges, learnings, and wins..."}
                  className={`w-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5 text-slate-200 placeholder:text-slate-600 focus:border-violet-500 focus:outline-none resize-none h-36 transition-all duration-300 hover:border-slate-600 ${
                    isDaySubmitted ? "cursor-not-allowed opacity-60" : ""
                  }`}
                />
                <button
                  onClick={handleSaveReflection}
                  disabled={isDaySubmitted}
                  className={`mt-4 px-6 py-3 bg-linear-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-violet-500/50 ${
                    isDaySubmitted ? "opacity-50 cursor-not-allowed hover:scale-100" : ""
                  }`}
                >
                  💾 Save Reflection
                </button>
              </div>
            </motion.div>

            {/* Submit Daily Record */}
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.005 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-linear-to-br from-emerald-500/20 via-green-500/10 to-teal-500/20 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative overflow-hidden rounded-3xl bg-slate-900/80 backdrop-blur-xl p-6 md:p-8 border border-emerald-500/30 shadow-2xl">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-black text-emerald-400 mb-2">
                      {isDaySubmitted ? (
                        <span className="flex items-center gap-2">
                          <span className="text-3xl">✓</span>
                          Day {state.cycleDay || 1} Submitted
                        </span>
                      ) : (
                        `Complete Day ${state.cycleDay || 1}`
                      )}
                    </h3>
                    <p className="text-slate-400 font-medium">
                      {isDaySubmitted
                        ? "Your daily record has been submitted. See you tomorrow!"
                        : "Submit your daily record to track progress and calculate compound growth"}
                    </p>
                  </div>
                  <div className="flex gap-4 w-full md:w-auto">
                    <button
                      onClick={handleResetDay}
                      disabled={isDaySubmitted}
                      className={`flex-1 md:flex-none px-6 py-4 bg-slate-800/80 backdrop-blur-sm hover:bg-slate-700/80 text-slate-300 font-bold rounded-2xl shadow-lg transition-all transform hover:scale-105 border border-slate-700/50 hover:border-slate-600 ${
                        isDaySubmitted ? "opacity-50 cursor-not-allowed hover:scale-100" : ""
                      }`}
                    >
                      🔄 Reset Day
                    </button>
                    <button
                      onClick={handleSubmitDay}
                      disabled={isDaySubmitted}
                      className={`flex-1 md:flex-none px-8 py-4 font-bold rounded-2xl shadow-lg transition-all transform ${isDaySubmitted
                          ? "bg-slate-700 text-slate-400 cursor-not-allowed hover:scale-100"
                          : "bg-linear-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-emerald-500/50 hover:scale-105"
                      }`}
                    >
                      {isDaySubmitted ? "✔ Day Submitted" : "✓ Submit Day"}
                    </button>
                  </div>
                </div>
                <AnimatePresence>
                  {showSubmitSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="mt-6 p-5 bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/50 rounded-2xl"
                    >
                      <p className="text-emerald-300 font-bold text-center">
                        ✓ Daily record submitted successfully!
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Cycle & Streak Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              <InfoCard
                title="Day in Cycle"
                value={state.cycleDay || 1}
                sub="of 31"
                color="blue"
                icon="📅"
              />
              <InfoCard
                title="Streak"
                value={state.streak || 0}
                sub="days"
                color="orange"
                icon="🔥"
              />
              <InfoCard
                title="Trend"
                value={
                  enhancedStats.trends?.trend === "improving"
                    ? "⬆️"
                    : enhancedStats.trends?.trend === "declining"
                    ? "⬇️"
                    : "➡️"
                }
                sub={enhancedStats.trends?.trend || "stable"}
                color="purple"
                icon=""
              />
            </div>

            {/* Quick Insights */}
            {enhancedStats.insights && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Strengths */}
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-linear-to-br from-emerald-500/20 to-green-600/10 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative overflow-hidden rounded-3xl bg-slate-900/80 backdrop-blur-xl p-6 md:p-8 border border-emerald-500/30 shadow-2xl">
                    <div className="flex items-center gap-3 mb-5">
                      <motion.span
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="text-3xl"
                      >
                        💪
                      </motion.span>
                      <h3 className="text-xl md:text-2xl font-black text-emerald-400">
                        Strengths
                      </h3>
                    </div>
                    <ul className="space-y-3">
                      {enhancedStats.insights.strengths.slice(0, 3).map((strength, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="text-sm md:text-base text-slate-300 flex items-start gap-3 font-medium"
                        >
                          <span className="text-emerald-400 font-bold">✓</span>
                          <span>{strength}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>

                {/* Focus On */}
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-linear-to-br from-amber-500/20 to-orange-600/10 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative overflow-hidden rounded-3xl bg-slate-900/80 backdrop-blur-xl p-6 md:p-8 border border-amber-500/30 shadow-2xl">
                    <div className="flex items-center gap-3 mb-5">
                      <motion.span
                        animate={{ rotate: [0, 10, 0, -10, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                        className="text-3xl"
                      >
                        🎯
                      </motion.span>
                      <h3 className="text-xl md:text-2xl font-black text-amber-400">
                        Focus On
                      </h3>
                    </div>
                    <ul className="space-y-3">
                      {enhancedStats.insights.improvements.slice(0, 3).map((improvement, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="text-sm md:text-base text-slate-300 flex items-start gap-3 font-medium"
                        >
                          <span className="text-amber-400 font-bold">→</span>
                          <span>{improvement}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </div>
            )}
          </>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && <AnalyticsAndTrends records={records} />}

        {/* History Tab */}
        {activeTab === "history" && (
          <HistoricalReview
            records={records}
            updateRecord={updateRecord}
            deleteRecord={deleteRecord}
          />
        )}
      </div>
    </motion.section>
  );
}

// --- Components ---

const TabButton = ({ active, onClick, icon, label }) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        relative flex-1 flex items-center justify-center gap-2 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-sm md:text-base transition-all duration-300
        ${
          active
            ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-500/50"
            : "bg-slate-800/70 text-slate-300 hover:text-slate-100 hover:bg-slate-700/70 border border-slate-700/50 hover:border-slate-600"
        }
      `}
    >
      <span className="text-lg md:text-xl">{icon}</span>
      <span>{label}</span>
      {active && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl md:rounded-2xl -z-10"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </motion.button>
  );
};

const StatCard = ({ label, value, color, icon }) => {
  const colorMap = {
    emerald: {
      text: "text-emerald-400",
      bg: "from-emerald-500/20 to-green-600/10",
      border: "border-emerald-500/40",
      shadow: "shadow-emerald-500/30",
      glow: "from-emerald-500/25 to-emerald-600/15",
    },
    blue: {
      text: "text-blue-400",
      bg: "from-blue-500/20 to-cyan-600/10",
      border: "border-blue-500/40",
      shadow: "shadow-blue-500/30",
      glow: "from-blue-500/25 to-blue-600/15",
    },
    orange: {
      text: "text-orange-400",
      bg: "from-orange-500/20 to-amber-600/10",
      border: "border-orange-500/40",
      shadow: "shadow-orange-500/30",
      glow: "from-orange-500/25 to-orange-600/15",
    },
    purple: {
      text: "text-purple-400",
      bg: "from-purple-500/20 to-violet-600/10",
      border: "border-purple-500/30",
      shadow: "shadow-purple-500/20",
      glow: "from-purple-500/20 to-purple-600/10",
    },
  };

  const colors = colorMap[color];

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -6, scale: 1.03 }}
      className="relative group"
    >
      {/* Glow Effect */}
      <div
        className={`absolute inset-0 bg-linear-to-br ${colors.glow} rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500`}
      />
      
      {/* Card */}
      <div
        className={`relative overflow-hidden rounded-3xl bg-slate-900/80 backdrop-blur-xl border ${colors.border} p-8 md:p-10 shadow-2xl ${colors.shadow} transition-all duration-300`}
      >
        {/* Icon */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="text-5xl md:text-6xl mb-4 opacity-80"
        >
          {icon}
        </motion.div>

        {/* Value */}
        <div className="text-center relative z-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`text-4xl md:text-5xl font-black tracking-tight ${colors.text} mb-3`}
          >
            {value}
          </motion.div>
          <p className="text-xs font-black uppercase tracking-[0.15em] text-slate-500">
            {label}
          </p>
        </div>

        {/* Background Gradient */}
        <div className={`absolute inset-0 bg-linear-to-br ${colors.bg} opacity-30 blur-2xl`} />
      </div>
    </motion.div>
  );
};

const InfoCard = ({ title, value, sub, color, icon }) => {
  const colorConfig = {
    blue: {
      text: "text-blue-300",
      bg: "from-blue-500/25 to-cyan-600/15",
      border: "border-blue-500/40",
      shadow: "shadow-blue-500/30",
      glow: "from-blue-500/25 to-blue-600/15",
    },
    orange: {
      text: "text-orange-300",
      bg: "from-orange-500/25 to-amber-600/15",
      border: "border-orange-500/40",
      shadow: "shadow-orange-500/30",
      glow: "from-orange-500/25 to-orange-600/15",
    },
    purple: {
      text: "text-purple-300",
      bg: "from-purple-500/25 to-violet-600/15",
      border: "border-purple-500/40",
      shadow: "shadow-purple-500/30",
      glow: "from-purple-500/25 to-purple-600/15",
    },
  };

  const colors = colorConfig[color];

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.05, y: -4 }}
      className="relative group"
    >
      {/* Glow Effect */}
      <div
        className={`absolute inset-0 bg-linear-to-br ${colors.glow} rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500`}
      />

      {/* Card */}
      <div
        className={`relative overflow-hidden flex flex-col items-center justify-center rounded-2xl md:rounded-3xl bg-slate-900/90 backdrop-blur-xl border ${colors.border} p-6 md:p-8 lg:p-10 shadow-2xl ${colors.shadow} transition-all duration-300`}
      >
        {/* Icon */}
        {icon && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="text-4xl md:text-5xl lg:text-6xl mb-3 md:mb-4 brightness-110"
          >
            {icon}
          </motion.div>
        )}

        {/* Value */}
        <div className={`text-3xl md:text-4xl lg:text-5xl font-black ${colors.text} flex items-baseline gap-2 mb-2`}>
          {value}
          <span className="text-sm md:text-base font-bold text-slate-400 lowercase">{sub}</span>
        </div>

        {/* Title */}
        <p className="text-xs font-black uppercase tracking-[0.15em] text-slate-400">
          {title}
        </p>

        {/* Background Gradient */}
        <div className={`absolute inset-0 bg-linear-to-br ${colors.bg} opacity-30 blur-2xl`} />
      </div>
    </motion.div>
  );
};
