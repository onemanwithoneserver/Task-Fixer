import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

const TABS = [
  { id: "dashboard", label: "Insight", icon: "📈", path: "/" },
  { id: "planner", label: "Planner", icon: "🗓️", path: "/planner" },
  { id: "learning", label: "Learning", icon: "💻", path: "/learning-paths" },
  { id: "comms", label: "Chat", icon: "🗣️", path: "/communication" },
  { id: "queries", label: "Queries", icon: "❓", path: "/queries" },
  { id: "archive", label: "Archive", icon: "🏆", path: "/milestones" },
  { id: "todo", label: "To-Do", icon: "✓", path: "/todolist" },
  { id: "money", label: "Money", icon: "💰", path: "/moneytracker" },
  { id: "docs", label: "Docs", icon: "📚", path: "/docs" },
];

export default function Navigation() {
  return (
    <nav
      aria-label="Main Navigation"
      className="
        fixed z-50 
        bottom-4 left-1/2 -translate-x-1/2
        w-auto max-w-fit
        px-4 py-3
        bg-[#1e293b]/95 backdrop-blur-xl 
        border border-slate-700/40
        rounded-full
        shadow-2xl shadow-black/50
        flex items-center justify-center
      "
      style={{ height: "auto" }}
    >
      <ul className="flex list-none items-center justify-center gap-2 md:gap-3">
        {TABS.map((tab) => (
          <li key={tab.id}>
            <NavItem tab={tab} />
          </li>
        ))}
      </ul>
    </nav>
  );
}

const NavItem = ({ tab }) => {
  return (
    <NavLink
      to={tab.path}
      aria-label={tab.label}
      className={({ isActive }) => `
        relative group flex items-center justify-center 
        w-12 h-12 md:w-14 md:h-14
        rounded-2xl
        transition-all duration-300
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/50
        ${isActive ? "" : "hover:bg-slate-800/40"}
      `}
    >
      {({ isActive }) => (
        <>
          {/* Active Indicator Background */}
          {isActive && (
            <motion.div
              layoutId="nav-pill"
              className="absolute inset-0 bg-teal-500/15 rounded-2xl"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}

          {/* Icon */}
          <span
            className={`
              relative z-10 text-2xl md:text-3xl
              transition-all duration-300
              ${isActive 
                ? "scale-100 opacity-100" 
                : "opacity-70 group-hover:opacity-100 group-hover:scale-105"
              }
            `}
          >
            {tab.icon}
          </span>

          {/* Tooltip */}
          <Tooltip label={tab.label} />
        </>
      )}
    </NavLink>
  );
};

const Tooltip = ({ label }) => (
  <div className="hidden md:block absolute bottom-full mb-3 left-1/2 -translate-x-1/2 pointer-events-none w-max z-50">
    <div
      className="
        opacity-0 translate-y-1 scale-95
        group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100
        transition-all duration-200 ease-out
        bg-slate-800/98 border border-slate-700/50 backdrop-blur-sm
        text-slate-200 text-[11px] font-semibold
        px-3 py-1.5 rounded-lg shadow-lg relative
      "
    >
      {label}
    </div>
  </div>
);