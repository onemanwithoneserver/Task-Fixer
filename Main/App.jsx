import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useFocusStore } from "./src/store/useFocusStore";
import { calculateProductivity } from "./src/utils/productivity";
import { usePageTitle } from "./src/hooks/usePageTitle";
import { getToday } from "./src/services/dailyService";

// Core Layout
import Header from "./src/components/Header";
import Navigation from "./src/components/Navigation";

// Pages
import Dashboard from "./src/components/Dashboard";
import Planner from "./src/components/Planner";
import LearningPaths from "./src/components/Learning Paths/Learning Paths";
import Communication from "./src/components/Communication";
import Queries from "./src/components/Queries";
import Milestones from "./src/components/Milestones";
import TodoList from "./src/components/TodoList";
import MoneyTracker from "./src/components/MoneyTracker";
import MarkdownViewer from "./src/components/MarkdownViewer";
import Settings from "./src/components/Settings";

function Layout({ children }) {
  usePageTitle(); // Updates page title based on current route
  
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Main content area with bottom padding for navigation */}
      <main className="flex-1 w-full pb-28 px-4 md:px-6 lg:px-8 pt-0 overflow-y-auto">
         {children}
      </main>
      {/* Navigation at bottom */}
      <Navigation />
    </div>
  );
}

export default function App() {
  const { state, setState } = useFocusStore();
  const [theme, setTheme] = useState(localStorage.getItem("focus_theme") || "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("light-theme", theme === "light");
    localStorage.setItem("focus_theme", theme);
  }, [theme]);

  // Load global daily status from MongoDB on app start
  useEffect(() => {
    async function loadTodayStatus() {
      try {
        const record = await getToday();

        if (record) {
          setState((prev) => ({
            ...prev,
            dailyStatus: {
              date: record.date,
              submitted: record.submitted,
            },
          }));
        } else {
          // No record for today - ensure status is reset
          const today = new Date().toISOString().split("T")[0];
          setState((prev) => ({
            ...prev,
            dailyStatus: {
              date: today,
              submitted: false,
            },
          }));
        }
      } catch (error) {
        console.error("Failed to load today's status:", error);
        // Fallback: check localStorage
        const saved = localStorage.getItem("dailyStatus");
        if (saved) {
          setState((prev) => ({
            ...prev,
            dailyStatus: JSON.parse(saved),
          }));
        }
      }
    }

    loadTodayStatus();
  }, [setState]);

  // Auto-reset on new day (MongoDB will be source of truth, but this provides immediate feedback)
  useEffect(() => {
    const checkDayChange = setInterval(() => {
      const today = new Date().toISOString().split("T")[0];
      
      if (state.dailyStatus?.date && state.dailyStatus.date !== today) {
        setState((prev) => ({
          ...prev,
          dailyStatus: {
            date: today,
            submitted: false,
          },
        }));
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkDayChange);
  }, [state.dailyStatus, setState]);

  const stats = calculateProductivity(state);

  const withProps = (Component) => (
    <Component state={state} setState={setState} stats={stats} />
  );

  return (
    <BrowserRouter>
      <Layout>
        <Header
          theme={theme}
          setTheme={setTheme}
          state={state}
          setState={setState}
        />

        <div className="max-w-7xl mx-auto w-full mt-6">
          <Routes>
            <Route path="/" element={withProps(Dashboard)} />
            <Route path="/planner" element={withProps(Planner)} />
            <Route path="/learning-paths" element={withProps(LearningPaths)} />
            <Route path="/communication" element={withProps(Communication)} />
            <Route path="/queries" element={withProps(Queries)} />
            <Route path="/milestones" element={withProps(Milestones)} />
            <Route path="/todolist" element={withProps(TodoList)} />
            <Route path="/moneytracker" element={withProps(MoneyTracker)} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/docs" element={<MarkdownViewer />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Layout>
    </BrowserRouter>
  );
}