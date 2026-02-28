import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const SCHEDULE_DATA = {
  weekday: [
    { time: "04:30 AM - 04:45 AM", task: "Wake up", category: "Morning Routine" },
    { time: "04:45 AM - 05:30 AM", task: "Exercise", category: "Health" },
    { time: "5:30 AM - 5:45 AM", task: "Batching", category: "Organization" },
    { time: "5:45 AM - 06:00 AM", task: "Cleaning", category: "Morning Routine" },
    { time: "06:00 AM - 06:15 AM", task: "Prayer + Gita", category: "Spiritual" },
    { time: "06:15 AM - 06:20 AM", task: "Break", category: "Rest" },
    { time: "06:20 AM - 07:00 AM", task: "English Speaking Practice", category: "Learning" },
    { time: "07:00 AM - 07:40 AM", task: "MERN Concepts", category: "Technical Learning" },
    { time: "07:40 AM - 07:45 AM", task: "Break", category: "Rest" },
    { time: "07:45 AM - 08:25 AM", task: "UI/UX Design Learning", category: "Design Learning" },
    { time: "08:25 AM - 08:35 AM", task: "Breakfast", category: "Meal" },
    { time: "08:35 AM - 09:00 AM", task: "Commute / Prep for Office", category: "Travel" },
    { time: "09:00 AM - 01:00 PM", task: "Office Hours - Morning Session", category: "Work" },
    { time: "01:00 PM - 02:00 PM", task: "Lunch Break", category: "Meal" },
    { time: "02:00 PM - 06:00 PM", task: "Office Hours - Afternoon Session", category: "Work" },
    { time: "06:00 PM - 06:30 PM", task: "Commute / Unwind", category: "Travel" },
    { time: "06:30 PM - 07:45 PM", task: "Accessibility Testing", category: "Technical Learning" },
    { time: "07:45 PM - 08:30 PM", task: "Dinner", category: "Meal" },
    { time: "08:30 PM - 09:30 PM", task: "UI/UX Design Applying", category: "Design Practice" },
    { time: "09:30 PM - 09:50 PM", task: "MERN Concepts Recap", category: "Technical Review" },
    { time: "09:50 PM - 10:00 PM", task: "Sleep Prep", category: "Night Routine" },
  ],
  tuesday: [
    { time: "04:30 AM - 04:45 AM", task: "Wake up", category: "Morning Routine" },
    { time: "04:45 AM - 05:30 AM", task: "Exerise", category: "Health" },
    { time: "5:30 AM - 05:45 AM", task: "Batching", category: "Organization" },
    { time: "05:45 AM - 08:00 AM", task: "Home Task and Gita", category: "Spiritual" },
    { time: "08:00 AM - 08:30 AM", task: "English Speaking Practice", category: "Learning" },
    { time: "08:30 AM - 08:45 AM", task: "Cleaning", category: "Morning Routine" },
    { time: "08:45 AM - 09:00 AM", task: "Break", category: "Rest" },
    { time: "09:00 AM - 01:00 PM", task: "Office Hours  - Morning Session", category: "Work" },
    { time: "01:00 PM - 02:00 PM", task: "Lunch Break", category: "Meal" },
    { time: "02:00 PM - 06:00 PM", task: "Office Hours - Afternoon Session", category: "Work" },
    { time: "06:00 PM - 06:30 PM", task: "Commute / Unwind", category: "Travel" },
    { time: "06:30 PM - 07:45 PM", task: "Accessibility Testing", category: "Technical Learning" },
    { time: "07:45 PM - 08:30 PM", task: "Dinner", category: "Meal" },
    { time: "08:30 PM - 09:30 PM", task: "UI/UX Design Applying", category: "Design Practice" },
    { time: "09:30 PM - 09:50 PM", task: "MERN Concepts", category: "Technical Learning" },
    { time: "09:50 PM - 10:00 PM", task: "Sleep Prep", category: "Night Routine" },
  ],
  saturday: [
    { time: "04:30 AM - 04:45 AM", task: "Wake up", category: "Morning Routine" },
    { time: "04:45 AM - 05:30 AM", task: "Exerise", category: "Health" },
    { time: "5:30 AM - 05:45 AM", task: "Batching", category: "Organization" },
    { time: "05:45 AM - 06:00 AM", task: "Cleaning", category: "Morning Routine" },
    { time: "06:00 AM - 08:00 AM", task: "Home Task and Gita", category: "Spiritual" },
    { time: "08:00 AM - 08:30 AM", task: "English Speaking Practice", category: "Learning" },
    { time: "08:30 AM - 09:00 AM", task: "Breakfast", category: "Meal" },
    { time: "09:00 AM - 12:30 PM", task: "UI/UX Design", category: "Design Learning" },
    { time: "12:30 PM - 01:30 PM", task: "Lunch Break", category: "Meal" },
    { time: "01:30 PM - 01:45 PM", task: "MERN Stack", category: "Technical Learning" },
    { time: "01:45 PM - 02:00 PM", task: "Break", category: "Rest" },
    { time: "02:00 PM - 04:00 PM", task: "Accessibility Testing", category: "Technical Learning" },
    { time: "07:45 PM - 08:30 PM", task: "Dinner", category: "Meal" },
    { time: "08:30 PM - 09:30 PM", task: "UI/UX Design Applying", category: "Design Practice" },
    { time: "09:30 PM - 09:50 PM", task: "MERN Concepts Recap", category: "Technical Review" },
    { time: "09:50 PM - 10:00 PM", task: "Sleep Prep", category: "Night Routine" },
  ],
  holiday_tuesday: [
    { time: "04:30 AM - 04:45 AM", task: "Wake up", category: "Morning Routine" },
    { time: "04:45 AM - 05:30 AM", task: "Exerise", category: "Health" },
    { time: "5:30 AM - 05:45 AM", task: "Batching", category: "Organization" },
    { time: "05:45 AM - 06:00 AM", task: "Cleaning", category: "Morning Routine" },
    { time: "06:00 AM - 08:00 AM", task: "Home Task and Gita", category: "Spiritual" },
    { time: "08:00 AM - 08:30 AM", task: "English Speaking Practice", category: "Learning" },
    { time: "08:30 AM - 09:00 AM", task: "Breakfast", category: "Meal" },
    { time: "09:00 AM - 12:30 PM", task: "UI/UX Design", category: "Design Learning" },
    { time: "12:30 PM - 01:30 PM", task: "Break", category: "Rest" },
    { time: "01:30 PM - 01:45 PM", task: "Lunch Break", category: "Meal" },
    { time: "01:45 PM - 02:00 PM", task: "Break", category: "Rest" },
    { time: "02:00 PM - 04:00 PM", task: "Accessbility Testing", category: "Technical Learning" },
    { time: "07:45 PM - 08:30 PM", task: "Dinner", category: "Meal" },
    { time: "08:30 PM  - 09:30 PM", task: "UI/UX Design Applying", category: "Design Practice" },
    { time: "09:30 PM - 09:50 PM", task: "MERN Concepts Recap", category: "Technical Review" },
    { time: " 09:50 PM - 10:00 PM", task: "Sleep Prep", category: "Night Routine" },
  ],
  holiday: [
    { time: "04:30 AM - 04:45 AM", task: "Wake up", category: "Morning Routine" },
    { time: "04:45 AM - 05:30 AM", task: "Exerise", category: "Health" },
    { time: "5:30 AM - 05:45 AM", task: "Batching", category: "Organization" },
    { time: "05:45 AM - 06:00 AM", task: "Cleaning", category: "Morning Routine" },
    { time: "06:00 AM - 06:15 AM", task: "Home Task and Gita", category: "Spiritual" },
    { time: "06:15 AM - 07:30 AM", task: "English Speaking Practice", category: "Learning" },
    { time: "07:30 AM - 08:30 AM", task: "MERN Stack", category: "Technical Learning" },
    { time: "08:30 AM - 09:00 AM", task: "Breakfast", category: "Meal" },
    { time: "09:00 AM - 12:30 PM", task: "UI/UX Design", category: "Design Learning" },
    { time: "12:30 PM - 01:30 PM", task: "Break", category: "Rest" },
    { time: "01:30 PM - 01:45 PM", task: "Lunch Break", category: "Meal" },
    { time: "01:45 PM - 02:00 PM", task: "Break", category: "Rest" },
    { time: "02:00 PM - 04:00 PM", task: "Accessbility Testing", category: "Technical Learning" },
    { time: "07:45 PM - 08:30 PM", task: "Dinner", category: "Meal" },
    { time: "08:30 PM  - 09:30 PM", task: "UI/UX Design Applying", category: "Design Practice" },
    { time: "09:30 PM - 10:00 PM", task: "Finance", category: "Planning" },
    { time: "10:00 PM - 10:30 PM", task: "Sleeping", category: "Sleep" },
  ]
};

const DAY_TYPES = [
  { id: "weekday", label: "Weekday", description: "Monday, Wednesday, Thursday, Friday" },
  { id: "tuesday", label: "Tuesday", description: "Special Tuesday Schedule" },
  { id: "saturday", label: "Saturday", description: "Weekend Learning Focus" },
  { id: "holiday_tuesday", label: "Holiday Tuesday", description: "Tuesday Holiday Mode" },
  { id: "holiday", label: "Holiday", description: "Holiday / Sunday Schedule" },
];

const getDayTypeFromDate = (date) => {
  const day = date.getDay();
  if (day === 2) return "tuesday";
  if (day === 6) return "saturday";
  return "weekday";
};

export default function Planner({ state, setState }) {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const tasks = state.planner || [];
  
  // Use global daily status
  const today = new Date().toISOString().split("T")[0];
  const isDaySubmitted =
    state.dailyStatus?.submitted &&
    state.dailyStatus?.date === today;
  
  const todayDayType = getDayTypeFromDate(currentDateTime);
  const dayType = state.dayType || todayDayType;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!state.planner || state.planner.length === 0 || !state.dayType) {
      setState((prev) => ({ 
        ...prev, 
        dayType: todayDayType,
        planner: SCHEDULE_DATA[todayDayType].map(t => ({ ...t, done: false })) 
      }));
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("dailyProgress");

    if (saved) {
      const savedData = JSON.parse(saved);
      // Check if it's today's submission
      if (savedData.date === formatDate(currentDateTime)) {
        setState((prev) => ({
          ...prev,
          dailyProgress: savedData,
        }));
      } else {
        // Clear old submission if it's a new day
        localStorage.removeItem("dailyProgress");
      }
    }
  }, []);

  // Auto-scroll to current task
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentTaskIndex = tasks.findIndex(t => isCurrentTask(t.time) && !t.done);
      if (currentTaskIndex !== -1) {
        const element = document.querySelector(`[data-task-index="${currentTaskIndex}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [tasks]);

  const changeDayType = (value) => {
    setState((prev) => ({ 
      ...prev, 
      dayType: value,
      planner: SCHEDULE_DATA[value].map(t => ({ ...t, done: false })) 
    }));
    setIsDialogOpen(false);
  };

  const submitDayProgress = () => {
    if (isDaySubmitted) return;
    
    const progressData = {
      date: formatDate(currentDateTime),
      completionRate: stats.completionRate,
      completed: stats.completed,
      total: stats.total,
      remaining: stats.remaining,
    };

    // Save locally
    localStorage.setItem("dailyProgress", JSON.stringify(progressData));

    // Save in global state (for other pages)
    setState((prev) => ({
      ...prev,
      dailyProgress: progressData,
    }));
  };

  const toggleTask = (index) => {
    if (isDaySubmitted) return;
    
    setState((prev) => ({
      ...prev,
      planner: prev.planner.map((t, i) => i === index ? { ...t, done: !t.done } : t),
    }));
  };

  const currentDayLabel = DAY_TYPES.find((d) => d.id === dayType);
  const isToday = dayType === todayDayType;

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Check if a task is currently active
  const isCurrentTask = (timeStr) => {
    const [start, end] = timeStr.split(' - ');
    const currentTime = formatTime(currentDateTime);
    
    const parseTime = (t) => {
      const [time, period] = t.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      let h = hours;
      if (period === 'PM' && h !== 12) h += 12;
      if (period === 'AM' && h === 12) h = 0;
      return h * 60 + minutes;
    };
    
    const current = parseTime(currentTime);
    const startMin = parseTime(start);
    const endMin = parseTime(end);
    
    return current >= startMin && current < endMin;
  };

  // Filter and search
  const filteredTasks = tasks.filter(t => 
    t.task.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Statistics
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.done).length,
    remaining: tasks.filter(t => !t.done).length,
    completionRate: tasks.length > 0 ? Math.round((tasks.filter(t => t.done).length / tasks.length) * 100) : 0,
  };

  const getCategoryColor = (category) => {
    const colors = {
      "Morning Routine": "blue",
      "Health": "red",
      "Organization": "purple",
      "Spiritual": "yellow",
      "Rest": "slate",
      "Learning": "emerald",
      "Technical Learning": "cyan",
      "Design Learning": "pink",
      "Meal": "orange",
      "Travel": "indigo",
      "Work": "violet",
      "Design Practice": "fuchsia",
      "Technical Review": "teal",
      "Night Routine": "blue",
      "Planning": "amber",
      "Sleep": "slate",
    };
    return colors[category] || "slate";
  };

  return (
    <motion.section 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="max-w-[100rem] mx-auto w-full px-4 sm:px-6 pb-8 sm:pb-12 lg:pb-20"
    >
      {/* Header with Back Button */}
      <div className="flex items-center flex-wrap gap-3 sm:gap-4 mb-6 sm:mb-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="p-2.5 sm:p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all shadow-lg"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </motion.button>
        
        <div className="flex-1 min-w-[12rem]">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black italic uppercase tracking-tight text-white leading-tight">📅 Daily Planner</h1>
          <p className="text-[0.625rem] sm:text-xs text-blue-400 font-semibold uppercase tracking-wider mt-1">Time Block Schedule</p>
        </div>

        {/* Live Clock */}
        <div className="text-right">
          <p className="text-[0.625rem] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
            {formatDate(currentDateTime)}
          </p>
          <p className="text-xl sm:text-2xl font-black text-blue-400">
            {formatTime(currentDateTime)}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(22rem,26rem)] xl:grid-cols-[minmax(0,1fr)_minmax(24rem,28rem)] gap-4 sm:gap-6 lg:gap-8 items-start">
        {/* Left Column - Task List */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }}
          className="relative rounded-3xl lg:rounded-[2.5rem] bg-slate-900 border border-slate-800 p-4 sm:p-5 lg:p-6 shadow-2xl"
        >
          {/* Location Indicator */}
          <div className="absolute left-0 top-0 bottom-0 w-0.5 sm:w-1 bg-linear-to-b from-transparent via-blue-500 to-transparent opacity-50" />
          {/* Header */}
          <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
            <div className="flex items-center justify-between flex-wrap gap-3 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-wrap">
                <div className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-blue-500"></span>
                </div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-black italic uppercase tracking-widest text-white">
                  Today's Schedule
                </h2>
                {!isDaySubmitted && (
                  <button
                    onClick={() => setIsDialogOpen(true)}
                    className="p-1.5 sm:p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all active:scale-95 shadow-lg shadow-blue-900/20"
                    title="Change Schedule Type"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                )}
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                {(() => {
                  const currentTask = tasks.find(t => isCurrentTask(t.time) && !t.done);
                  return currentTask && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-linear-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/50 leading-none"
                    >
                      <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-blue-500"></span>
                      </span>
                      <span className="text-[0.625rem] sm:text-xs font-bold text-blue-300 whitespace-nowrap truncate max-w-[8rem] sm:max-w-[12rem]">{currentTask.task}</span>
                    </motion.div>
                  );
                })()}
                <span className="inline-flex items-center justify-center text-[0.625rem] sm:text-xs font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 leading-none whitespace-nowrap">
                  {currentDayLabel?.label || "Select Mode"}
                </span>
                {isToday && (
                  <span className="inline-flex items-center justify-center text-[0.625rem] sm:text-xs font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 leading-none whitespace-nowrap">
                    Live
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="mb-4 sm:mb-6">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 Search tasks..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-white placeholder:text-slate-600 outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Task List */}
          <div className="flex flex-col gap-2.5 sm:gap-3">
            <AnimatePresence mode="popLayout">
              {filteredTasks.map((t, i) => {
                const isDeepWork = t.task.toLowerCase().includes("dsa") || t.task.toLowerCase().includes("mern");
                const color = getCategoryColor(t.category);
                const isCurrent = isCurrentTask(t.time) && !t.done;
                
                return (
                  <motion.label 
                    key={i}
                    data-task-index={i}
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                      scale: isCurrent ? [1, 1.02, 1] : 1
                    }} 
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ 
                      delay: i * 0.02,
                      scale: { duration: 2, repeat: isCurrent ? Infinity : 0 }
                    }}
                    className={`group relative flex items-start gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all ${
                      isDaySubmitted 
                        ? "cursor-not-allowed" 
                        : "cursor-pointer"
                    } ${
                      isCurrent
                        ? "bg-linear-to-r from-blue-500/20 to-purple-500/20 border-2 border-blue-500 shadow-lg shadow-blue-500/20"
                        : t.done 
                          ? "bg-slate-950 border border-slate-800/50 opacity-60" 
                          : isDeepWork 
                            ? "bg-emerald-500/5 border border-emerald-500/30 hover:border-emerald-500/50" 
                            : "bg-slate-950 border border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    {/* Current Task Indicator */}
                    {isCurrent && (
                      <motion.div 
                        className="absolute -left-1 top-0 bottom-0 w-1 bg-linear-to-b from-blue-500 via-purple-500 to-blue-500 rounded-full"
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                    {/* Checkbox */}
                    <div className="relative pt-0.5 flex-shrink-0">
                      <input 
                        type="checkbox" 
                        checked={t.done} 
                        onChange={() => !isDaySubmitted && toggleTask(i)} 
                        disabled={isDaySubmitted}
                        className="peer sr-only" 
                      />
                      <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-lg border-2 flex items-center justify-center transition-all ${
                        t.done 
                          ? "bg-blue-500 border-blue-500" 
                          : "border-slate-600 group-hover:border-blue-400"
                      }`}>
                        <motion.svg 
                          initial={false} 
                          animate={{ scale: t.done ? 1 : 0 }} 
                          className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white stroke-3" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </motion.svg>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col gap-1.5 sm:gap-2 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span className={`inline-flex items-center justify-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[0.625rem] sm:text-[0.688rem] font-black uppercase tracking-wider leading-none border bg-${color}-500/10 border-${color}-500/20 text-${color}-400`}>
                          {t.time}
                        </span>
                        
                        {isCurrent && (
                          <motion.span 
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg bg-linear-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/50 leading-none"
                          >
                            <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-blue-500"></span>
                            </span>
                            <span className="text-[0.563rem] sm:text-[0.625rem] font-black text-blue-300 uppercase tracking-wide">Now</span>
                          </motion.span>
                        )}
                        
                        {isDeepWork && !t.done && !isCurrent && (
                          <span className="inline-flex items-center justify-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 leading-none">
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                            </span>
                            <span className="text-[0.5rem] sm:text-[0.563rem] font-black text-emerald-400 uppercase tracking-wide">Deep Work</span>
                          </span>
                        )}
                      </div>
                      
                      <p className={`text-sm sm:text-base font-bold leading-snug transition-colors wrap-break-word ${
                        t.done ? "line-through text-slate-500" : isCurrent ? "text-white" : "text-slate-200"
                      }`}>
                        {t.task}
                      </p>

                      {t.category && (
                        <span className={`inline-block text-[0.563rem] sm:text-[0.625rem] font-medium uppercase tracking-wider ${
                          isCurrent ? "text-blue-400" : "text-slate-500"
                        }`}>
                          {t.category}
                        </span>
                      )}
                    </div>
                  </motion.label>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Right Column - Statistics */}
        <motion.div 
          initial={{ x: 20, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }}
          className="flex flex-col gap-4 sm:gap-5 lg:gap-6 min-h-[30rem] lg:min-h-[40rem]"
        >
          {/* Completion Progress */}
          <div className="relative bg-linear-to-br from-slate-900 via-blue-950/40 to-slate-900 border border-blue-500/20 rounded-3xl p-4 sm:p-5 lg:p-6 shadow-2xl overflow-hidden">
            {/* Ambient Background Effect */}
            <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-purple-500/5 pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8 flex-wrap gap-2">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-0.5 sm:w-1 h-4 sm:h-5 lg:h-6 bg-linear-to-b from-blue-400 to-purple-500 rounded-full" />
                  <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-400">
                    Daily Progress
                  </h3>
                </div>
                
                {/* Icon-based Stats */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-1.5 sm:gap-2 flex-wrap"
                >
                  {/* Completion Rate */}
                  <motion.div 
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-linear-to-br from-blue-500/20 to-blue-600/20 border border-blue-400/30 backdrop-blur-sm"
                    title="Completion Rate"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span className="text-xs sm:text-sm font-black text-blue-300 whitespace-nowrap">{stats.completionRate}%</span>
                  </motion.div>

                  {/* Completed Tasks */}
                  <motion.div 
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-linear-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-400/30 backdrop-blur-sm"
                    title="Completed Tasks"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs sm:text-sm font-black text-emerald-300 whitespace-nowrap">{stats.completed}</span>
                  </motion.div>

                  {/* Total Tasks */}
                  <motion.div 
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-linear-to-br from-purple-500/20 to-purple-600/20 border border-purple-400/30 backdrop-blur-sm"
                    title="Total Tasks"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    <span className="text-xs sm:text-sm font-black text-purple-300 whitespace-nowrap">{stats.total}</span>
                  </motion.div>
                </motion.div>
              </div>
              
              {/* Submit Circle */}
              <div className="flex items-center justify-center mb-4 sm:mb-6 lg:mb-8">
                <motion.button
                  whileHover={{ scale: isDaySubmitted ? 1 : 1.05 }}
                  whileTap={{ scale: isDaySubmitted ? 1 : 0.95 }}
                  onClick={submitDayProgress}
                  disabled={isDaySubmitted}
                  className={`relative w-36 h-36 sm:w-40 sm:h-40 lg:w-44 lg:h-44 rounded-full flex items-center justify-center 
                    transition-all duration-300 group
                    ${
                      isDaySubmitted
                        ? "cursor-not-allowed"
                        : "cursor-pointer hover:shadow-2xl hover:shadow-blue-500/20"
                    }
                  `}
                >
                  {/* Outer Glow Ring */}
                  <div className={`absolute inset-0 rounded-full blur-xl transition-opacity ${isDaySubmitted ? 'opacity-30 bg-emerald-500/30' : 'opacity-0 group-hover:opacity-40 bg-blue-500/40'}`} />
                  
                  {/* Progress Ring Background */}
                  <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 176 176">
                    <circle
                      cx="88"
                      cy="88"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-slate-800/50"
                    />
                    <motion.circle
                      cx="88"
                      cy="88"
                      r="70"
                      stroke="url(#progressGradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: stats.completionRate / 100 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      style={{
                        strokeDasharray: "440",
                        filter: "drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))"
                      }}
                    />
                    <defs>
                      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={isDaySubmitted ? "#10b981" : "#3b82f6"} />
                        <stop offset="100%" stopColor={isDaySubmitted ? "#059669" : "#8b5cf6"} />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Inner Circle with Glassmorphism */}
                  <div className={`absolute inset-4 rounded-full backdrop-blur-xl border ${isDaySubmitted ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-slate-900/50 border-blue-500/20'}`} />

                  {/* Center Content */}
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
                    {isDaySubmitted ? (
                      <>
                        <motion.div 
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 200, damping: 15 }}
                          className="text-3xl sm:text-4xl lg:text-5xl font-black text-emerald-400 leading-none mb-1.5 sm:mb-2"
                        >
                          ✓
                        </motion.div>
                        <div className="text-[0.625rem] sm:text-xs text-emerald-400 uppercase font-bold tracking-widest leading-none">
                          Submitted
                        </div>
                      </>
                    ) : (
                      <>
                        <motion.div 
                          className="text-3xl sm:text-4xl lg:text-5xl font-black mb-1.5 sm:mb-2 bg-linear-to-br from-blue-400 to-purple-400 bg-clip-text text-transparent leading-none"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {stats.completionRate}%
                        </motion.div>
                        <div className="text-[0.625rem] sm:text-xs text-slate-400 font-semibold uppercase tracking-wide group-hover:text-blue-400 transition-colors leading-none">
                          Tap to Submit
                        </div>
                      </>
                    )}
                  </div>
                </motion.button>
              </div>

              {/* Task Cards */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <motion.div 
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="relative p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl bg-linear-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/30 backdrop-blur-sm overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-colors" />
                  <div className="relative">
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-emerald-400 mb-0.5 sm:mb-1">{stats.completed}</div>
                    <div className="text-[0.625rem] sm:text-xs text-emerald-300/70 font-semibold uppercase tracking-wide">Completed</div>
                  </div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="relative p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl bg-linear-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/30 backdrop-blur-sm overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-colors" />
                  <div className="relative">
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-orange-400 mb-0.5 sm:mb-1">{stats.remaining}</div>
                    <div className="text-[0.625rem] sm:text-xs text-orange-300/70 font-semibold uppercase tracking-wide">Remaining</div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="relative bg-linear-to-br from-slate-900 via-purple-950/30 to-slate-900 border border-purple-500/20 rounded-3xl p-4 sm:p-5 lg:p-6 shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 lg:mb-6">
                <div className="w-0.5 sm:w-1 h-4 sm:h-5 lg:h-6 bg-linear-to-b from-purple-400 to-pink-500 rounded-full" />
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-400">Schedule Stats</h3>
              </div>
              <div className="flex flex-col gap-4 sm:gap-5 lg:gap-6">
                <div className="p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl bg-linear-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/30">
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-blue-400 mb-1 sm:mb-2">{stats.total}</div>
                  <div className="text-xs sm:text-sm text-blue-300/70 font-semibold">Total Tasks</div>
                </div>
                <div className="h-px bg-linear-to-r from-transparent via-slate-700 to-transparent"></div>
                <div className="p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl bg-linear-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/30">
                  <div className="text-2xl sm:text-3xl font-black text-purple-400 mb-1 sm:mb-2">
                    {tasks.filter(t => t.task.toLowerCase().includes("mern") || t.task.toLowerCase().includes("design")).length}
                  </div>
                  <div className="text-xs sm:text-sm text-purple-300/70 font-semibold">Learning Blocks</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Productivity Tips */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="relative bg-linear-to-br from-slate-900 via-cyan-950/30 to-slate-900 border border-cyan-500/20 rounded-3xl p-4 sm:p-5 lg:p-6 shadow-2xl overflow-hidden"
          >
            <div className="absolute bottom-0 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-cyan-500/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 lg:mb-6">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="text-2xl sm:text-3xl"
                >💡</motion.div>
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-400">Pro Tips</h3>
              </div>
              <ul className="flex flex-col gap-2 sm:gap-2.5 lg:gap-3">
                <motion.li 
                  whileHover={{ x: 4 }}
                  className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-slate-300 leading-relaxed group"
                >
                  <span className="text-cyan-400 group-hover:text-cyan-300 transition-colors flex-shrink-0">▸</span>
                  <span className="group-hover:text-slate-200 transition-colors">Follow the time blocks consistently</span>
                </motion.li>
                <motion.li 
                  whileHover={{ x: 4 }}
                  className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-slate-300 leading-relaxed group"
                >
                  <span className="text-cyan-400 group-hover:text-cyan-300 transition-colors flex-shrink-0">▸</span>
                  <span className="group-hover:text-slate-200 transition-colors">Take breaks between deep work sessions</span>
                </motion.li>
                <motion.li 
                  whileHover={{ x: 4 }}
                  className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-slate-300 leading-relaxed group"
                >
                  <span className="text-cyan-400 group-hover:text-cyan-300 transition-colors flex-shrink-0">▸</span>
                  <span className="group-hover:text-slate-200 transition-colors">Adjust schedule based on energy levels</span>
                </motion.li>
                <motion.li 
                  whileHover={{ x: 4 }}
                  className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-slate-300 leading-relaxed group"
                >
                  <span className="text-cyan-400 group-hover:text-cyan-300 transition-colors flex-shrink-0">▸</span>
                  <span className="group-hover:text-slate-200 transition-colors">Review progress at end of day</span>
                </motion.li>
              </ul>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Change Schedule Dialog */}
      <AnimatePresence>
        {isDialogOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDialogOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl z-50"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black italic uppercase text-white">Select Schedule</h3>
                <button
                  onClick={() => setIsDialogOpen(false)}
                  className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-3">
                {DAY_TYPES.map((d) => {
                  const isActive = d.id === todayDayType;
                  const isSelected = d.id === dayType;
                  
                  return (
                    <button 
                      key={d.id} 
                      onClick={() => changeDayType(d.id)} 
                      className={`w-full text-left p-4 rounded-xl transition-all border ${
                        isSelected
                          ? 'bg-blue-500/20 border-blue-500/30 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm font-black uppercase tracking-wider ${isSelected ? 'text-blue-400' : 'text-slate-200'}`}>
                          {d.label}
                        </span>
                        <div className="flex items-center gap-2">
                          {isActive && (
                            <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-black uppercase border border-emerald-500/30">
                              Today
                            </span>
                          )}
                          {isSelected && (
                            <span className="h-2 w-2 rounded-full bg-blue-500" />
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {d.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
