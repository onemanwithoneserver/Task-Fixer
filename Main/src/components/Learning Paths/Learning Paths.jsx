import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MERNStack from "./MERNStack";
import AlgorithmsAndSystemsLogic from "./Algorithms & Systems Logic";
import UXDesignPrinciples from "./UX Design Principles";
import AccessibilityTesting from "./Accessibility Testing";

const TABS = [
  { 
    key: "mern", 
    title: "MERN Stack Web Development", 
    accent: "emerald",
    component: MERNStack,
    icon: "⚡",
    gradient: "from-emerald-500/20 to-teal-500/10"
  },
  { 
    key: "dsa", 
    title: "Problem Solving & Logic", 
    accent: "blue",
    component: AlgorithmsAndSystemsLogic,
    icon: "🧩",
    gradient: "from-blue-500/20 to-cyan-500/10"
  },
  { 
    key: "ui", 
    title: "Product Design & Experience", 
    accent: "purple",
    component: UXDesignPrinciples,
    icon: "🎨",
    gradient: "from-purple-500/20 to-pink-500/10"
  },
  { 
    key: "a11y", 
    title: "Making Websites Work for Everyone", 
    accent: "orange",
    component: AccessibilityTesting,
    icon: "♿",
    gradient: "from-orange-500/20 to-amber-500/10"
  },
];

const colorConfig = {
  emerald: {
    text: "text-emerald-400",
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/10",
    glow: "shadow-emerald-500/50"
  },
  blue: {
    text: "text-blue-400",
    border: "border-blue-500/30",
    bg: "bg-blue-500/10",
    glow: "shadow-blue-500/50"
  },
  purple: {
    text: "text-purple-400",
    border: "border-purple-500/30",
    bg: "bg-purple-500/10",
    glow: "shadow-purple-500/50"
  },
  orange: {
    text: "text-orange-400",
    border: "border-orange-500/30",
    bg: "bg-orange-500/10",
    glow: "shadow-orange-500/50"
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0, scale: 0.95 },
  show: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 15
    }
  }
};

export default function LearningPaths({ state, setState }) {
  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem('activeTab');
    return savedTab || "mern";
  });

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  const activeTabConfig = TABS.find(tab => tab.key === activeTab);
  const ActiveComponent = activeTabConfig?.component;

  return (
    <motion.section
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="relative min-h-screen p-4 md:p-6 lg:p-8"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="mb-8"
      >
        <motion.h1
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="text-4xl md:text-5xl lg:text-6xl font-black italic tracking-tight bg-clip-text text-transparent bg-linear-to-r from-indigo-400 via-purple-500 to-pink-600"
        >
          Learning Paths
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="mt-2 text-sm md:text-base text-slate-400 font-medium"
        >
          Master the skills you need, one step at a time
        </motion.p>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        variants={itemVariants}
        className="relative mb-10"
      >
        <div className="backdrop-blur-xl bg-slate-900/50 p-3 rounded-3xl border border-white/10 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {TABS.map((tab) => {
              const colors = colorConfig[tab.accent];
              const isActive = activeTab === tab.key;
              
              return (
                <motion.button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative group"
                >
                  {/* Glow Effect */}
                  {isActive && (
                    <motion.div
                      layoutId="activeGlow"
                      className={`absolute inset-0 bg-linear-to-br ${tab.gradient} rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500`}
                    />
                  )}
                  
                  {/* Button */}
                  <div
                    className={`
                      relative overflow-hidden rounded-2xl backdrop-blur-xl p-5 transition-all duration-300
                      ${
                        isActive
                          ? `${colors.bg} border ${colors.border} shadow-lg ${colors.glow}`
                          : "bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/50 hover:border-slate-600/50"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <motion.span
                        animate={isActive ? { rotate: [0, 10, 0, -10, 0] } : {}}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="text-3xl"
                      >
                        {tab.icon}
                      </motion.span>
                      <div className="flex-1 text-left">
                        <div className={`text-sm font-bold transition-colors ${isActive ? colors.text : "text-slate-400 group-hover:text-slate-200"}`}>
                          {tab.title}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {ActiveComponent && (
            <ActiveComponent 
              state={state} 
              setState={setState} 
              stateKey={activeTab === "mern" ? "mernStack" : activeTab === "dsa" ? "dsaAndLogic" : activeTab === "ui" ? "uiDesign" : "accessibility"}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.section>
  );
}
